import './home-style.css';
import { useNavigate } from 'react-router-dom';
import MeetImage from '../../assets/images/4.jpg';
import { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';
// import useToggle from '../../Hooks/useToggle';
// import Avatar from 'react-avatar'
// import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import NavBar from '../../Components/NavBar/NavBar';

export default function Home() {
    const { auth } = useAuth();

    const navigate = useNavigate()

    // const { toggleClicked, handleToggleClick } = useToggle();

    // console.log('this is username -> ', auth?.user?.username);
    // console.log(auth?.length);
    useEffect(() => {
        console.log('this is auth at home -> ', auth);
    }, [auth]);

    return (
        <>
            <NavBar />
            <section className="main__section grid max-w-6xl mx-6">
                <div className='text__section max-w-6xl mx-6  flex flex-col '>
                    <h1>Virtual <span>Meeting</span> Platform For Online Video Conference</h1>
                    <h4>Get started with your first Meet..</h4>
                    <div className="btn-container">
                        <button className="btn join__btn" onClick={() => navigate("/joinroom")}>Join Meeting</button>
                        <button className="btn create__btn" onClick={() => navigate("/office/")}>Go To Office</button>
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
