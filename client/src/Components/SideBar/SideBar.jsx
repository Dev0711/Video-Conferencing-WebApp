import { useParams } from 'react-router-dom';
import x from '../../assets/images/x.svg';
import send from '../../assets/images/send.svg';
import file_upload from '../../assets/images/file-upload.svg';
import copy from '../../assets/images/copy.svg'
import useToggle from '../../Hooks/useToggle';
import useAuth from '../../Hooks/useAuth.js';
import useMedia from '../../Hooks/useMedia.js';
import { useState, useEffect } from 'react';

function People() {
    const link = window.location.href;

    const copyLink = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(link);
    }


    return (
        <>
            <section className="copy-link">
                <h5 className='text-black my-1'>Invite people with this link</h5>
                <div className='flex gap-2 my-1 mx-px p-1 bg-slate-200 rounded'>
                    <input type="text" value={link} className='outline-none border-none focus:outline-none text-black p-1' readonly />
                    <img src={copy} className='cursor-pointer border-l-2 border-white px-2' onClick={copyLink} alt="" />
                </div>
            </section>
            <hr className="border-1 border-gray-300" />
            <section className="people-container overflow-auto  h-full my-1 w-full">

            </section>
        </>
    )
}

function Chat() {

    const { meetingId } = useParams();

    const { auth } = useAuth();
    const { socketRef } = useMedia();

    const user = auth?.user;
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const handleSendMessage = () => {
        // console.log('function fired..');
        console.log('handleSendMessage function triggered:', message, user, meetingId);
        socketRef.current.emit('message', message, user, meetingId);
    }

    useEffect(() => {
        console.log("Inside useEffect");
        const handleMessage = (message, sender, time) => {
            console.log('message event listened..');
            const msg = {
                message,
                sender,
                time
            };
            setChat((prev) => [...prev, msg]);
        };
    
        console.log(socketRef.current);
        socketRef.current.on('message', handleMessage);

        return () => {
            console.log("Cleaning up message event listener");
            socketRef.current.off('message', handleMessage);
        };

    }, [socketRef, setChat]);

    return (
        <>
            <section className="chat-container flex flex-col  h-full my-1 w-full">
                <div className='h-full overflow-auto'>
                    {chat.map((msg, index) => (
                        <div key={index} className=" font-bold text-black mb-4 ml-3 bg-white rounded-sm">
                            <div className="info">
                                <div className="username">{msg?.sender?.username}</div>
                                <div className="time">{msg?.time}</div>
                            </div>
                            <div className="content">
                                {msg?.message}
                            </div>
                        </div>
                    ))}
                </div>
                <hr className="border-1 border-gray-300" />
                <div className='flex gap-2 my-1 mx-px p-1 bg-slate-200 rounded'>
                    <input value={message} type="text" className='outline-none border-none focus:outline-none text-black p-1' onChange={(e) => setMessage((prev) => prev = e.target.value)} />
                    <input type="file" id="fileInput" hidden />
                    <img src={file_upload} className='cursor-pointer -mx-1' alt="" />
                    <img src={send} className='cursor-pointer border-l-2 border-white px-1' onClick={handleSendMessage} alt="" />
                </div>
            </section>
        </>
    )
}

export default function SideBar() {

    const { handleToggleClick, toggleSidebarOption, setToggleSidebarOption } = useToggle();

    return (
        <>
            <div className="sidebar-container bg-white text-center h-[88%] w-fit px-5 pb-1 m-4 flex flex-col items-center rounded float-end z-50">
                <div className="heading w-full flex flex-row gap-2 justify-end my-2">
                    <h4 className={`text-black text-center basis-1/2 ${toggleSidebarOption ? 'bg-slate-200' : ''} rounded cursor-pointer`} onClick={() => setToggleSidebarOption(true)} >People</h4>
                    <h4 className={`text-black text-center basis-1/2 ${!toggleSidebarOption ? 'bg-slate-200' : ''} rounded cursor-pointer`} onClick={() => setToggleSidebarOption(false)}>Chat</h4>
                    <img src={x} onClick={() => handleToggleClick('sidebar')} className='cursor-pointer' alt="" />
                </div>
                {toggleSidebarOption && <People />}
                {!toggleSidebarOption && <Chat />}
            </div>
        </>
    );
}
