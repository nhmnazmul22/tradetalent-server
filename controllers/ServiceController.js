import { ObjectId } from "mongodb";
import { generateTimeStamp } from "../lib/until.js";

export const createService = async (req, res, collection) => {
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

export const getServices = async (req, res, collection) => {
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

export const getFeaturedServices = async (req, res, collection) => {
  try {
    const cursor = await collection.find({}).limit(6);
    const result = await cursor.toArray();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};

export const getServicesBySellerEmail = async (req, res, collection) => {
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

export const getService = async (req, res, collection) => {
  try {
    const { serviceId } = req.params;
    const query = { _id: new ObjectId(serviceId) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
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

export const updateService = async (req, res, collection) => {
  try {
    const { serviceId } = req.params;
    const query = { _id: new ObjectId(serviceId) };
    const bodyData = req.body;
    const service = await collection.findOne(query);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
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

export const deleteService = async (req, res, collection) => {
  try {
    const { serviceId } = req.params;
    const query = { _id: new ObjectId(serviceId) };
    const service = await collection.findOne(query);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
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
