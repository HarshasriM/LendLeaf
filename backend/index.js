import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { PORT } from './config/serverConfig.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from "./routes/book.routes.js";
import reviewRoutes from "./routes/review.routes.js";
// import {requestRoutes} from './routes/request.routes.js';
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/review',reviewRoutes)
// app.use('/api/requests', requestRoutes);
app.listen(PORT, ()=>{
    console.log("server is running on port "+ PORT);
    connectDB()
})