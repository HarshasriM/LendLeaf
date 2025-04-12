import otpGenerator from "otp-generator";

const generateOtp=()=>{
    let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    });
    return otp;
};
export default generateOtp;

