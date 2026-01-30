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
 * @description Register New User
 * @route POST /api/auth/register
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ValidationError("Enter Valid Input");
  }

  // Check if user already exists to prevent duplicate registrations
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AuthenticationError("User already exists");
  }

  // Extract request metadata (IP, user agent, etc) for security tracking
  const metadata = getMetaData(req);

  // Create new user with local provider
  // Password will be hashed by pre-save hook in User model
  const newUser = await User.create({
    email,
    name,
    password,
    activity: {
      totalLogins: [
        {
          metadata,
        },
      ],
    },
  });

  // Generate JWT Token
  const token = createToken({
    id: newUser._id,
  });

  res.cookie("token", token, getCookieOptions());

  res.status(201).send({
    message: "User registered successfully",
    type: "success",
    user: sanitizeUser(newUser), // Remove sensitive fields before sending
  });
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

  // Explicitly select password field (excluded by default in schema)
  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    throw new AuthenticationError("User does not exist. Please Register");
  }

  // Check if account is locked due to failed login attempts
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
    // Track failed login attempt (may trigger account lock)
    await userExists.inSuccessfulLogin();
    throw new AuthenticationError("Passwords do not match");
  }

  // Generate JWT Tokens for authentication
  const token = createToken({
    id: userExists._id,
  });

  // Update login tracking and store refresh token
  await userExists.successfulLogin(metadata);

  // Set HttpOnly Cookie
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