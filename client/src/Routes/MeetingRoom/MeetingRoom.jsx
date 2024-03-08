import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ToolBar from '../../Components/ToolBar/ToolBar';
import SideBar from '../../Components/SideBar/SideBar';
import VideoContainer from '../../Components/VideoContainer/VideoContainer';
import useMedia from '../../Hooks/useMedia';
import useToggle from '../../Hooks/useToggle';
import WhiteBoard from '../../Components/WhiteBoard/WhiteBoard';
// import useToggle from '../../Hooks/useToggle';

export default function MeetingRoom() {
    const { socketRef, setChat, setPeople } = useMedia();

    const { toggleClicked } = useToggle();

    const [isSocketConnected, setIsSocketConnected] = useState(false);

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

        socketRef.current.on('message', handleMessage);

        socketRef.current.on('joined-users', ({ users }) => {

            console.log('this is users: ', users);

            setPeople((prev) => prev = users)
        })

        return () => {
            console.log("Cleaning up message event listener");
            socketRef.current.off('message', handleMessage);
        };

    }, [socketRef]);


    // useEffect(() => {
    //     console.log(socketRef.current);
    //     console.log('socketId: ', socketRef.current);
    // }, [socketRef.current]);

    return (
        <main className="box absolute w-screen h-screen bg-[#202124] z-0">
            {/* {toggleClicked['sidebar'] && <SideBar />} */}
            {isSocketConnected && <SideBar />}
            {isSocketConnected && <VideoContainer />}
            <ToolBar />
            { toggleClicked['whiteboard'] && <WhiteBoard/> }
        </main>
    );
}
