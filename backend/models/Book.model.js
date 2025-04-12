import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type:String,
    required:true,
  },
  description: {
    type:String,
    required:true,
  },
  genre: {
    type:String,
    required:true,
  },
  imageBase64: {
    type: [String], // array of base64 image strings
    validate: {
      validator: function (arr) {
        return arr.length >= 3;
      },
      message: 'At least 3 images are required.'
    },
    required: true
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  condition:{
    type:String,
    required:true,
  },
  price:{
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  colony:{
    type: String,
    required:true,
  },
  city:{
    type: String,
    required:true,
  },
  district:{
    type: String,
    required:true,
  },
  state:{
    type: String,
    required:true,
  },
  country:{
    type:String,
    required:true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { // [longitude, latitude]
      type: [Number],
      index: '2dsphere'
    }
  },
  averageRating: {
    type: Number,
    default: 0
  },
   // optional for physical delivery idea
  
},
{timestamps:true});

const Book = mongoose.model('Book', bookSchema);
export default Book;
