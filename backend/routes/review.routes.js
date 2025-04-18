import express from "express";
import bookReviewController from "../controllers/bookReview.controller.js";
import lenderReviewController from "../controllers/lenderReview.controller.js";
import  isAuthenticated  from "../middlewares/authMiddleware.js";
const router = express.Router();

//book routes 
router.post("/checkbookreviewuser/:bookId",isAuthenticated, bookReviewController.checkUserexist);
router.post("/addbookreview/:bookId",isAuthenticated, bookReviewController.addBookReview);
router.delete("/deletebookreview/:reviewId",isAuthenticated, bookReviewController.deleteReview);
router.get("/gettopbookreviews/:bookId",isAuthenticated, bookReviewController.getTopTenReviews);
router.get("/allbookreviews/:bookId",isAuthenticated, bookReviewController.getAllReviews);

//lender routes
router.post("/checklenderreviewuser/:lenderId",isAuthenticated, lenderReviewController.checkUserexist);
router.post("/addlenderreview/:lenderId",isAuthenticated, lenderReviewController.addLenderReview);
router.delete("/deletelenderreview/:reviewId",isAuthenticated, lenderReviewController.deleteLenderReview);
router.get("/gettoplenderreviews/:lenderId",isAuthenticated, lenderReviewController.getTopTenReviews);
router.get("/alllenderreviews/:lenderId",isAuthenticated, lenderReviewController.getAllReviews);


export default router;