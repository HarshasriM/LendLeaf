
import Otp from "../models/Otp.model.js";
import User from "../models/User.model.js";
import generateOtp from "../utils/generateOtp.js";
import bcrypt from "bcryptjs";
class AuthController{
    async signUp (req, res){
        try {
          const { firstName,lastName,email,password,colony,city,district,state,country } = req.body;
          if(!firstName || !lastName || !email || !password || !colony || !city || !district || !state || !country ){
              res.status(400).json({message:"All fields are required"})
          }
      
          // Check if user exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
          }
      
          // Save hashed password
          const user = new User({
              firstName:firstName,
              lastName:lastName,
              email:email,
              password:password,
              colony:colony,
              city:city,
              district:district,
              state:state,
              country:country
          })
          await user.save();
      
          // Generate and store OTP
          const otpGenerated = generateOtp();
      
          const otp = new Otp({
              email:email,
              otp:otpGenerated
          })
          await otp.save();
      
          return res.status(200).json({ success:true,data : user, message: "User registered. OTP sent to email." ,err:{}});
        } catch (error) {
          const statusCode = error.statusCode || 500;
                  return res.status(statusCode).json({
                      success: false,
                      data: {},
                      message: error.message,
                      err: error.name,
                  });
        }
    };  
    async verifyOtp (req, res){
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      const existingOtp = await Otp.findOne({ email, otp });
      
      if (!existingOtp) {
        return res.status(400).json({ success: false, message: "expired OTP" });
      }
      if (existingOtp.otp !== otp) {
        return res.status(400).json({success:false, message: "Invalid OTP" });
      }
      // Update user as verified
      await User.updateOne({ email }, { isVerified: true });
  
      // Delete OTP after verification
      await Otp.deleteMany({ email });
      const token = user.genJWT();
      
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ success:true ,data:{user,token}, message: "Email verified successfully",err:{} });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
            err: error.name,
        });
    }
    };
    async resendOtp (req, res){
        try {
          const { email } = req.body;
      
          // Check if user exists and not verified
          const user = await User.findOne({ email });
          if (!user) return res.status(400).json({ message: "User not found" });
          if (user.isVerified) return res.status(400).json({success:false,message: "User is already verified" });
      
          // Check for existing OTP
          const existingOtp = await Otp.findOne({ email });
      
          if (existingOtp) {
            return res.status(429).json({success:false, message: "Please wait, OTP already sent" });
            
          }
          else {
            // Expired OTP – delete
            await Otp.deleteMany({ email });
          }
      
          // Generate and store OTP
          const otpGenerated = generateOtp();
      
          const otp = new Otp({
              email:email,
              otp:otpGenerated
          })
          await otp.save();
      
          res.status(200).json({success:true,message: "New OTP sent to your email" });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
                err: error.name,
            });
        }
    };
    async signIn(req,res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'All fields  are required' });
            }
            const user = await User.findOne({ email });

            if (!user) return res.status(404).json({ success:false,message: "User not found" });


            // Check if verified
            console.log(user.email)
            if (!user.isVerified) {
                return res.status(403).json({success:false,message: "Please verify your email first" });
            }
            if (!(bcrypt.compareSync(password, user.password))) {
                return res.status(500).json({success:false,message: "Wrong password" });
              }
            
            const token = user.genJWT();
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
            return res.status(200).json({
                success: true,
                data: {
                    user,
                },
                message: "Successfully logged in",
                err: {},
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                data: {},
                message: error.message,
                err: error.name,
            });
        }
    };
}


  
export default new AuthController();