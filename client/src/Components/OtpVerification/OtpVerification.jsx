import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../Api/axios';
import { toast } from "react-toastify";

export default function OtpVerification() {
  const otpRef = useRef();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state && location.state.email; 

  // console.log(email);

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const payload = { email, otp }
    try {
      const response = await axios.post('/verify-otp', payload, {
        headers: {
          "Content-Type": "application/json",
        },
      }); // Updated API endpoint
      console.log(response.data);

      // Check the response from the server and handle accordingly
      if (response.data.success) {
        console.log('OTP verification successful');
        toast.success('OTP verification successful')
        // You can redirect the user to another page after successful OTP verification
        navigate('/auth/login');
      } else if (response.data.error) {
        console.log('Invalid OTP');
        toast.error('Invalid OTP');
        // Handle invalid OTP, maybe show an error message
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP:', error);
      // Handle error, show an error message, etc.
    }
  };

  const handleOtpChange = (e) => {
    setOtp(() => { return e.target.value });
  }

  useEffect(() => {
    otpRef.current.focus();
  }, []);

  return (
    <section className="login-container">
      <form className='flex flex-col items-center gap-5' onSubmit={handleOtpVerification}>
        <h2>Verify Otp</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder='Enter Otp'
            onChange={handleOtpChange}
            value={otp}
            ref={otpRef}
            required
          />
        </div>
        <div className="btn__container">
          <button type='submit' className="btn join__btn w-full"> Verify </button>
        </div>
      </form>
    </section>
  );
}
