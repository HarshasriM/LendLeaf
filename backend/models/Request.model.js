const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned','borrowed'],
    default: 'pending'
  },
  message: {
    type:String,
  },
  rentedDays: {
    type: Number,
    required: true
  },
  
},{timestamps:true});

const Request = mongoose.model('Request', requestSchema);
export default Request
