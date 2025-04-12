import express from "express";
import bookController from "../controllers/book.controller.js";
import  isAuthenticated  from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, upload.array("images", 5), bookController.createBook);
router.get("/",isAuthenticated,bookController.getBooks);
router.get("/:id",bookController.getbookbyId);
router.delete('/:id', isAuthenticated, bookController.deletebookbyId);
router.put('/:id', isAuthenticated, upload.array("images",5),bookController.updatebookbyId);
export default router;
