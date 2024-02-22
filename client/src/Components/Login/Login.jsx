import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../Api/axios';
import useAuth from '../../Hooks/useAuth';

export default function Login(props) {
  const { setAuth } = useAuth();

  const emailRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    emailRef.current.focus()
  }, []);

  const handleAuthRouteClick = () => {
    navigate("/auth/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform validation (you can add more validation rules as needed)
    if (!email || !password) {
      // toast.error("Please provide both email and password.");
      alert("Please provide both email and password.");
      return;
    }

    // Create a JSON payload to send in the request body
    const payload = {
      email,
      password,
    };
    // console.log(payload);
    // Make an API call to your server for user login
    // fetch("http://localhost:8000/auth", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify(payload),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle the response from the server
    //     // console.log(data);
    //     if (data.accessToken && data.refreshToken && data.user) {
    //       // Login successful, save the token to localStorage or a state management system for future authenticated requests
    //       setAuth({
    //         token: data.token,
    //         user: data.user,
    //       })

    //       // dispatch({ type: "USER", payload: data.user });
    //       // toast.success("Successfully SignedIn!!", {
    //       //   className: "custom-toast",
    //       // });
    //       alert("Successfully SignedIn");
    //       navigate(from, { replace: true }); // Redirect to the dashboard page after successful login
    //     } else {
    //       // toast.error(
    //       //   data.error || "Invalid email or password. Please try again.",
    //       //   {
    //       //     className: "custom-toast",
    //       //   }
    //       // );
    //       alert("Invalid email or password. Please try again.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error occurred during login:", error);
    //     alert("An error occurred during login. Please try again later.");
    //   });

    try {
      const response = await axios.post("/auth", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    
      // Handle the response from the server
      const data = response.data;
      if (data.accessToken && data.refreshToken && data.user) {
        // Login successful, save the token to localStorage or a state management system for future authenticated requests
        await setAuth(prev => prev = {
          accessToken: data.accessToken,
          user: data.user,
        });
    
        alert("Successfully SignedIn");
        navigate(from, { replace: true }); // Redirect to the dashboard page after successful login
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred during authntiacation:", error);
      alert("An error occurred during logging in. Please try again later.");
    }

  };

  return (
    <section className="login-container">
      <form className='flex flex-col items-center gap-5'>
        <h2>Login</h2>
        <div className="input-container">
          <input type="text"
            placeholder='E-mail'
            ref={emailRef}
            autoComplete='off'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input type="password"
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <div className="btn__container">
          <button className="btn join__btn w-full" onClick={handleLogin}> Login </button>
        </div>
        <h4>Don't have an account? <span className='cursor-pointer text-blue-400' onClick={handleAuthRouteClick}>register</span></h4>
      </form>
    </section>
  );
}
