const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: Number,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numNights: {
      type: Number,
      required: true,
    },
    numGuests: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    cabinPrice: {
      type: Number,
      required: true,
    },
    extraPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["unconfirmed", "checked-in", "checked-out"],
      default: "unconfirmed",
    },
    hasBreakfast: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    observations: {
      type: String,
      default: "",
    },
    cabin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cabin",
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.methods.toJSON = function () {
  const bookingObject = this.toObject();

  bookingObject.id = bookingObject._id;

  delete bookingObject._id;
  delete bookingObject.__v;

  bookingObject.created_at = bookingObject.createdAt;
  delete bookingObject.createdAt;

  return bookingObject;
};

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});
const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

bookingSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "bookingNumber" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true },
    );
    this.bookingNumber = counter.seq;
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
