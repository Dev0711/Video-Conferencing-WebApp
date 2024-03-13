import React, { useEffect, useState, useRef ,uselocation } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OtpVerification() {
  const otpRef = useRef();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = uselocation();

  const handleOtpVerification = async () => {
    try {
      const response = await axios.post('/verify-otp', { otp }); // Updated API endpoint
      console.log(response.data);

      // Check the response from the server and handle accordingly
      if (response.data.success) {
        console.log('OTP verification successful');
        // You can redirect the user to another page after successful OTP verification
        navigate('/');
      } else {
        console.log('Invalid OTP');
        // Handle invalid OTP, maybe show an error message
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Handle error, show an error message, etc.
    }
  };

  useEffect(() => {
    otpRef.current.focus();
  }, []);

  return (
    <section className="login-container">
      <form className='flex flex-col items-center gap-5'>
        <h2>Verify Otp</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder='Enter Otp'
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            ref={otpRef}
            required
          />
        </div>
        <div className="btn__container">
          <button className="btn join__btn w-full" onClick={handleOtpVerification}> Verify </button>
        </div>
      </form>
    </section>
  );
}
