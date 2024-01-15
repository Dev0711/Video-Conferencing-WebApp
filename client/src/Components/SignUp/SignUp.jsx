import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp(props) {

    const navigate = useNavigate()

    const handleAuthRouteClick = () => {
        navigate("/auth/login");
    };

    return (
        <>
            <div className="signup-container">
                <form className='flex flex-col items-center gap-5' action="/auth/signup" method="post">
                    <h2>Sign Up</h2>
                    <div className="input-container">
                        <input type="text" name="" placeholder='Enter E-mail' />
                        <input type="password" name="" placeholder='Enter password' />
                        <input type="password" name="" placeholder='confirm password' />
                    </div>
                    <div className="btn__container">
                        <button className="btn join__btn w-full"> Sign Up </button>
                    </div>
                    <h4>Already have an account? <span className='cursor-pointer text-blue-400' onClick={handleAuthRouteClick}>sign in</span></h4>
                </form>
            </div>
        </>
    );
}
