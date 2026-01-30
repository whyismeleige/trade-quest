const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// @todo Add Achievements

const getRandomAvatar = () => {
  const seed = crypto.randomUUID();
  const styles = [
    "adventurer", "big-smile", "fun-emoji", "lorelei", 
    "micah", "notionists", "pixel-art", "croodles",
  ];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

const MetadataSchema = new mongoose.Schema({
  ipAddress: String,
  userAgent: String,
  browser: {
    name: String,
    version: String,
    major: String,
  },
  os: {
    name: String,
    version: String,
  },
  device: {
    vendor: String,
    model: String,
    type: String,
  },
  location: {
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
  },
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      index: true,
    },
    // NEW: Link to Portfolio for 1:1 Relationship
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
    },
    avatar: {
      type: String,
      default: getRandomAvatar, // Passed function reference is cleaner
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: [0, "Total Points cannot be negative"],
      index: -1,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    activity: {
      lastLogin: {
        type: Date,
        default: Date.now,
      },
      totalLogins: [
        {
          loginTime: {
            type: Date,
            default: Date.now,
          },
          attemptsReached: {
            type: Number,
            max: [5, "Attempts cannot be more than 5"],
            default: 0,
          },
          maxAttemptsReached: {
            type: Boolean,
            default: false,
          },
          metadata: MetadataSchema,
        },
      ],
    },
    security: {
      loginAttempts: {
        type: Number,
        default: 0,
        max: 5,
      },
      lockUntil: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.methods.isLocked = function () {
  return this.security.lockUntil && Date.now() < this.security.lockUntil;
};

UserSchema.methods.passwordsMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.inSuccessfulLogin = async function () {
  this.security.loginAttempts++;
  await this.save();
};

UserSchema.methods.successfulLogin = async function (metadata) {
  this.activity.lastLogin = Date.now();
  this.activity.totalLogins.push({
    loginTime: Date.now(),
    attemptsReached: this.security.loginAttempts,
    maxAttemptsReached: this.security.loginAttempts === 5,
    metadata,
  });
  this.security.loginAttempts = 0;
  this.security.lockUntil = null;
  await this.save();
};

UserSchema.pre("save", async function () {
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    this.security.lockUntil = null;
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  if (this.security.loginAttempts === 5) {
    this.security.loginAttempts = 0;
    this.security.lockUntil = Date.now() + 5 * 60 * 1000;
  }
});

module.exports = mongoose.model("User", UserSchema);