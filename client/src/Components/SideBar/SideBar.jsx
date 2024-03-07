import { useParams } from 'react-router-dom';
import send from '../../assets/images/send.svg';
import file_upload from '../../assets/images/file-upload.svg';
import copy from '../../assets/images/copy.svg'
import useToggle from '../../Hooks/useToggle';
import useAuth from '../../Hooks/useAuth.js';
import useMedia from '../../Hooks/useMedia.js';
import axios from '../../Api/axios.js';
import { useState, useEffect, useRef } from 'react';

function People() {
    const link = window.location.href;

    const { socketRef } = useMedia()

    const copyLink = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(link);
    }

    useEffect(() => {
        socketRef.current.on('users', ({ user }) => {
            console.log(user);
        });
        //   return () => {
        //     effect
        //   };
    }, [socketRef]);

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
    const { socketRef, chat } = useMedia();

    const user = auth?.user;
    const [message, setMessage] = useState('');

    // const msgRef = useRef();
    const fileInputRef = useRef();

    const handleSendMessage = async () => {

        if (fileInputRef.current.files.length > 0) {
            const fileUrl = await uploadFile(fileInputRef.current.files[0]);
            socketRef.current.emit('message', fileUrl, user, meetingId);
        } else if (message !== '') {
            // No file selected, just send the message
            socketRef.current.emit('message', message, user, meetingId);
        }

        // Clear the input values after sending
        setMessage('');
        fileInputRef.current.value = '';
    }

    const handleFileInputChange = async (e) => {
        const selectedFile = e.target.files[0];
    
        // Call uploadFile only if a file is selected
        if (selectedFile) {
            try {
                const fileUrl = await uploadFile(selectedFile);
                // console.log('fileUrl: ', fileUrl);
            } catch (error) {
                console.error('Error uploading file:', error.message);
            }
        }
    }

    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Send the file to the backend for processing
            const response = await axios.post('/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Extract the file URL from the response
            const fileUrl = response.data.file;

            // console.log(fileUrl);

            setMessage(fileUrl);

            // Send the file URL to the chat
            return fileUrl
            // socketRef.current.emit('message', fileUrl, user, meetingId);
        } catch (error) {
            console.error('Error uploading file:', error.message);
            // showToast(`Error uploading file: ${error.message}`);
        }
    };

    const isFileUrl = (message) => {
        // console.log('file msg: ', message);
        // Simple check to see if the message starts with the base URL for files
        return message.startsWith('http://localhost:8000/files/');
    };

    return (
        <>
            <section className="chat-container flex flex-col h-full my-1 w-fit">
                <div className='h-full overflow-auto'>
                    {chat.map((msg, index) => (
                        <div key={index} className=" mb-4 w-72 bg-slate-200 px-2 py-1 rounded-md">
                            <div className="info flex justify-between text-xs font-medium text-blue-500">
                                <div className="username">{msg?.sender?.username}</div>
                                <div className="time">{msg?.time}</div>
                            </div>
                            <div className="content text-base text-pretty text-left mt-1">
                                {/* {msg?.message} */}
                                {isFileUrl(msg?.message) ? (
                                    // Render the file URL as a hyperlink
                                    <a href={msg?.message} className=' cursor-pointer' target="_blank" rel="noopener noreferrer">
                                        {msg?.message}
                                    </a>
                                ) : (
                                    // Render regular text message
                                    msg?.message
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex gap-2 my-1 mx-px p-1 bg-slate-200 rounded'>
                    <input value={message} type="text" className='outline-none w-58 border-none focus:outline-none text-black p-1' onChange={(e) => setMessage((prev) => prev = e.target.value)} />
                    <input type="file" id="fileInput" ref={fileInputRef} onChange={handleFileInputChange} hidden />
                    <img src={file_upload} className='cursor-pointer -mx-1' alt="" onClick={() => { fileInputRef.current.click() }} />
                    <img src={send} className='cursor-pointer border-l-2 border-white px-1' onClick={handleSendMessage} alt="" />
                </div>
            </section>
        </>
    )
}

export default function SideBar() {

    const { toggleSidebarOption, setToggleSidebarOption } = useToggle();

    return (
        <>
            <div className="sidebar-container bg-white text-center h-[90%] w-fit px-5 pb-1 m-2 flex flex-col items-center rounded float-end z-50">
                <div className="heading w-full flex flex-row gap-2 justify-end my-2">
                    <h4 className={`text-black text-center basis-1/2 ${toggleSidebarOption ? 'bg-slate-200' : ''} rounded cursor-pointer`} onClick={() => setToggleSidebarOption(true)} >People</h4>
                    <h4 className={`text-black text-center basis-1/2 ${!toggleSidebarOption ? 'bg-slate-200' : ''} rounded cursor-pointer`} onClick={() => setToggleSidebarOption(false)}>Chat</h4>
                </div>
                <hr className="border-1 border-gray-300" />
                {toggleSidebarOption && <People />}
                {!toggleSidebarOption && <Chat />}
            </div>
        </>
    );
}
