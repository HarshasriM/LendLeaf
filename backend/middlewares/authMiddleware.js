import jwt from "jsonwebtoken"
import { JSON_WEB_TOKEN } from "../config/serverConfig.js";
const isAuthenticated = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyNmY3ZGUxODUzZTc2ZWQ5OGRmYmMiLCJlbWFpbCI6Im1lZGFoYXJzaGExN0BnbWFpbC5jb20iLCJpc0xlbmRlciI6ZmFsc2UsImlzQm9ycm93ZXIiOmZhbHNlLCJpYXQiOjE3NDQ5OTE5OTIsImV4cCI6MTc0NTA3ODM5Mn0.vD7XbjrLEKjI-c8EmK4xhLBNDWE7gc5fiuLY9UYvHMA";
    if (!token) return res.status(401).json({ success:false,message: "Not authorized" });

    const decoded = jwt.verify(token,JSON_WEB_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success:false,message: "Invalid token",err:err.message });
  }
};
export default isAuthenticated;
