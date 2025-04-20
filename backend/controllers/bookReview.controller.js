import Book from "../models/Book.model.js";
import Review from "../models/Review.model.js";
import reviewUtil from "../utils/reviewUtils.js";
import mongoose from "mongoose";

class BookReviewController{
    
    async checkUserexist(req,res){
        try{
            const borrowerId = req.user._id;
            const {bookId} = req.params
            if (!borrowerId || !bookId) {
                return res.status(400).json({ success:false,message: 'Borrower or book ID is missing' });
              }
              
              // Optional: check if ObjectId is valid if you're using Mongoose
            if (!mongoose.Types.ObjectId.isValid(borrowerId) || !mongoose.Types.ObjectId.isValid(bookId)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            const existingReview = await Review.findOne({ borrower: borrowerId, book: bookId });
            if (existingReview) {
                return res.status(200).json({ success: true, message: "You have already reviewed this book." });
            }
            return res.status(200).json({success:false,message:"User didn't review this book"})
        }
        catch(error){
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success:false,
                data:{},
                message:"something went wrong",
                err:error.message
            })
        }
       
    };
    async addBookReview(req,res) {
        try{
            const {bookId} = req.params;
            const {rating,comment} = req.body;
            const borrowerId = req.user._id;

            const review = new Review({
                borrower: borrowerId, rating, comment,book:bookId,lender:null
            });
            await review.save();
            const book = await Book.findById(bookId);
            book.reviews.push(review._id);
            await book.save();
            await reviewUtil.calculateAverageRating(Book,bookId,"reviews");
            return res.status(200).json({success:true,data:review,message:"Review is created"})
        }
        catch(error){
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success:false,
                data:{},
                message:"review is not created",
                err:error.message
            })
        }
    };
    async deleteReview(req,res){
        try{
            const { reviewId } = req.params;
            const review = await Review.findById(reviewId);
            if (!review) return res.status(404).json({success:false,data:{}, message: "Review not found" });
            if (review.borrower.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success:false,data:{},message: "Unauthorized" });
            }
            await Review.findByIdAndDelete(reviewId);
            const book = await Book.findOne({ reviews: reviewId });
            if (book) {
              book.reviews.pull(reviewId);
              await book.save();
              await reviewUtil.calculateAverageRating(Book,book._id,"reviews");
            }
            res.status(200).json({
                success:true,
                message:"Review is deleted successfully"
            });
        }
        catch(error){
            const statusCode = error.statusCode || 500
            res.status(statusCode).json({
                success:false,
                data:{},
                message:"Review is not deleted",
                err:error.message
            })
        }
    };
    async getAllReviews(req,res){
       try{
            const {bookId} = req.params;
            const reviews = await Review.find({
                book:bookId,
            }).populate("borrower","email").sort({ createdAt: -1 });
            res.json({ success: true, count: reviews.length, data: reviews,message:"All reviews are retrived successfully" });
       }catch(error){
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            success:false,
            data:{},
            message:"Reviews are not retrieved",
            err:error.message
        })
       }
    };
    async getTopTenReviews(req,res){
        try{
            const {bookId} = req.params;
            const userId = req.user._id;

            const userReview = await Review.find({
                borrowerId :userId,
                book:bookId
            }).populate("borrower","email");

            //get top ten reviews
            const otherReviews = await Review.find({
                book:bookId,
                borrower: { $ne: userId }
            })
            .sort({ createdAt: -1 })
            .limit(userReview ? 9 : 10) // 9 if userReview exists, else 10
            .populate("borrower");
            const reviews = userReview ? [...userReview,...otherReviews]:otherReviews
            res.status(200).json({
                success: true,
                message: "Top 10 reviews with user's review on top (if any)",
                data: reviews
            });
        }catch(error){
            const statusCode = error.statusCode || 500
            res.status(statusCode).json({
                success:false,
                data:{},
                message:"Reviews are not retrieved",
                err:error.message
            })
        }
    }
}
export default new BookReviewController();