import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ToolBar from '../../Components/ToolBar/ToolBar';
import SideBar from '../../Components/SideBar/SideBar';
import VideoContainer from '../../Components/VideoContainer/VideoContainer';
import useMedia from '../../Hooks/useMedia';
import useToggle from '../../Hooks/useToggle';

export default function MeetingRoom() {
    const { socketRef, audioProducer, videoProducer } = useMedia();
    
    const { toggleClicked } = useToggle();

    useEffect(() => {
        // Connect to the socket server
        const socket = io.connect('http://localhost:8000/meeting', {
            withCredentials: true, // Make sure to include credentials if using cookies
        });

        socketRef.current = socket
        // Clean up on unmount
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [socketRef]);


    // console.log(socketRef.current);

    return (
        <main className="box absolute w-screen h-screen bg-[#202124] z-0">
            {toggleClicked['sidebar'] && <SideBar />}
            <VideoContainer />
            <ToolBar />
        </main>
    );
}
