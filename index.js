import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import firebaseAdmin from "firebase-admin";

import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "./controllers/UsersController.js";

import {
  createSellerProfile,
  getSellerProfile,
  getSellerProfileBySellerId,
  getSellerProfiles,
  getTopSellerProfiles,
  updateSellerProfile,
} from "./controllers/SellerProfileController.js";

import {
  createService,
  deleteService,
  getFeaturedServices,
  getService,
  getServices,
  getServicesBySellerEmail,
  updateService,
} from "./controllers/ServiceController.js";

import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrderBySellerEmail,
  updateOrder,
} from "./controllers/OrderController.js";

import { verifyFirebaseToken } from "./middlewares/tokenVerify.js";


const app = express();
app.use(cors({ origin: "https://tradetalent-76cb3.web.app" }));
app.use(express.json());


const decoded = Buffer.from(process.env.SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}

const verifyFirebaseAuthToken = (req, res, next) =>
  verifyFirebaseToken(req, res, next, firebaseAdmin);

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) return cachedDb;

  const client = new MongoClient(process.env.DATABASE_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db("tradeTalent");

  cachedClient = client;
  cachedDb = db;
  return db;
}


app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is ok!" });
});

// Users Routes
app.post("/create-user", async (req, res) => {
  const db = await connectToDatabase();
  createUser(req, res, db.collection("users"));
});
app.get("/user/:email", async (req, res) => {
  const db = await connectToDatabase();
  getUser(req, res, db.collection("users"));
});
app.put("/user/:email", async (req, res) => {
  const db = await connectToDatabase();
  updateUser(req, res, db.collection("users"));
});
app.delete("/user/:email", async (req, res) => {
  const db = await connectToDatabase();
  deleteUser(req, res, db.collection("users"));
});

// Seller Routes
app.get("/seller-profiles", async (req, res) => {
  const db = await connectToDatabase();
  getSellerProfiles(req, res, db.collection("sellerProfiles"));
});
app.get("/top-seller-profiles", async (req, res) => {
  const db = await connectToDatabase();
  getTopSellerProfiles(req, res, db.collection("sellerProfiles"));
});
app.post("/seller-profile", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  createSellerProfile(req, res, db.collection("sellerProfiles"));
});
app.get("/profile/:userEmail", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  getSellerProfile(req, res, db.collection("sellerProfiles"));
});
app.get(
  "/seller-profile/:sellerId",
  verifyFirebaseAuthToken,
  async (req, res) => {
    const db = await connectToDatabase();
    getSellerProfileBySellerId(req, res, db.collection("sellerProfiles"));
  }
);
app.put(
  "/seller-profile/:userEmail",
  verifyFirebaseAuthToken,
  async (req, res) => {
    const db = await connectToDatabase();
    updateSellerProfile(req, res, db.collection("sellerProfiles"));
  }
);

// Services Routes
app.get("/services", async (req, res) => {
  const db = await connectToDatabase();
  getServices(req, res, db.collection("services"));
});
app.get("/featured-services", async (req, res) => {
  const db = await connectToDatabase();
  getFeaturedServices(req, res, db.collection("services"));
});
app.get(
  "/my-services/:sellerEmail",
  verifyFirebaseAuthToken,
  async (req, res) => {
    const db = await connectToDatabase();
    getServicesBySellerEmail(req, res, db.collection("services"));
  }
);
app.post("/services", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  createService(req, res, db.collection("services"));
});
app.get("/services/:serviceId", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  getService(req, res, db.collection("services"));
});
app.put("/services/:serviceId", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  updateService(req, res, db.collection("services"));
});
app.delete(
  "/services/:serviceId",
  verifyFirebaseAuthToken,
  async (req, res) => {
    const db = await connectToDatabase();
    deleteService(req, res, db.collection("services"));
  }
);

// Order Routes
app.get(
  "/seller-orders/:sellerEmail",
  verifyFirebaseAuthToken,
  async (req, res) => {
    const db = await connectToDatabase();
    getOrderBySellerEmail(req, res, db.collection("orders"));
  }
);
app.post("/create-order", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  createOrder(req, res, db.collection("orders"));
});
app.get("/orders/:orderId", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  getOrder(req, res, db.collection("orders"));
});
app.put("/orders/:orderId", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  updateOrder(req, res, db.collection("orders"));
});
app.delete("/orders/:orderId", verifyFirebaseAuthToken, async (req, res) => {
  const db = await connectToDatabase();
  deleteOrder(req, res, db.collection("orders"));
});

// -------------------- Server Listener --------------------
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
