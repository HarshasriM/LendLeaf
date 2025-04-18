import Book from "../models/Book.model.js";
import Review from "../models/Review.model.js";
import User from "../models/User.model.js"
import reviewUtil from "../utils/reviewUtils.js";

class LenderReviewController{
    
    async checkUserexist(req,res){
        const borrowerId = req.user._id;
        const {lenderId} = req.params
        const existingReview = await Review.findOne({ borrower: borrowerId, lender: lenderId });
        if (existingReview) {
            return res.status(200).json({ success: true,data:existingReview, message: "You have already reviewed this lender." });
        }
        return res.status(200).json({success:false,message:"User didn't review this lender"})
    };
    async addLenderReview(req,res) {
        try{
            const { lenderId } = req.params;
            const {rating,comment} = req.body;
            const borrowerId = req.user._id;

            const review = new Review({
                borrower: borrowerId, rating,comment,lender:lenderId,book:null
            });
            await review.save();
            const user = await User.findById(lenderId);
            user.reviews.push(review._id);
            await user.save();
            await reviewUtil.calculateAverageRating(User,lenderId,"reviews");
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
    async deleteLenderReview(req,res){
        try{
            const { reviewId } = req.params;
            const review = await Review.findById(reviewId);
            if (!review) return res.status(404).json({success:false,data:{}, message: "Review not found" });
            if (review.borrower.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success:false,data:{},message: "Unauthorized" });
            }
            await Review.findByIdAndDelete(reviewId);
            const user = await User.findOne({ reviews: reviewId });
            if (user) {
              user.reviews.pull(reviewId);
              await user.save();
              await reviewUtil.calculateAverageRating(User,user._id,"reviews");
            }
            res.status(200).json({
                success:true,
                message:"Review is deleted successfully"
            })
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
            const {lenderId} = req.params;
            const reviews = await Review.find({
                lender:lenderId,
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
            const {lenderId} = req.params;
            const userId = req.user._id;

            const userReview = await Review.find({
                borrowerId :userId,
                lender:lenderId
            }).populate("User","email");

            //get top ten reviews
            const otherReviews = await Review.find({
                lender:lenderId,
                borrower: { $ne: userId }
            })
            .sort({ createdAt: -1 })
            .limit(userReview ? 9 : 10) // 9 if userReview exists, else 10
            .populate("borrower");
            const reviews = userReview ? [userReview,...otherReviews]:otherReviews
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
export default new LenderReviewController();