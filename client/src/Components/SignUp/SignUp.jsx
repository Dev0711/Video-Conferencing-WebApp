import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../Api/axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp(props) {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

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

        // try {
        //     const response = await fetch("http://localhost:8000/register", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(payload),
        //     });

        //     const data = await response.json();

        //     // Handle the response from the server
        //     console.log(data);
        //     if (
        //         data.message ===
        //         "Account created successfully..."
        //     ) {
        //         // toast.success(
        //         //   "Registration successful! Please check your email for OTP verification."
        //         // );
        //         alert("Registration successful! Login to your Account...");
        //         navigate('/auth/login'); 
        //     } else {
        //         // toast.error(
        //         //   data.error || "Registration failed. Please try again later."
        //         // );
        //         alert("Registration failed. Please try again later.");
        //     }
        // } catch (error) {
        //     console.error("Error occurred during registration:", error);
        //     alert("An error occurred during registration. Please try again later.");
        // }
        
        try {
            setIsDisabled((prev) => prev = true)
            
            if (!email || !password || !username) {
                toast.error("Please provide all the require fields.");
                // alert("Please provide both email and password.");
                return;
              }

            const response = await axios.post("/register", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response.data;

            // Handle the response from the server
            console.log(data);
            if (data.message === 'Account created successfully. OTP sent to your email.') {
                toast.success('Registration successful! Please check your email for OTP verification.');
                // setShowOtpInput(true);
                navigate('/auth/verifyotp', { state: { email } });
            } else {
                toast.error("Registration failed. Please try again later." || data.error);
                // alert("Registration failed. Please try again later.");
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Display the error message as it is
                toast.error(error.response.data.error);
            } else {
                // Handle other errors
                console.error("Error occurred during registration:", error);
                toast.error("An error occurred during registration. Please try again later.");
            }

            setIsDisabled((prev) => prev = false)
            // console.error("Error occurred during registration:", error);
            // toast.error(`Error occurred during registration: ${error}`);
            // alert("An error occurred during registration. Please try again later.");
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
                        <button className="btn join__btn w-full" onClick={handleSignup} disabled={isDisabled}> Sign Up </button>
                    </div>
                    <h4>Already have an account? <span className='cursor-pointer text-blue-400' onClick={handleAuthRouteClick}>sign in</span></h4>
                </form>
            </div>
        </>
    );
}
