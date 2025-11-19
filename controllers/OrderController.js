import { ObjectId } from "mongodb";
import { generateTimeStamp } from "../lib/until.js";

export const createOrder = async (req, res, collection) => {
  try {
    const bodyData = req.body;
    const serviceData = {
      buyerId: new ObjectId(bodyData.buyerId),
      sellerId: new ObjectId(bodyData.sellerId),
      serviceId: new ObjectId(bodyData.serviceId),
      package: bodyData.package || null,
      price: bodyData.price || null,
      status: "pending",
      createdAt: generateTimeStamp(),
      updatedAt: generateTimeStamp("updatedAt"),
    };
    const result = await collection.insertOne(serviceData);
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

export const getOrderBySellerId = async (req, res, collection) => {
  try {
    const { sellerId } = req.params;
    const query = { sellerId: new ObjectId(sellerId) };
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

export const getOrderByBuyerId = async (req, res, collection) => {
  try {
    const { buyerId } = req.params;
    const query = { buyerId: new ObjectId(buyerId) };
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
