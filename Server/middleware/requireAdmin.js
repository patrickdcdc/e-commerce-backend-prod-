//Server/middleware/requireAdmin.js

const admin = require("firebase-admin");

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format" });
  }

  const idToken = authHeader.split("Bearer")[1].trim();

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin) {
      req.user = decodedToken;
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(401).json({ message: "invalid token" });
  }
};

module.exports = requireAdmin;
