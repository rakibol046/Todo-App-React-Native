const jwt = require("jsonwebtoken");
const User = require("../../models/People");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Authorization Header not found");
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authorization Token not found");
    }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodeToken) {
      throw new Error("Token is not valid, add valid token");
    }

   
    const id = decodeToken.userId;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new Error("You don't have access to database");
    }

    req.userId = id;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
      status: "Failed to Authorize!",
      error: true,
    });
  }
};
