import React from 'react';

export default function Otp() {
    const { setAuth } = useAuth();

    const otpRef = useRef();
  
    const [otp, setOtp] = useState('');
    // const [password, setPassword] = useState('');
  
    // const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";
  
    useEffect(() => {
      otpRef.current.focus()
    }, []);
  
    return (
      <section className="login-container">
        <form className='flex flex-col items-center gap-5'>
          <h2>Login</h2>
          <div className="input-container">
            <input type="password"
              placeholder='Enter Otp'
              onChange={(e) => setPassword(e.target.value)}
              value={otp}
              ref={otpRef}
              required
            />
          </div>
          <div className="btn__container">
            <button className="btn join__btn w-full" onClick={handleOtpVerification}> Login </button>
          </div>
        </form>
      </section>
    );
}
