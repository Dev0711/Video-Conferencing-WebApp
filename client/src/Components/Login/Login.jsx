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
        <form action="/auth/login" method="post">
          <h2>Login</h2>
          <div className="input-container">
            <input type="text" name="" placeholder='username' />
            <input type="password" name="" placeholder='password' />
          </div>
          <div className="btn-continer">
            <button className="btn login__btn"></button>
          </div>
          <h4>Don't have an account? <a onClick={handleAuthRouteClick}>register</a></h4>
        </form>
      </div>
    </>
  );
}
