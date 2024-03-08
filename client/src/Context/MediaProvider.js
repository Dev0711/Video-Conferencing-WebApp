import { createContext, useState, useRef, useEffect } from "react";
import useToggle from "../Hooks/useToggle";

const MediaContext = createContext({});

export const MediaProvider = ({ children }) => {
  const { toggleClicked, handleToggleClick } = useToggle();

  const localVideoRef = useRef(null);
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
  const deviceRef = useRef(null);
  const producerTransportRef = useRef(null);
  const consumerTransportsRef = useRef([]);

  const audioProducerRef = useRef(null);
  const videoProducerRef = useRef(null);

  let audioEnabled;
  let videoEnabled;

  const [chat, setChat] = useState([]);
  const [people, setPeople] = useState([]);

  //   let screenMediaPromise;

  //   if (!toggleClicked["screenshare"]) {
  //     // Start screen sharing
  //     screenMediaPromise = navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //     });
  //   } else {
  //     // Stop screen sharing
  //     screenMediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
  //   }

  //   screenMediaPromise
  //     .then(async (screenStream) => {
  //       handleToggleClick("screenshare");
  //       console.log("screenStream: ", screenStream);

  //       // Replace video track in your existing producers
  //       if (audioProducerRef.current && videoProducerRef.current) {
  //         // audioParamsRef.current = {
  //         //   track: screenStream.getAudioTracks()[0],
  //         //   ...audioParamsRef.current,
  //         // };
  //         // videoParamsRef.current = {
  //         //   track: screenStream.getVideoTracks()[0],
  //         //   ...videoParamsRef.current,
  //         // };
  //         if (screenStream.getAudioTracks().length > 0) {
  //           audioProducerRef.current.replaceTrack(screenStream.getAudioTracks()[0]);
  //         }

  //         if (screenStream.getVideoTracks().length > 0) {
  //           videoProducerRef.current.replaceTrack(screenStream.getVideoTracks()[0]);
  //         }
  //       }

  //       console.log("audioProducerRef.current -> ", audioProducerRef.current);
  //       console.log("videoProducerRef.current -> ", videoProducerRef.current);

  //       // Update your local video element
  //       if (localVideoRef.current) {
  //         localVideoRef.current.srcObject = screenStream;
  //       }

  //       // Handle other necessary UI updates

  //       // Handle ending of screen sharing
  //       screenStream.getVideoTracks()[0].onended = function () {
  //         if (toggleClicked["screenshare"]) {
  //           screenShareToggle();
  //         }
  //       };

  //       // console.log( ' \n \n \n  screenShare -> \n \n \n ' , toggleClicked["screenshare"]);

  //       socketRef.current.emit("screenShareToggle", { enabled: true });
  //     })
  //     .catch((error) => {
  //       alert("Unable to share screen: " + error.message);
  //       console.error(error);
  //     });
  // }

  const toggleVideo = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !toggleClicked['video'];
    // setIsVideoPaused(!isVideoPaused);
    handleToggleClick('video')
  };

  const toggleAudio = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !toggleClicked['audio'];
    // setIsAudioPaused(!isAudioPaused);
    handleToggleClick('audio')
  };

  useEffect(() => {
    console.log(people);
  }, [people]);

  return (
    <MediaContext.Provider
      value={{
        localVideoRef,
        remoteVideoRef,
        socketRef,
        deviceRef,
        producerTransportRef,
        consumerTransportsRef,
        audioProducerRef,
        videoProducerRef,
        params,
        audioParamsRef,
        videoParamsRef,
        audioEnabled,
        videoEnabled,
        toggleVideo,
        toggleAudio,
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
