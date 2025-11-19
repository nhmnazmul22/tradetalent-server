export const verifyFirebaseToken = async (req, res, next, firebaseAdmin) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userInfo = await firebaseAdmin.auth().verifyIdToken(token);
    req.headers.userEmail = userInfo.email;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
