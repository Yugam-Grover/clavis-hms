const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { AppError } = require("../utils/errorHandlers");

const auth = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    const authHeader = req.header("Authorization");
    token = authHeader && authHeader.replace("Bearer ", "");
  }
  if (!token)
    return next(new AppError("You are not logged in. Please log in.", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("User no longer exists", 401));
  req.user = user;
  next();
});

module.exports = auth;
