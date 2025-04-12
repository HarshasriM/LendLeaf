import { connect } from "mongoose";
import { MONGODB_URI } from "./serverConfig.js";
const connectDB = async () => {
  try {
    const conn = await connect(MONGODB_URI);
    console.log("MongoDB connected : "+conn.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;