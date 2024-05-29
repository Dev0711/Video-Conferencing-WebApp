import useMedia from "./useMedia";
import useToggle from "./useToggle";

const useScreenShare = () => {
  const {
    params,
    screenVideoRef,
    screenShareProducerRef,
    // screenProducerTransportRef,
    screenShareParamsRef,
    producerTransportRef,
    socketRef,
    // deviceRef,
  } = useMedia();
  const { handleToggleClick } = useToggle();

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
          // createScreenSendTransport();
          await connectScreenSendTransport();
        }
      } else {
        throw new Error("No tracks found in screen sharing stream");
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
      // Implement error handling
    }
  };

  const stopScreenShare = async () => {
    // const ref = getScreenVideoRef();
    // console.log('hello: ', ref.current);

    if (screenShareProducerRef.current) {
      const screenProducerId = screenShareProducerRef.current.id;
      await screenShareProducerRef.current.close();
      console.log("Screen sharing producer closed");
      screenShareProducerRef.current = null;
      console.log(screenProducerId);
      socketRef.current.emit("producer-close", {
        remoteProducerId: screenProducerId,
      });
    }

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
      screenShareProducerRef.current = await producerTransportRef.current.produce(
        screenShareParamsRef.current
      );
      // console.log(
      //   "screenShareProducerRef.current: ",
      //   screenShareProducerRef.current
      // );

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
