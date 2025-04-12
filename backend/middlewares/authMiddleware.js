import jwt from "jsonwebtoken"
import { JSON_WEB_TOKEN } from "../config/serverConfig.js";
const isAuthenticated = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2YzYzY5YjlkMTQ0OGI4YzFjNTgwNjIiLCJlbWFpbCI6Im1lZGFoYXJzaGExN0BnbWFpbC5jb20iLCJpc0xlbmRlciI6ZmFsc2UsImlzQm9ycm93ZXIiOmZhbHNlLCJpYXQiOjE3NDQzNTA4MzYsImV4cCI6MTc0NDQzNzIzNn0.Y9x4QwcZEtndBKOT6ejm7M4AyMlTzJVhelYozyj9ABk";
    if (!token) return res.status(401).json({ success:false,message: "Not authorized" });

    const decoded = jwt.verify(token,JSON_WEB_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success:false,message: "Invalid token",err:err.message });
  }
};
export default isAuthenticated;
