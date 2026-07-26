const mongoose = require("mongoose");

const cabinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cabin name is required"],
      trim: true,
      unique: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      maxLength: 300,
      default: "",
    },
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  },
);

cabinSchema.methods.toJSON = function () {
  const cabinObject = this.toObject();

  if (cabinObject.image)
    cabinObject.image = `${process.env.SERVER_URL}/api/cabins/${cabinObject._id}/image`;

  cabinObject.id = cabinObject._id;
  delete cabinObject._id;
  delete cabinObject.__v;

  cabinObject.created_at = cabinObject.createdAt;
  delete cabinObject.createdAt;

  return cabinObject;
};

cabinSchema.path("discount").validate(function (value) {
  return value < this.regularPrice;
}, "Discount must be less than the regular price");

const Cabin = mongoose.model("Cabin", cabinSchema);

module.exports = Cabin;
