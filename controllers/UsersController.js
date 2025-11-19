import { ObjectId } from "mongodb";
import { generateTimeStamp } from "../lib/until.js";

export const createUser = async (req, res, collection) => {
  try {
    const bodyData = req.body;
    const query = { email: bodyData.email };
    const user = await collection.findOne(query);

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const userData = {
      name: bodyData.name || null,
      email: bodyData.email || null,
      role: bodyData.role || null,
      avatar: bodyData.avatar || null,
      createdAt: generateTimeStamp(),
      updatedAt: generateTimeStamp("updatedAt"),
    };
    const result = await collection.insertOne(userData);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getUser = async (req, res, collection) => {
  try {
    const { userId } = req.params;
    const query = { _id: new ObjectId(userId) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

export const updateUser = async (req, res, collection) => {
  try {
    const { userId } = req.params;
    const bodyData = req.body;
    const query = { _id: new ObjectId(userId) };
    const user = await collection.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

export const deleteUser = async (req, res, collection) => {
  try {
    const { userId } = req.params;
    const query = { _id: new ObjectId(userId) };
    const user = await collection.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await collection.deleteOne(query);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};
