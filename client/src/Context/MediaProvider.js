import { createContext, useState, useRef, useEffect } from "react";
import useToggle from "../Hooks/useToggle";

const MediaContext = createContext({});

export const MediaProvider = ({ children }) => {
  const { toggleClicked, handleToggleClick } = useToggle();

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const socketRef = useRef(null);

  const params = {
    // mediasoup params
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  const audioParamsRef = useRef(null);
  const videoParamsRef = useRef({ params });
  const screenShareParamsRef = useRef({ params });
  const deviceRef = useRef(null);
  const producerTransportRef = useRef(null);
  const consumerTransportsRef = useRef([]);

  const audioProducerRef = useRef(null);
  const videoProducerRef = useRef(null);
  const screenShareProducerRef = useRef(null);

  let audioEnabled;
  let videoEnabled;
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [chat, setChat] = useState([]);
  const [people, setPeople] = useState([]);

  const toggleVideo = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !toggleClicked["video"];
    // setIsVideoPaused(!isVideoPaused);
    handleToggleClick("video");
  };

  const toggleAudio = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !toggleClicked["audio"];
    // setIsAudioPaused(!isAudioPaused);
    handleToggleClick("audio");
  };

  useEffect(() => {
    console.log(people);
  }, [people]);

  return (
    <MediaContext.Provider
      value={{
        params,
        localVideoRef,
        screenVideoRef,
        socketRef,
        deviceRef,
        producerTransportRef,
        consumerTransportsRef,
        audioProducerRef,
        videoProducerRef,
        screenShareProducerRef,
        params,
        audioParamsRef,
        videoParamsRef,
        screenShareParamsRef,
        audioEnabled,
        videoEnabled,
        toggleVideo,
        toggleAudio,
        isScreenSharing,
        setIsScreenSharing,
        // screenShareToggle,
        chat,
        setChat,
        people,
        setPeople,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContext;
