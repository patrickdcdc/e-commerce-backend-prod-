// Server/middleware/auth.js

const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/firebase-signup",
  // Validate incoming data
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("uid").notEmpty().withMessage("UID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, uid } = req.body;

    try {
      //Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      //Create a new user
      const newUser = new User({
        email,
        uid, // Save Firebase UID for reference
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
