import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleAuthRouteClick = () => {
    navigate("/auth/signup");
  };

  const handleLogin = (e) => {
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
    console.log(payload);
    // Make an API call to your server for user login
    fetch("http://localhost:8000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log(data);
        if (data.token && data.user) {
          // Login successful, save the token to localStorage or a state management system for future authenticated requests
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          // dispatch({ type: "USER", payload: data.user });
          // toast.success("Successfully SignedIn!!", {
          //   className: "custom-toast",
          // });
          alert("Successfully SignedIn");
          navigate("/"); // Redirect to the dashboard page after successful login
        } else {
          // toast.error(
          //   data.error || "Invalid email or password. Please try again.",
          //   {
          //     className: "custom-toast",
          //   }
          // );
          alert("Invalid email or password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error occurred during login:", error);
        alert("An error occurred during login. Please try again later.");
      });
  };

  return (
    <>
      <div className="login-container">
        <form className='flex flex-col items-center gap-5'>
          <h2>Login</h2>
          <div className="input-container">
            <input type="text" defaultValue="" placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" defaultValue="" placeholder='password' onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="btn__container">
            <button className="btn join__btn w-full" onClick={handleLogin}> Login </button>
          </div>
          <h4>Don't have an account? <span className='cursor-pointer text-blue-400' onClick={handleAuthRouteClick}>register</span></h4>
        </form>
      </div>
    </>
  );
}
