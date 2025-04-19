import jwt from "jsonwebtoken"
import { JSON_WEB_TOKEN } from "../config/serverConfig.js";
const isAuthenticated = async (req, res, next) => {

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success:false,message: "Not authorized" });
   
    const decoded = jwt.verify(token,JSON_WEB_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success:false,message: "Invalid token",err:err.message });
  }
};
export default isAuthenticated;
