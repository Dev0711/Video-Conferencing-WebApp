import logo from "../../assets/images/text-logo.png";
import useAuth from '../../Hooks/useAuth';
import useToggle from '../../Hooks/useToggle';
import ProfileCard from '../ProfileCard/ProfileCard';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function NavBar() {

    const { auth } = useAuth();

    const navigate = useNavigate()

    const { toggleClicked, handleToggleClick } = useToggle();

    return (
        <header className='header'>
            <nav className='nav w-full max-w-full px-6'>
                <a className="nav__logo w-24 h-auto -mt-2">
                    <img src={logo} alt="ZEPT" />
                </a>
                {auth && Object.keys(auth).length > 0 && auth?.user ? <Avatar className='cursor-pointer' name={auth?.user?.username} onClick={() => handleToggleClick('profile')} size={50} round={true} /> : <button className="btn join__btn" onClick={() => navigate("/auth/login")}>Login</button>}
            </nav>
            {auth && toggleClicked['profile'] && <ProfileCard />}
        </header>
    );
}
