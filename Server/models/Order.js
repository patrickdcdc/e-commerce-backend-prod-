// models/Order.js

const mongoose = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: String,
    required: true,
    trim: true,
  },
  cart: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        //required: true,
        trim: true, // Made optional
      },
      description: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      image: {
        type: String,
        trim: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: () => moment().tz("Africa/Nairobi").toDate(),
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
