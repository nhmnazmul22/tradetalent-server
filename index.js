import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "./controllers/UsersController.js";
import {
  createSellerProfile,
  getSellerProfile,
  getSellerProfiles,
  updateSellerProfile,
} from "./controllers/SellerProfileController.js";
import {
  createService,
  deleteService,
  getService,
  getServices,
  getServicesBySellerId,
  updateService,
} from "./controllers/ServiceController.js";
import {
  createOrder,
  getOrderByBuyerId,
  getOrderBySellerId,
  getOrders,
} from "./controllers/OrderController.js";

// Initialize Apps
const app = express();
const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is ok!" });
});

// Database Connection
async function runDB() {
  try {
    await client.connect();
    const database = await client.db("tradeTalent");
    // Collection
    const usersColl = database.collection("users");
    const sellerProfileColl = database.collection("sellerProfiles");
    const servicesColl = database.collection("services");
    const ordersColl = database.collection("orders");

    // Users Routes
    app.post("/create-user", (req, res) => createUser(req, res, usersColl));
    app.get("/user/:userId", (req, res) => getUser(req, res, usersColl));
    app.put("/user/:userId", (req, res) => updateUser(req, res, usersColl));
    app.delete("/user/:userId", (req, res) => deleteUser(req, res, usersColl));

    // Seller Routes
    app.get("/seller-profiles", (req, res) =>
      getSellerProfiles(req, res, sellerProfileColl)
    );
    app.post("/seller-profile", (req, res) =>
      createSellerProfile(req, res, sellerProfileColl)
    );
    app.get("/seller-profile/:userId", (req, res) =>
      getSellerProfile(req, res, sellerProfileColl)
    );
    app.put("/seller-profile/:userId", (req, res) =>
      updateSellerProfile(req, res, sellerProfileColl)
    );

    // Services Routes
    app.get("/services", (req, res) => getServices(req, res, servicesColl));
    app.get("/my-services/:sellerId", (req, res) =>
      getServicesBySellerId(req, res, servicesColl)
    );
    app.post("/services", (req, res) => createService(req, res, servicesColl));
    app.get("/services/:serviceId", (req, res) =>
      getService(req, res, servicesColl)
    );
    app.put("/services/:serviceId", (req, res) =>
      updateService(req, res, servicesColl)
    );
    app.delete("/services/:serviceId", (req, res) =>
      deleteService(req, res, servicesColl)
    );

    // Order Routes
    app.get("/orders", (req, res) => getOrders(req, res, ordersColl));
    app.get("/seller-orders/:sellerId", (req, res) =>
      getOrderBySellerId(req, res, ordersColl)
    );
    app.get("/buyer-orders/:buyerId", (req, res) =>
      getOrderByBuyerId(req, res, ordersColl)
    );
    app.post("/create-order", (req, res) => createOrder(req, res, ordersColl));
    app.get("/orders/:orderId", (req, res) => getService(req, res, ordersColl));
    app.put("/orders/:orderId", (req, res) =>
      updateService(req, res, ordersColl)
    );
    app.delete("/orders/:orderId", (req, res) =>
      deleteService(req, res, ordersColl)
    );

    //  Ping the database
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

runDB().catch(console.dir);

// Listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
