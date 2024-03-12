import React from 'react';
import { Route, Routes } from "react-router-dom";
import './auth-style.css';
import Login from '../../Components/Login/Login';
import SignUp from '../../Components/SignUp/SignUp';
import OtpVerification from '../../Components/OtpVerification/OtpVerification';

export default function Auth() {

    return (
        <div className="auth-container max-w-6xl mx-6s">
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="verifyotp" element={<OtpVerification />} />
            </Routes>
        </div>
    );
}
