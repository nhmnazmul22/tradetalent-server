import { ObjectId } from "mongodb";
import { generateTimeStamp } from "../lib/until.js";

export const createService = async (req, res, collection) => {
  try {
    const bodyData = req.body;
    const serviceData = {
      sellerId: new ObjectId(bodyData.sellerId) || null,
      title: bodyData.title || null,
      description: bodyData.description || null,
      category: bodyData.category || null,
      price: bodyData.price || null,
      images: bodyData.images || null,
      rating: 0,
      totalReviews: 0,
      pricing: bodyData.pricing || null,
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

export const getServicesBySellerId = async (req, res, collection) => {
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
    const bodyData = req.body;
    const query = { _id: new ObjectId(serviceId) };
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
