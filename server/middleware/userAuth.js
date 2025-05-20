import jwt from "jsonwebtoken";

// Authenticate the request by verifying the JWT cookie
const userAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ status: false, message: "Not Authorized." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res
        .status(401)
        .json({ status: false, message: "Not Authorized." });
    }

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: error.message });
  }
};

export default userAuth;
