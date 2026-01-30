const mongoose = require("mongoose"); // Required for transactions
const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

const {
  ValidationError,
  AuthenticationError,
} = require("../utils/error.utils");
const {
  getMetaData,
  createToken,
  sanitizeUser,
} = require("../utils/auth.utils");

const User = db.user;
const Portfolio = db.portfolio;

// Get Cookie Options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

/**
 * @description Get User Profile
 * @route GET /api/auth/profile
 */
exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).send({
    user: sanitizeUser(req.user),
    message: "User Profile Sent",
    type: "success",
  });
});

/**
 * @description Register New User with Automatic Portfolio
 * @route POST /api/auth/register
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ValidationError("Enter Valid Input");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AuthenticationError("User already exists");
  }

  const metadata = getMetaData(req);

  // --- START TRANSACTION ---
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create User
    // We use array syntax [] for create with session, 
    // or use new User().save({ session })
    const [newUser] = await User.create([{
      email,
      name,
      password,
      activity: {
        totalLogins: [{ metadata }],
      },
    }], { session });

    // 2. Create Portfolio linked to this User
    const [newPortfolio] = await Portfolio.create([{
      userId: newUser._id,
      cashBalance: 100000,
      totalValue: 100000,
      holdings: []
    }], { session });

    // 3. Link Portfolio ID back to User (for easy populate)
    newUser.portfolio = newPortfolio._id;
    await newUser.save({ session });

    // 4. Commit Transaction
    await session.commitTransaction();

    // --- END TRANSACTION ---

    // Generate JWT Token
    const token = createToken({
      id: newUser._id,
    });

    res.cookie("token", token, getCookieOptions());

    res.status(201).send({
      message: "User registered successfully",
      type: "success",
      user: sanitizeUser(newUser),
      portfolioId: newPortfolio._id 
    });

  } catch (error) {
    // If anything fails (User created but Portfolio failed), roll back everything
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @description Login User
 * @route POST /api/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Enter Valid Input");
  }

  const metadata = getMetaData(req);

  // Explicitly select password field
  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    throw new AuthenticationError("User does not exist. Please Register");
  }

  // Check if account is locked
  if (userExists.isLocked()) {
    const minutesLeft = Math.ceil(
      (userExists.security.lockUntil - Date.now()) / (1000 * 60)
    );
    throw new AuthenticationError(
      `Account is Locked, \nDue to Repeated Incorrect Login Attempts,\nTry after ${minutesLeft} minutes`
    );
  }

  const passwordsMatch = await userExists.passwordsMatch(password);

  if (!passwordsMatch) {
    await userExists.inSuccessfulLogin();
    throw new AuthenticationError("Passwords do not match");
  }

  const token = createToken({
    id: userExists._id,
  });

  await userExists.successfulLogin(metadata);

  res.cookie("token", token, getCookieOptions());

  res.status(200).send({
    message: "User Logged In Successfully",
    type: "success",
    user: sanitizeUser(userExists),
  });
});

/**
 * @description Logout User
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).send({
    message: "Logged Out Successfully",
    type: "success",
  });
};