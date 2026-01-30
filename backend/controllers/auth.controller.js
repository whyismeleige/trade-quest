const crypto = require("crypto");
const axios = require("axios");

const db = require("../models");
const redisClient = require("../database/redis")
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

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const REDIS_TTL = 300;

// Get Cookie Options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

/**
 * @description Helper: Generate a random code for the exchange mechanism
 */
const generateExchangeCode = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * @description Helper: Handle Social User Creation/Retrieval
 * Validates existence, creates if new, and tracks login activity
 */
const handleSocialUser = async (profile, req) => {
  const { email, name, provider, providerId } = profile;

  // 1. Try to find user by Email
  let user = await User.findOne({ email });

  const metadata = getMetaData(req);

  if (user) {
    // 2a. User exists: Update provider info if missing and track login
    if (!user.provider) {
      user.provider = provider;
      user.providerId = providerId;
    }
    
    // Check locked status
    if (user.isLocked && user.isLocked()) {
       throw new AuthenticationError("Account is Locked. Please try again later.");
    }
    
    await user.successfulLogin(metadata);
    await user.save();
  } else {
    // 2b. User does not exist: Create new user
    // Note: We generate a random complex password since they use social login
    const randomPassword = crypto.randomBytes(16).toString("hex") + "A1!";
    
    user = await User.create({
      email,
      name,
      password: randomPassword,
      provider,
      providerId,
      isVerified: true, // Social logins are usually verified by the provider
      activity: {
        totalLogins: [{ metadata }],
      },
    });
  }

  return user;
};

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
 * @description Google Callback Handler
 * @route GET /api/auth/google/callback
 */
exports.googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query; // Code from Google

  if (!code) throw new AuthenticationError("Google Code not provided");

  // 1. Exchange Google Code for Tokens
  const { data: tokenData } = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
  });

  // 2. Get User Profile from Google
  const { data: profileData } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  // 3. Process User (Find or Create)
  const user = await handleSocialUser({
    email: profileData.email,
    name: profileData.name,
    provider: "google",
    providerId: profileData.id
  }, req);

  // 4. Generate Internal Session Data
  const accessToken = createToken({ id: user._id });
  const internalCode = generateExchangeCode();

  // 5. Store in Redis
  const authData = {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: null, // Add if you use refresh tokens
  };

  await redisClient.set(`auth:${internalCode}`, JSON.stringify(authData), 'EX', REDIS_TTL);

  // 6. Redirect to Frontend with the Internal Code
  res.redirect(`${FRONTEND_URL}/auth/callback?code=${internalCode}`);
});

/**
 * @description GitHub Callback Handler
 * @route GET /api/auth/github/callback
 */
exports.githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query; // Code from GitHub

  if (!code) throw new AuthenticationError("GitHub Code not provided");

  // 1. Exchange GitHub Code for Token
  const { data: tokenData } = await axios.post("https://github.com/login/oauth/access_token", {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  }, { headers: { Accept: 'application/json' } });

  if (tokenData.error) throw new AuthenticationError("GitHub Auth Failed");

  // 2. Get User Profile
  const { data: profileData } = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  // 2a. GitHub emails can be private, fetch them explicitly
  let email = profileData.email;
  if (!email) {
    const { data: emails } = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const primary = emails.find(e => e.primary && e.verified);
    email = primary ? primary.email : null;
  }

  if (!email) throw new AuthenticationError("No verified email found on GitHub account");

  // 3. Process User
  const user = await handleSocialUser({
    email: email,
    name: profileData.name || profileData.login,
    provider: "github",
    providerId: profileData.id.toString()
  }, req);

  // 4. Generate Internal Session
  const accessToken = createToken({ id: user._id });
  const internalCode = generateExchangeCode();

  // 5. Store in Redis
  const authData = {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: null,
  };

  await redisClient.set(`auth:${internalCode}`, JSON.stringify(authData), 'EX', REDIS_TTL);

  // 6. Redirect to Frontend
  res.redirect(`${FRONTEND_URL}/auth/callback?code=${internalCode}`);
});

/**
 * @description Exchange Internal Code for User Session (Your requested function)
 * @route POST /api/auth/exchange-code
 */
exports.exchangeCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new AuthenticationError("Exchange Code is required");
  }

  // 1. Retrieve data from Redis
  const dataString = await redisClient.get(`auth:${code}`);

  if (!dataString) {
    throw new AuthenticationError(
      "Authentication Session Expired or Invalid. Please Try Again."
    );
  }

  const authData = JSON.parse(dataString);

  // 2. Cleanup (One-time use)
  await redisClient.del(`auth:${code}`);

  // 3. Set Cookie (Syncing with your existing login logic)
  res.cookie("token", authData.accessToken, getCookieOptions());

  res.status(200).send({
    message: "Successful Login",
    type: "success",
    user: authData.user,
    accessToken: authData.accessToken,
    // If you implemented refresh tokens in the createToken step, return it here
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