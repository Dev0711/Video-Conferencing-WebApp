import React, { useEffect, useState, useRef } from 'react';

export default function OtpVerification() {
    // const { setAuth } = useAuth();

    const otpRef = useRef();
  
    const [otp, setOtp] = useState('');
    // const [password, setPassword] = useState('');
  
    // const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const handleOtpVerification = () => {
        console.log('helo');
    }
  
    useEffect(() => {
      otpRef.current.focus()
    }, []);
  
    return (
      <section className="login-container">
        <form className='flex flex-col items-center gap-5'>
          <h2>Verify Otp</h2>
          <div className="input-container">
            <input type="text"
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
