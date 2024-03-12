import React from 'react';
import Avatar from 'react-avatar';
import useAuth from '../../Hooks/useAuth';
import useLogout from '../../Hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import useToggle from '../../Hooks/useToggle';

export default function ProfileCard() {

    const navigate = useNavigate();
    const { auth } = useAuth();
    const logout = useLogout();
    const {handleToggleClick} = useToggle();

    const signOut = async () => {
        await logout()
        handleToggleClick('profile')

        navigate('/')
    }

    return (
        <section className=' absolute right-0 mt-1 mr-4 flex flex-col gap-1 p-4 bg-[#e8f1ff] rounded-md h-auto w-fit items-center'>
            <Avatar name={auth?.user?.username} size={50} round={true} />  
            <p className='text-black font-bold'>{auth?.user?.username}</p>
            <p className='text-black '>{auth?.user?.email}</p>
            <button className="btn join__btn w-52" onClick={() => signOut()}>Logout</button>
        </section>
    );
}
