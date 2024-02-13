import './home-style.css';
import { useNavigate } from 'react-router-dom';
import MeetImage from '../../assets/images/4.jpg';
import React from 'react';

export default function Home() {
    
    const navigate = useNavigate()

    return (
        <>
            <header className='header'>
                <nav className='nav w-full max-w-full px-6'>
                    <div className="nav__logo">
                        ZEPT
                    </div>
                    <button className="btn join__btn" onClick={() => navigate("/auth/login")}>Login</button>
                </nav>
            </header>
            <section className="main__section grid max-w-6xl mx-6">
                    <div className='text__section max-w-6xl mx-6  flex flex-col '>
                        <h1>Virtual <span>Meeting</span> Platform For Online Video Conference</h1>
                        <h4>Get started with your first Meet..</h4>
                        <div className="btn-container">
                            <button className="btn join__btn" onClick={() => navigate("/joinroom")}>Join Meeting</button>
                            <button className="btn create__btn">Create Meeting</button>
                        </div>
                    </div>
                    <div className='image__section max-w-6xl mx-6 flex flex-col'>
                        <img className='image-2' src={MeetImage} alt='sorry'></img>
                        <h2>Enjoy the seamless experience</h2>
                    </div>
            </section>
        </>
    );
}
