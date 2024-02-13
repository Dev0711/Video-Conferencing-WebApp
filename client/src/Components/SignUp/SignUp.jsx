import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp(props) {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    const handleAuthRouteClick = () => {
        navigate("/auth/login");
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("function-called")
        const payload = {
            username,
            email,
            password,
        };

        try {
            const response = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Handle the response from the server
            console.log(data);
            if (
                data.message ===
                "Account created successfully..."
            ) {
                // toast.success(
                //   "Registration successful! Please check your email for OTP verification."
                // );
                alert("Registration successful! Login to your Account...");
                navigate('/auth/login'); 
            } else {
                // toast.error(
                //   data.error || "Registration failed. Please try again later."
                // );
                alert("Registration failed. Please try again later.");
            }
        } catch (error) {
            console.error("Error occurred during registration:", error);
            alert("An error occurred during registration. Please try again later.");
        }
    };

    return (
        <>
            <div className="signup-container">
                <form className='flex flex-col items-center gap-5'>
                    <h2>Sign Up</h2>
                    <div className="input-container">
                        <input type="text" name="username" placeholder='Username' onChange={(e) => setUserName(e.target.value)} required />
                        <input type="text" name="email" placeholder='Enter E-mail' onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" name="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="btn__container">
                        <button className="btn join__btn w-full" onClick={handleSignup}> Sign Up </button>
                    </div>
                    <h4>Already have an account? <span className='cursor-pointer text-blue-400' onClick={handleAuthRouteClick}>sign in</span></h4>
                </form>
            </div>
        </>
    );
}
