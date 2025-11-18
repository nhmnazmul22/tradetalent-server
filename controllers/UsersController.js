export const createUser = async (req, res, collection) => {
  try {
    const bodyData = req.body;

    const result = await collection.insertOne(bodyData);
  } catch (err) {
    return res.json({
      success: false,
      message: err?.message || "Something went wrong!!",
    });
  }
};
