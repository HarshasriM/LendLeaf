import mongoose from "mongoose";
import { JSON_WEB_TOKEN } from "../config/serverConfig.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import validator from "validator"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim:true,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
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
    type: String,
    required:true,
  },
  isLender: {
    type: Boolean,
    default: false
  },
  isBorrower: {
    type: Boolean,
    default: false
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
  booksListed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default:[]
  }],
  booksBorrowed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default:[]
  }],
  averageRating:{
    type:Number,
    default:0,
  },
  reviews:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
      }
  ],
},
{timestamps:true}
);

// Hash the password before saving

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const SALT=bcrypt.genSaltSync(12);
  const encryptedPassword = bcrypt.hashSync(user.password, SALT);
  user.password = encryptedPassword;
  next();
});

userSchema.methods.comparePassword = function compare(password) {
  return bcrypt.compareSync(password, this.password);
}

userSchema.methods.genJWT = function generate(){
  return jwt.sign({ _id: this._id, username:this.username,email: this.email, isLender:this.isLender,isBorrower:this.isBorrower },JSON_WEB_TOKEN, {
      expiresIn: '1d'
  });
}
const User = mongoose.model('User', userSchema);
export default User;
