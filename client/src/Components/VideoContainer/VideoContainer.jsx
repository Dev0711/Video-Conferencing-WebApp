import './remote-video.css'
import useAuth from '../../Hooks/useAuth';
import useMedia from '../../Hooks/useMedia';
import useToggle from '../../Hooks/useToggle';
import useVideoFunctions from '../../Hooks/useVideoFunctions';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tldraw } from "tldraw";
import * as mediasoup from 'mediasoup-client'
import { useEffect, useRef } from 'react';

export default function VideoContainer() {

    const { auth } = useAuth()
    const { user } = auth;

    const {
        socketRef,
        localVideoRef,
        screenVideoRef,
        deviceRef,
        consumerTransportsRef,
        audioParamsRef,
        videoParamsRef,
    } = useMedia();

    const { createSendTransport, signalNewConsumerTransport } = useVideoFunctions();


    const { toggleClicked } = useToggle();

    const { meetingId } = useParams();

    useEffect(() => {
        if (socketRef.current) {
            console.log('socketRef: ', socketRef.current.id);

            const getLocalStream = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                    });

                    // console.log('stream: ', stream);

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }

                    audioParamsRef.current = {
                        track: stream.getAudioTracks()[0],
                        ...audioParamsRef.current,
                    };
                    videoParamsRef.current = {
                        track: stream.getVideoTracks()[0],
                        ...videoParamsRef.current,
                    };

                    joinRoom();
                } catch (error) {
                    console.log(error.message);
                    toast.error(error.message);
                }
            };

            getLocalStream();

            const joinRoom = () => {
                socketRef.current.emit("joinRoom", { meetingId, user }, async (data) => {
                    // console.log('Router RTP Capabilities... ', data.rtpCapabilities);
                    // we assign to local variable and will be used when
                    // loading the client Device (see createDevice above)
                    const rtpCapabilities = data.rtpCapabilities;
                    // setRtpCapabilities(data.rtpCapabilities);

                    console.log('Router RTP Capabilities... ', rtpCapabilities);

                    // once we have rtpCapabilities from the Router, create Device
                    if (socketRef.current && rtpCapabilities) createDevice(rtpCapabilities);

                    socketRef.current.emit('new-user', { meetingId, user })

                    // const newUser = data.newUser

                    // setPeople((prev) => [...prev, newUser]);
                    // console.log('this people after new user: ', people);
                });
            };

            // A device is an endpoint connecting to a Router on the
            // server side to send/recive media
            const createDevice = async (rtpCapabilities) => {
                // console.log('joinroom successfull..');
                try {
                    deviceRef.current = new mediasoup.Device();
                    console.log("Received RTP Capabilities", rtpCapabilities);
                    // console.log('newDivce: ', newDevice);

                    await deviceRef.current.load({
                        // see getRtpCapabilities() below
                        routerRtpCapabilities: rtpCapabilities,
                    });


                    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
                    // Loads the device with RTP capabilities of the Router (server side)

                    console.log("Device RTP Capabilities", deviceRef.current.rtpCapabilities);

                    // once the device loads, create transport
                    if (socketRef.current) createSendTransport();
                } catch (error) {
                    console.log(error);
                    toast.error(error)
                    if (error.name === "UnsupportedError")
                        console.warn("browser not supported");
                    toast.warn("browser not supported");
                }
            };

            socketRef.current.on("newProducer", ({ producerId }) => {
                console.log('Inside new-producer...: ', producerId);
                signalNewConsumerTransport(producerId)
            }
            );

            const videoContainer = document.getElementById('videoContainer')

            socketRef.current.on("producer-closed", ({ remoteProducerId }) => {
                // server notification is received when a producer is closed
                // we need to close the client-side consumer and associated transport
                const producerToClose = consumerTransportsRef.current.find(
                    (transportData) => transportData.producerId === remoteProducerId
                );
                producerToClose.consumerTransport.close();
                producerToClose.consumer.close();

                // remove the consumer transport from the list
                consumerTransportsRef.current = consumerTransportsRef.current.filter(
                    (transportData) => transportData.producerId !== remoteProducerId
                );

                // remove the video div element
                videoContainer.removeChild(
                    document.getElementById(`td-${remoteProducerId}`)
                );
            });

        }
    }, [socketRef]);

    // useEffect(() => {
    //   console.log('socketRef.current: ', socketRef.current);
    // }, [socketRef.current]);

    return (
        <section className=' relative my-2 flex flex-col mx-auto bg-[#292b2e] h-[90%] w-[55%] p-3 rounded-md'>
            <video ref={localVideoRef} className={` relative z-10 ${toggleClicked['screenshare'] ? ' w-44 h-[20%] m-2' : 'w-full h-[60%]'}  rounded-md object-cover`} autoPlay muted></video>
            {toggleClicked['screenshare'] && <video ref={screenVideoRef} className=' absolute mx-auto inset-0 w-[97.3%] mt-3 h-[58.1%] border object-cover' autoPlay muted></video>}
            {/* <Webcam ref={localVideoRef} /> */}
            {/* {remoteStreams} */}
            <div id="videoContainer" className=' h-full flex gap-1 overflow-auto'></div>
            {toggleClicked['whiteboard'] && <div className=" absolute z-20 mx-auto top-0 left-0 h-full w-full ">
                <Tldraw />
            </div>}
        </section>
    );
}
