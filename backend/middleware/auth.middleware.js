const { verifyToken } = require("../utils/auth.utils");
const User = require("../models").user;
const redisClient = require("../database/redis");

exports.authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized Access",
      type: "error",
    });
  }

  try {
    const { id } = verifyToken(token);

    let user = await redisClient.get(id);

    if (!user) {
      user = await User.findById(id);
      await redisClient.setEx(id, 300, JSON.stringify(user));
    } else {
      user = User.hydrate(JSON.parse(user));
    }


    if (!user) {
      await redisClient.del(id);
      return res.status(400).send({
        message: "User Not Found",
        type: "error",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("The error is:", error);
    return res.status(403).send({
      message: "Unauthorized Access",
      type: "error",
    });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({
        message: "Access Forbidden",
        type: "error",
      });
    }
    next();
  };
};