//server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");
const Product = require("./models/Product");
const Order = require("./models/Order");
const authRoutes = require("./middleware/auth");
const adminRoutes = require("./middleware/requireAdmin");

// Initialize Firebase Admin SDK
//const serviceAccount = require("C:/VSCODE/NODE JS/E-commerce1-success/e-store-86806-firebase-adminsdk-mfjfh-c53b6195fc.json");

//admin.initializeApp({
//credential: admin.credential.cert(serviceAccount),
//});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); //Use the cors middleware

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/products_db", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    //Seed the database only if connected to MongoDB
    seedDatabase();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", authRoutes); // Ensure this route is necessary and correctly implemented

//Function to seed initial data into the database
const seedDatabase = async () => {
  try {
    await Product.deleteMany(); //clear existing data

    const products = [
      {
        name: "Samsung 990 Evo ssd 1TB",
        type: "Storage",
        description:
          "PCle Gen 4x4, Gen 5x2 M.2 2280 NVMe Internal Solid State Drive, Speeds upto 5,000 MB/S, Upgrade Storage for PC Computer, laptop, MZV9E1T0B/AM, Black",
        price: 350,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2FSamsung%201TB%20SSD_.jpg?alt=media&token=c3581740-f997-48fd-88bd-ea639bd642a9",
      },

      {
        name: "HP 2023 Envy x360",
        type: "Laptops",
        description:
          "15.6 inch, AMD Ryzen 5 5625U, 32GB RAM, 1TB SSD, Fast Charge, Webcam ",
        price: 2500,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2Fhp%20envy%20x360.jpg?alt=media&token=3d08aafd-cc99-4199-828a-47a85d05e3f1",
      },

      {
        name: "Z-Edge 27-inch Curved Gaming Monitor",
        type: "Monitor",
        description:
          "16:9 1920X1080 240Hz 1ms Frameless LED Gaming Monitor, UG27P AMD Freesync Premium Display Port HDMI",
        price: 450,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2FZ-Edge%20monitor.jpg?alt=media&token=37b10f47-647d-4506-a986-2e34a3bc7361",
      },

      {
        name: "CISCO-SG220 Managed smart switch",
        type: "Network",
        description:
          "50 port 375W PoE, 2 Gigabit Ethernet Combo, port mirroring, spanning tree, Access Control List(ACL)",
        price: 1200,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2FManaged-Switch-CISCO-SG220-50P-K9-50-Port-PoE-Smart-Switch-Gigabit.png?alt=media&token=d2b70190-f93a-4a1a-90af-4801ab745d53",
      },

      {
        name: "Hik Vision 8MP IP PoE Dome Camera",
        type: "Cameras",
        description:
          "DS-2CD2183G2-I Acusense, 2.8mm Wide Angle, 3-Axis, Indoor Outdoor",
        price: 5000,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2FDome%20camera.jpg?alt=media&token=26d55df1-fa46-4b84-a643-b44309a11fbc",
      },

      {
        name: "AULA F99 Wireless Mechanical Keyboard",
        type: "Keyboard",
        description:
          "Tri-Mode BT5.O/2.4GHz/USB-C Hot swappable Custom Keyboard, RGB Backlit",
        price: 800,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2FKeyboard.jpg?alt=media&token=ae45df8f-8bd3-4c69-8167-c4bf7a60f911",
      },

      {
        name: "HP OfficeJet 8015e ",
        type: "Printers",
        description: "Wireless, Color, All-in-One Printer",
        price: 250,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2Fhp%20printer.jpg?alt=media&token=d21b9956-7681-4ca9-90d0-e3e2ff1c5645",
      },

      {
        name: "LG 65-Inch Class UR9000 Series",
        type: "Tvs",
        description:
          "Alexa Built-in 4K Smart TV(3840 X 2160), Bluetooth, Wi-Fi, USB, Ethernet, HDMI 60Hz Refresh Rate, AI-Powered 4k",
        price: 700,
        image:
          "https://firebasestorage.googleapis.com/v0/b/e-store-86806.appspot.com/o/e-store%20pictures%2Flg%20tv.jpg?alt=media&token=f9a3075f-d428-46ed-9f57-1dbce2df6152",
      },
    ];

    await Product.insertMany(products);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

//Define API endpoint for fetching all products
app.get("/api/products", async (req, res) => {
  try {
    //Fetch all products from the database
    const allProducts = await Product.find();
    //send the entire products array as JSON response
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add new product(admin)
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
});

//Edit an existing product(admin)
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error editing product" });
  }
});

//Delete a product(Admin)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

//Fetch all orders(Admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

//Delete an order(view order, admin)
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting order" });
  }
});

//Checkout component endpoint
app.post("/api/checkout", async (req, res) => {
  const { fullName, email, phone, address, city, state, zip, cart } = req.body;

  if (!cart || !Array.isArray(cart)) {
    return res
      .status(400)
      .json({ error: "Cart is required and must be an array" });
  }

  try {
    // Fetch the full product details for each item in the cart
    const enrichedCart = await Promise.all(
      cart.map(async (itemId) => {
        const product = await Product.findById(itemId);
        if (!product) {
          throw new Error(`Product with ID ${itemId} not found`);
        }
        return {
          _id: product._id,
          name: product.name,
          type: product.type,
          description: product.description,
          price: product.price,
          image: product.image,
        };
      })
    );

    const totalPrice = enrichedCart.reduce((sum, item) => sum + item.price, 0);

    if (!fullName || !email || !phone || !address || !city || !state || !zip) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newOrder = new Order({
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      cart: enrichedCart, // Store the enriched cart with full product details
      totalPrice,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
