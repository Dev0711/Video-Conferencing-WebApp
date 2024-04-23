const nodemailer = require("nodemailer");

// In-memory storage for OTPs (replace with a more secure and persistent solution in production)
const otpStorage = {};

// Function to generate OTP
function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = otp;
  // console.log(otpStorage);
  return otp;
}

// Function to verify OTP for a specific user
function verifyOTP(email, otp) {
  return otpStorage[email] === otp;
}

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  // Replace the following with your actual email sending logic using nodemailer
  const transporter = nodemailer.createTransport({
    // Your email sending configuration
    service: "Gmail",
    auth: {
      user: "harshsonaiya09@gmail.com", // your email
      pass: " ckfenttblyccfsmq", // your email password
    },
  });

  console.log(`${email}: ${otp}`);

  const mailOptions = {
    from: "harshsonaiya09@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Verification OTP", // Subject line
    text: `Your verification OTP is: ${otp}`, // plain text body
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  otpStorage,
  generateOTP,
  verifyOTP,
  sendOTPEmail,
};
