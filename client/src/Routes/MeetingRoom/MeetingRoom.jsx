import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ToolBar from '../../Components/ToolBar/ToolBar';
import SideBar from '../../Components/SideBar/SideBar';
import VideoContainer from '../../Components/VideoContainer/VideoContainer';
import useMedia from '../../Hooks/useMedia';
// import useToggle from '../../Hooks/useToggle';

export default function MeetingRoom() {
    const { socketRef } = useMedia();

    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // const socketRef = useRef(null);

    // const { toggleClicked } = useToggle();s

    useEffect(() => {
        // Connect to the socket server

        const initSocket = () => {
            return (io('http://localhost:8000/meeting', {
                withCredentials: true, // Make sure to include credentials if using cookies
            }))
        }
        // socket.on("connect", () => {
        //     console.log("Connected to server");
        //     socketRef.current = socket;
        // });

        socketRef.current = initSocket()

        socketRef.current.on('connect', () => {
            setIsSocketConnected(true);
        });

        // Clean up on unmount
        return () => {
            // socketRef.current.disconnect();
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);


    // useEffect(() => {
    //     console.log(socketRef.current);
    //     console.log('socketId: ', socketRef.current);
    // }, [socketRef.current]);

    return (
        <main className="box absolute w-screen h-screen bg-[#202124] z-0">
            {/* {toggleClicked['sidebar'] && <SideBar />} */}
            {isSocketConnected && <SideBar />}
            {isSocketConnected && <VideoContainer />}
            {/* {isSocketConnected && <ToolBar />} */}
            <ToolBar />
        </main>
    );
}
