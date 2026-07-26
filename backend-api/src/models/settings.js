const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    minBookingLength: {
      type: Number,
      default: 2,
    },
    maxBookingLength: {
      type: Number,
      default: 90,
    },
    maxGuestsPerBooking: {
      type: Number,
      default: 10,
    },
    breakfastPrice: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);

settingSchema.methods.toJSON = function () {
  const settingsObject = this.toObject();

  settingsObject.id = settingsObject._id;
  delete settingsObject._id;
  delete settingsObject.__v;

  settingsObject.created_at = settingsObject.createdAt;
  delete settingsObject.createdAt;

  return settingsObject;
};

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
