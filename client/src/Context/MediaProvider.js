import { createContext, useRef } from "react";
import useToggle from "../Hooks/useToggle";

const MediaContext = createContext({});

export const MediaProvider = ({ children }) => {
  const { handleToggleClick } = useToggle();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // const socketRef = useRef(null);

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

  let audioProducer;
  let videoProducer;

  let audioEnabled;
  let videoEnabled;

  window.toggleMedia = function (type) {
    // console.log("This is audio -> ",audioEnabled)
    if (type === "audio") {
      audioEnabled = !audioEnabled;
      audioProducer.track.enabled = audioEnabled;
      handleToggleClick("audio");
    } else if (type === "video") {
      videoEnabled = !videoEnabled;
      videoProducer.track.enabled = videoEnabled;
      handleToggleClick("video");
    }
    console.log("toggleMedia function is called");
    // console.log('this is audio now -> ', audioEnabled);
  };

  return (
    <MediaContext.Provider
      value={{
        localVideoRef,
        remoteVideoRef,
        // socketRef,
        deviceRef,
        producerTransportRef,
        consumerTransportsRef,
        audioProducer,
        videoProducer,
        params,
        audioParamsRef,
        videoParamsRef,
        audioEnabled,
        videoEnabled,
        toggleMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContext;
