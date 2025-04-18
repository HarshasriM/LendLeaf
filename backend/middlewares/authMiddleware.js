import jwt from "jsonwebtoken"
import { JSON_WEB_TOKEN } from "../config/serverConfig.js";
const isAuthenticated = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZiZWRhNjBiNzI1NDk5YWNlNzUzMjQiLCJlbWFpbCI6Im1lZGFoYXJzaGExN0BnbWFpbC5jb20iLCJpc0xlbmRlciI6ZmFsc2UsImlzQm9ycm93ZXIiOmZhbHNlLCJpYXQiOjE3NDQ1NjM5MTIsImV4cCI6MTc0NDY1MDMxMn0.XQOZ1g4cpAsEbovccImdW6DZtXQvBNne2meajHCAjx4";
    if (!token) return res.status(401).json({ success:false,message: "Not authorized" });

    const decoded = jwt.verify(token,JSON_WEB_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success:false,message: "Invalid token",err:err.message });
  }
};
export default isAuthenticated;
