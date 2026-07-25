const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { AppError } = require("../utils/errorHandlers");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  if (userObject.avatar)
    userObject.avatar = `${process.env.SERVER_URL}/api/auth/${userObject._id}/avatar`;

  delete password;

  return userObject;
};

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Unable to login", 401);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Unable to login", 401);

  return user;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
