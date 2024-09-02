// Server/routes/admin.js

const express = require("express");
const admin = require("firebase-admin");
const requireAdmin = require("../middleware/requireAdmin");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();

//Endpoint to check if a user is an admin(firebase)
router.get("/check-admin/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await admin.auth().getUserByEmail(email);
    const claims = user.customClaims;

    if (claims && claims.admin) {
      res.json({ message: `${email} is an admin` });
    } else {
      res.json({ message: `${email} is not an admin` });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Endpoint to get user information by email
router.get("/get-user-by-email", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Endpoint to set user as admin
router.patch("/make-admin/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    //validate and convert the userId to a MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //set custom claims in Firebase
    const firebaseUser = await admin.auth().getUserByEmail(user.email);
    await admin.auth().setCustomUserClaims(firebaseUser.uid, { admin: true });

    //Update the user in MongoDB
    user.isAdmin = true;
    await user.save();

    res.json({ message: "User updated to admin", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Admin product routes
router.get("/admin/products", requireAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/admin/products", requireAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Admin order routes
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Admin user routes
router.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
