import { ObjectId } from "mongodb";
import { generateTimeStamp } from "../lib/until.js";

export const createOrder = async (req, res, collection) => {
  try {
    const bodyData = req.body;
    const result = await collection.insertOne(bodyData);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getOrders = async (req, res, collection) => {
  try {
    const cursor = await collection.find();
    const result = await cursor.toArray();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getOrderBySellerEmail = async (req, res, collection) => {
  try {
    const { sellerEmail } = req.params;
    const query = { sellerEmail: sellerEmail };
    const cursor = await collection.find(query);
    const result = await cursor.toArray();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getOrder = async (req, res, collection) => {
  try {
    const { orderId } = req.params;
    const query = { _id: new ObjectId(orderId) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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

export const updateOrder = async (req, res, collection) => {
  try {
    const { orderId } = req.params;
    const bodyData = req.body;
    const query = { _id: new ObjectId(orderId) };
    const order = await collection.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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

export const deleteOrder = async (req, res, collection) => {
  try {
    const { orderId } = req.params;
    const query = { _id: new ObjectId(orderId) };
    const order = await collection.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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
