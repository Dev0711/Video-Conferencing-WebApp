import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMedia from '../../Hooks/useMedia';
import * as mediasoup from 'mediasoup-client'
import useAuth from '../../Hooks/useAuth';

export default function VideoContainer() {

    // const [remoteStreams, setRemoteStreams] = useState([]);

    const { auth } = useAuth()
    const { user } = auth;

    const {
        socketRef,
        localVideoRef,
        deviceRef,
        producerTransportRef,
        consumerTransportsRef,
        audioParamsRef,
        videoParamsRef,
        audioProducerRef,
        videoProducerRef,
    } = useMedia();

    const { meetingId } = useParams();

    // let producerTransport;
    // let consumerTransports = [];

    // let audioProducer;
    // let videoProducer;
    let consumingTransports = [];

    useEffect(() => {
        if (socketRef.current) {
            console.log('socketRef: ', socketRef.current.id);

            const getLocalStream = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                    });

                    console.log('stream: ', stream);

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
                    if (error.name === "UnsupportedError")
                        console.warn("browser not supported");
                }
            };

            const createSendTransport = () => {
                // see server's socketRef.on('createWebRtcTransport', sender?, ...)
                // this is a call from Producer, so sender = true
                socketRef.current.emit(
                    "createWebRtcTransport",
                    { consumer: false },
                    ({ params }) => {
                        // The server sends back params needed
                        // to create Send Transport on the client side
                        if (params.error) {
                            console.log(params.error);
                            return;
                        }

                        console.log('Params got from the server: ', params);

                        // creates a new WebRTC Transport to send media
                        // based on the server's producer transport params
                        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
                        // producerTransport = device.createSendTransport(params);
                        // setProducerTransport(() => {return device.createSendTransport(params)})
                        producerTransportRef.current = deviceRef.current.createSendTransport(params);
                        console.log('Created producer transport: ', producerTransportRef.current);

                        // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
                        // this event is raised when a first call to transport.produce() is made
                        // see connectSendTransport() below
                        producerTransportRef.current.on(
                            "connect",
                            async ({ dtlsParameters }, callback, errback) => {
                                console.log('Inside producer connect.');
                                try {
                                    // Signal local DTLS parameters to the server side transport
                                    // see server's socketRef.on('transport-connect', ...)
                                    await socketRef.current.emit("transport-connect", {
                                        dtlsParameters,
                                    });

                                    // Tell the transport that parameters were transmitted.
                                    callback();
                                } catch (error) {
                                    errback(error);
                                }
                            }
                        );

                        producerTransportRef.current.on(
                            "produce",
                            async (parameters, callback, errback) => {
                                console.log('Inside producer produce.');
                                console.log('Parameters inside producerTransportRef.current.produce: ', parameters);
                                console.log('rtpParameters inside producerTransportRef.current.produce: ', parameters.rtpParameters);

                                try {
                                    // tell the server to create a Producer
                                    // with the following parameters and produce
                                    // and expect back a server side producer id
                                    // see server's socketRef.on('transport-produce', ...)
                                    await socketRef.current.emit(
                                        "transport-produce",
                                        {
                                            kind: parameters.kind,
                                            rtpParameters: parameters.rtpParameters,
                                            appData: parameters.appData,
                                        },
                                        ({ id, producersExist }) => {
                                            // Tell the transport that parameters were transmitted and provide it with the
                                            // server side producer's id.
                                            callback({ id });

                                            // if producers exist, then join room
                                            if (producersExist) getProducers();
                                        }
                                    );
                                } catch (error) {
                                    errback(error);
                                }
                            }
                        );

                        if (socketRef.current) connectSendTransport();
                    }
                );
            };

            const connectSendTransport = async () => {
                // console.log('connectSendTransport triggered..');
                // we now call produce() to instruct the producer transport
                // to send media to the Router
                // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
                // this action will trigger the 'connect' and 'produce' events above
                console.log('Inside connectSendTransport...');
                audioProducerRef.current = await producerTransportRef.current.produce(audioParamsRef.current);
                // setaudioProducerRef.current(producerTransport.produce(audioParamsRef.current));
                videoProducerRef.current = await producerTransportRef.current.produce(videoParamsRef.current);
                // setVideoProducer(producerTransport.produce(videoParamsRef.current));

                console.log('audioProducerRef.current: ', audioProducerRef.current);
                console.log('videoProducerRef.current: ', videoProducerRef.current);

                audioProducerRef.current.on("trackended", () => {
                    console.log("audio track ended");

                    // close audio track
                })

                audioProducerRef.current.on("transportclose", () => {
                    console.log("audio transport ended");

                    // close audio track
                });

                videoProducerRef.current.on("trackended", () => {
                    console.log("video track ended");

                    // close video track
                });

                videoProducerRef.current.on("transportclose", () => {
                    console.log("video transport ended");

                    // close video track
                });
            };

            const signalNewConsumerTransport = async (remoteProducerId) => {
                console.log('Inside signalNewConsumerTransport...');
                //check if we are already consuming the remoteProducerId
                console.log('ConsumingTransports: ', consumingTransports);
                if (consumingTransports.includes(remoteProducerId)) return;
                consumingTransports.push(remoteProducerId);

                await socketRef.current.emit(
                    "createWebRtcTransport",
                    { consumer: true },
                    ({ params }) => {
                        // The server sends back params needed
                        // to create Send Transport on the client side
                        console.log('Inside createWebRtcTransport with consumer true...');
                        if (params.error) {
                            console.log(params.error);
                            return;
                        }
                        console.log(`PARAMS... ${params}`);

                        let consumerTransport;
                        try {
                            consumerTransport = deviceRef.current.createRecvTransport(params);
                        } catch (error) {
                            // exceptions:
                            // {InvalidStateError} if not loaded
                            // {TypeError} if wrong arguments.
                            console.log(error);
                            return;
                        }

                        consumerTransport.on(
                            "connect",
                            async ({ dtlsParameters }, callback, errback) => {
                                try {
                                    // Signal local DTLS parameters to the server side transport
                                    // see server's socketRef.on('transport-recv-connect', ...)
                                    await socketRef.current.emit("transport-recv-connect", {
                                        dtlsParameters,
                                        serverConsumerTransportId: params.id,
                                    });

                                    // Tell the transport that parameters were transmitted.
                                    callback();
                                } catch (error) {
                                    // Tell the transport that something was wrong
                                    errback(error);
                                }
                            }
                        );

                        if (socketRef.current) connectRecvTransport(consumerTransport, remoteProducerId, params.id);
                    }
                );
            };

            // server informs the client of a new producer just joined
            // if (socketRef.current) {
            // }
            socketRef.current.on("newProducer", ({ producerId }) => {
                console.log('Inside new-producer...: ', producerId);
                signalNewConsumerTransport(producerId)
            }
            );

            const getProducers = () => {
                socketRef.current.emit("getProducers", (producerIds) => {
                    console.log('All producer Ids: ', producerIds);
                    // for each of the producer create a consumer
                    // producerIds.forEach(id => signalNewConsumerTransport(id))
                    producerIds.forEach((producerId) => signalNewConsumerTransport(producerId));
                });
            };

            const videoContainer = document.getElementById('videoContainer')

            const connectRecvTransport = async (
                consumerTransport,
                remoteProducerId,
                serverConsumerTransportId
            ) => {
                // for consumer, we need to tell the server first
                // to create a consumer based on the rtpCapabilities and consume
                // if the router can consume, it will send back a set of params as below

                await socketRef.current.emit(
                    "consume",
                    {
                        rtpCapabilities: deviceRef.current.rtpCapabilities,
                        remoteProducerId,
                        serverConsumerTransportId,
                    },
                    async ({ params }) => {
                        console.log('Inside consume...');
                        if (params.error) {
                            console.log("Cannot Consume");
                            return;
                        }

                        console.log('Consumer Params: ', params);
                        // then consume with the local consumer transport
                        // which creates a consumer
                        const consumer = await consumerTransport.consume({
                            id: params.id,
                            producerId: params.producerId,
                            kind: params.kind,
                            rtpParameters: params.rtpParameters,
                        });

                        console.log('New consumer: ', consumer);
                        console.log('consumerTransportsRef.current before: ', consumerTransportsRef.current);

                        consumerTransportsRef.current = [
                            ...consumerTransportsRef.current,
                            {
                                consumerTransport,
                                serverConsumerTransportId: params.id,
                                producerId: remoteProducerId,
                                consumer,
                            },
                        ];

                        console.log('consumerTransportsRef.current after: ', consumerTransportsRef.current);
                        // create a new div element for the new consumer media
                        const newElem = document.createElement("div");
                        newElem.setAttribute("id", `td-${remoteProducerId}`);

                        if (params.kind == "audio") {
                            //append to the audio container
                            newElem.innerHTML =
                                '<audio id="' + remoteProducerId + '" autoplay></audio>';
                        } else {
                            //append to the video container
                            newElem.setAttribute("class", "remoteVideo");
                            newElem.innerHTML =
                                '<video id="' +
                                remoteProducerId +
                                '" autoplay className=" aspect-auto rounded-md object-contain video" ></video>';
                        }

                        videoContainer.appendChild(newElem);
                        // setRemoteStreams((prevStreams) => [
                        //     ...prevStreams,
                        //     <ConsumerComponent key={params.id} kind={params.kind} id={remoteProducerId} />,
                        // ]);

                        // destructure and retrieve the video track from the producer
                        const { track } = consumer;

                        document.getElementById(remoteProducerId).srcObject = new MediaStream([
                            track,
                        ]);

                        // the server consumer started with media paused
                        // so we need to inform the server to resume
                        socketRef.current.emit("consumer-resume", {
                            serverConsumerId: params.serverConsumerId,
                        });
                    }
                );
            };

            socketRef.current.on("screenShareToggle", ({ socketId, enabled }) => {
                // Handle the screen sharing toggle event
                if (enabled) {
                    // Screen sharing is enabled
                    console.log(`User with socket ID ${socketId} started screen sharing`);
                    // Implement any logic you need when screen sharing is started
                } else {
                    // Screen sharing is disabled
                    console.log(`User with socket ID ${socketId} stopped screen sharing`);
                    // Implement any logic you need when screen sharing is stopped
                }
            });


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
        <section className='my-2 mx-auto border h-[90%] w-[55%] p-3 rounded-md'>
            <video ref={localVideoRef} className=' w-full h-[60%] rounded-md object-cover' autoPlay muted></video>
            {/* <Webcam ref={localVideoRef} /> */}
            {/* {remoteStreams} */}
            <div id="videoContainer"></div>
        </section>
    );
}
