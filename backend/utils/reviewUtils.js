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
    async calculateAverageRating(Model,id,reviewField = 'reviews'){
        const document = await Model.findById(id).populate(reviewField);
        if (!document) throw new Error("Document not found");

        const totalRating = document[reviewField].reduce((sum, review) => sum + review.rating, 0);
        const average = document[reviewField].length ? totalRating / document[reviewField].length : 0;

        document.averageRating = average.toFixed(1);
        await document.save();
    }
}
export default new ReviewUtils();