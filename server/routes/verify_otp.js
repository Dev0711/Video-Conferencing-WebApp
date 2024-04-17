const router = require("express").Router();
const User = require("../models/user");
const { otpStorage, verifyOTP } = require("../middleware/otp_generation");

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

//   console.log("helo", email, otp);

  // Perform OTP verification
  if (verifyOTP(email, otp)) {
    // Clear OTP after successful verification
    delete otpStorage[email];

    try {
      // Update user's status (e.g., mark as verified) in the database
      await User.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } }
      );

      res.json({
        success: true,
        message: "OTP verified successfully. Redirecting...",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error:
          "An error occurred during OTP verification. Please try again later.",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      error: "Invalid OTP. Please try again.",
    });
  }
});

module.exports = router;
