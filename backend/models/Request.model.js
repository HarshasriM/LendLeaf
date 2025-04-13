const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  bookPrice:{
    type:Number,
    default:0,
    required:true,
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'borrowed', 'returned', 'cancelled'],
    default: 'pending'
  },
  requestedDays: {
    type: Number,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now()
  },
  borrowDate: Date,
  deadlineDate: Date,
  actualReturnDate: Date,
  report: {
    type: Object, // report will contain calculated cost etc
    default: {}
  },
  rentedDays: {
    type: Number,
    required: true
  },
  
},{timestamps:true});

const Request = mongoose.model('Request', requestSchema);
export default Request
