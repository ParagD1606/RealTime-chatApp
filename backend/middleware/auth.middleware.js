import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const authMiddleware = (req, res, next)=>{
    const header = req.headers.authorization;

    if(!header){
        return res.status(401).json({message: "No token provided"})
    }

    const token = header.split(" ")[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(401).json({message: "invalid token"})
    }
}

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};