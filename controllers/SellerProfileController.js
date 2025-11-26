import { ObjectId } from "mongodb";
import { generateTimeStamp } from "../lib/until.js";

export const getSellerProfiles = async (req, res, collection) => {
  try {
    const cursor = await collection.find({});
    const result = await cursor.toArray();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getTopSellerProfiles = async (req, res, collection) => {
  try {
    const cursor = await collection.find({}).limit(8);
    const result = await cursor.toArray();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const createSellerProfile = async (req, res, collection) => {
  try {
    const bodyData = req.body;

    if (!bodyData.userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const query = { userEmail: bodyData.userEmail };
    const sellerProfile = await collection.findOne(query);

    if (sellerProfile) {
      return res.status(400).json({
        success: false,
        message: "SellerProfile already exist for this user",
      });
    }

    const result = await collection.insertOne(bodyData);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getSellerProfile = async (req, res, collection) => {
  try {
    const { userEmail } = req.params;
    const query = { userEmail: userEmail };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Seller Profile not found for this user",
      });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const updateSellerProfile = async (req, res, collection) => {
  try {
    const { userEmail } = req.params;
    const query = { userEmail: userEmail };
    const bodyData = req.body;
    const sellerProfile = await collection.findOne(query);

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: "Seller Profile not found for this user",
      });
    }

    const updatedData = {
      $set: {
        ...bodyData,
        updatedAt: generateTimeStamp("updatedAt"),
      },
    };

    const result = await collection.updateOne(query, updatedData);
    return res.status(202).json({ success: true, data: result });
  } catch (err) {
    return res.json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};
