const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateOTP, sendOTPEmail } = require('../middleware/otp_generation');

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
