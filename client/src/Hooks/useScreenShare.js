import useMedia from "./useMedia";
import useToggle from "./useToggle";
import useVideoFunctions from "./useVideoFunctions";

const useScreenShare = () => {
  const {
    params,
    screenVideoRef,
    screenShareProducerRef,
    screenProducerTransportRef,
    screenShareParamsRef,
    socketRef,
    deviceRef,
  } = useMedia();
  const { handleToggleClick } = useToggle();
  const { getProducers } = useVideoFunctions();

  //   const startScreenShare = async () => {
  //     try {
  //       handleToggleClick("screenshare");
  //       const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //         video: true,
  //       });
  //       if (screenVideoRef.current) {
  //       }
  //       screenVideoRef.current.srcObject = screenStream;
  //     } catch (error) {
  //       alert(error);
  //     }
  //     if (socketRef.current) {
  //         createScreenSendTransport()
  //     }
  //   };
  const startScreenShare = async () => {
    try {
      handleToggleClick("screenshare");
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Check if the screenStream contains tracks
      if (screenStream && screenStream.getTracks().length > 0) {
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }

        screenShareParamsRef.current = {
          ...params,
          track: screenStream.getVideoTracks()[0],
        };

        if (socketRef.current) {
          createScreenSendTransport();
        }
      } else {
        throw new Error("No tracks found in screen sharing stream");
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
      // Implement error handling
    }
  };

  const stopScreenShare = () => {
    // const ref = getScreenVideoRef();
    // console.log('hello: ', ref.current);
    if (screenVideoRef.current) {
      const stream = screenVideoRef.current.srcObject;
      if (stream && stream instanceof MediaStream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        screenVideoRef.current.srcObject = null;
        handleToggleClick("screenshare");
      }
    }
  };

  const createScreenSendTransport = () => {
    // This is a call from Producer, so sender = true
    socketRef.current.emit(
      "createWebRtcTransport",
      { consumer: true },
      async ({ params }) => {
        // Check if there's an error in params
        if (params.error) {
          console.log(params.error);
          return;
        }

        console.log("Params got from the server: ", params);

        // Create a new WebRTC Transport to send screen sharing media
        screenProducerTransportRef.current = deviceRef.current.createSendTransport(
          params
        );
        console.log(
          "Created producer transport: ",
          screenProducerTransportRef.current
        );

        // Handle 'connect' event for the producer transport
        screenProducerTransportRef.current.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            console.log("Inside producer connect.");
            try {
              // Signal local DTLS parameters to the server side transport
              await socketRef.current.emit("transport-connect", {
                dtlsParameters,
              });

              // Tell the transport that parameters were transmitted
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        // Handle 'produce' event for the producer transport
        screenProducerTransportRef.current.on(
          "produce",
          async (parameters, callback, errback) => {
            console.log("Inside producer produce.");
            console.log(
              "Parameters inside screenProducerTransportRef.current.produce: ",
              parameters
            );
            console.log(
              "rtpParameters inside screenProducerTransportRef.current.produce: ",
              parameters.rtpParameters
            );

            try {
              // Tell the server to create a Producer for screen sharing
              // and expect back a server side producer id
              await socketRef.current.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist }) => {
                  // Tell the transport that parameters were transmitted
                  // and provide it with the server side producer's id
                  callback({ id });

                  // If producers exist, then join room
                  if (producersExist) getProducers();
                }
              );
            } catch (error) {
              errback(error);
            }
          }
        );

        if (socketRef.current) connectScreenSendTransport();
      }
    );
  };

  const connectScreenSendTransport = async () => {
    console.log("Inside connectScreenSendTransport...");

    try {
      if (
        !screenShareParamsRef.current ||
        !screenShareParamsRef.current.track
      ) {
        throw new Error("Missing track for screen sharing");
      }
      // Produce screen sharing media
      screenShareProducerRef.current = await screenProducerTransportRef.current.produce(
        screenShareParamsRef.current
      );
      console.log(
        "screenShareProducerRef.current: ",
        screenShareProducerRef.current
      );

      // Add event listeners for screen sharing track and transport
      screenShareProducerRef.current.on("trackended", () => {
        console.log("Screen sharing track ended");
        // Implement logic to handle track ending
      });

      screenShareProducerRef.current.on("transportclose", () => {
        console.log("Screen sharing transport ended");
        // Implement logic to handle transport closure
      });
    } catch (error) {
      console.error("Error producing screen sharing media:", error);
      // Implement error handling
    }
  };

  return { startScreenShare, stopScreenShare };
};

export default useScreenShare;
