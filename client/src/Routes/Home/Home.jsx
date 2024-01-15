import './home-style.css';
import MeetImage from '../../assets/images/4.jpg';
import React from 'react';

export default function Home() {
    return (
        <>
            <header className='header'>
                <nav className='nav max-w-6xl mx-6'>
                    {/* <a href="#">
                        <img src="src/assets/images/logo.svg" alt="" />
                    </a> */}
                    <div className="nav__logo">
                        hello
                    </div>
                </nav>
            </header>
            <section className="main__section grid max-w-6xl mx-6">
                    <div className='text__section max-w-6xl mx-6  flex flex-col '>
                        <h1>Virtual <span>Meeting</span> Platform For Online Video Conference</h1>
                        <h4>Get started with your first Meet..</h4>
                        <div className="btn-container">
                            <button className="btn join__btn">Join Meeting</button>
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
