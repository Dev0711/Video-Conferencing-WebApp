const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// In-memory storage for OTPs (replace with a more secure and persistent solution in production)
const otpStorage = {};

// Function to generate OTP
function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = otp;
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
    service: 'Gmail',
    auth: {
      user: 'harshsonaiya09@gmail.com', // your email
      pass: ' wcuyfelyufsdsooj', // your email password
    },
  });

  const mailOptions = {
    from: 'harshsonaiya09@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Verification OTP', // Subject line
    text: `Your verification OTP is: ${otp}`, // plain text body
  };

  await transporter.sendMail(mailOptions);
}

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  // Perform OTP verification
  if (verifyOTP(email, otp)) {
    // Clear OTP after successful verification
    delete otpStorage[email];

    try {
      // Update user's status (e.g., mark as verified) in the database
      await User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } });

      res.json({
        success: true,
        message: 'OTP verified successfully. Redirecting...',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'An error occurred during OTP verification. Please try again later.',
      });
    }
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid OTP. Please try again.',
    });
  }
});

// Route to register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Perform validation (similar to the frontend validation)
  if (!username || !email || !password) {
    return res.status(422).json({ error: 'Please fill in all the required fields.' });
  }

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    // Generate and send OTP via email
    const generatedOTP = generateOTP(email);
    await sendOTPEmail(email, generatedOTP);

    res.json({
      message: 'Account created successfully. OTP sent to your email.',
      generatedOTP, // Include this only for testing purposes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'An error occurred during user registration. Please try again later.',
    });
  }
});

module.exports = router;
