import Review from "../models/Review.model.js";
import Book from "../models/Book.model.js";
import User from "../models/User.model.js";

class ReviewUtils{
    async createReview({borrowerId,rating,comment}){
        const review = new Review({borrower:borrowerId,rating,comment})
        await review.save();
        return review;
    };
    async deleteReviewById(reviewId){
        return await Review.findByIdAndDelete(reviewId)
    }
    async getSortedReviewsForModel(model,refField,refId){
        return await Review.find({[refField]:refId})
        .sort({createdAt:-1})
        .populate("borrower","name email")
    }
}
export default new ReviewUtils();