import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login(props) {

  const navigate = useNavigate()

  const handleAuthRouteClick = () => {
    navigate("/auth/signup");
  };

  return (
    <>
      <div className="login-container">
        <form className='flex flex-col items-center gap-5' action="/auth/login" method="post">
          <h2>Login</h2>
          <div className="input-container">
            <input type="text" name="" placeholder='username' />
            <input type="password" name="" placeholder='password' />
          </div>
          <div className="btn__container">
            <button className="btn join__btn w-full"> Login </button>
          </div>
          <h4>Don't have an account? <span className='cursor-pointer text-blue-400' onClick={handleAuthRouteClick}>register</span></h4>
        </form>
      </div>
    </>
  );
}
