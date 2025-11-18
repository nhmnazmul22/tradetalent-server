import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

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

    // Users Routes
    app.post("/create-user", () => {});
    app.get("/user/:userId", () => {});
    app.put("/user/:userId", () => {});
    app.delete("/users/:userId", () => {});

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
