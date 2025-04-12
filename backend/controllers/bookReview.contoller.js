import Book from "../models/Book.model.js";
import Review from "../models/Review.model.js";
import reviewUtil from "../utils/reviewUtils.js";

class BookReviewController{
    
    async checkUserexist(req,res){

    }
    async addBookReview(req,res) {
        try{
            const {bookId} = req.params;
            const {rating,comment} = req.body;
            //check if user exits
            
        }
        catch(errror){

        }
    }
}