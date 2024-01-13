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
                <form action="/auth/signup" method="post">
                    <h2>Sign Up</h2>
                    <div className="input-container">
                        <input type="text" name="" placeholder='enter E-mail' />
                        <input type="password" name="" placeholder='enter password' />
                        <input type="password" name="" placeholder='confirm password' />
                    </div>
                    <div className="btn-continer">
                        <button className="btn signup__btn"></button>
                    </div>
                    <h4>Already have an account? <span onClick={handleAuthRouteClick}>sign in</span></h4>
                </form>
            </div>
        </>
    );
}
