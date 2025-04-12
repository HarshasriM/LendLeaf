import nodemailer from "nodemailer";
import { EMAIL_PASS,EMAIL_USER } from "../config/serverConfig.js";
const otpMailSender = async (email, title, body) => {
  try {

    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user:EMAIL_USER, 
        pass:EMAIL_PASS, 
      },
    });
    // Send emails to users
    const mailOptions = {
        from: 'harshameda17@gmail.com',
        to: email,
        subject: title,
        html: body,
    }
    let info = await transporter.sendMail(mailOptions);

    console.log("Email info: ", info);
    return info;
    
  } catch (error) {
    console.log(error.message);
  }
};
export default otpMailSender;