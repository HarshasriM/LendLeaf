import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default:null
  }, 
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default:null
  }, 
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },  
  comment: {
    type: String,
    maxlength: 500
  },
},{timestamps:true});

const Review = mongoose.model('Review', reviewSchema);
export default Review
