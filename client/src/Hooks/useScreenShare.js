import useMedia from "./useMedia";
import useToggle from "./useToggle";


const useScreenShare = () => {

    const { screenVideoRef } = useMedia()
    const { handleToggleClick } = useToggle()

    const startScreenShare = async () => {
        try {
            handleToggleClick('screenshare')
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
            if (screenVideoRef.current) {
            }
            screenVideoRef.current.srcObject = screenStream;
        } catch (error) {
            alert(error)
        }
    }

    const stopScreenShare = () => {
        // const ref = getScreenVideoRef();
        // console.log('hello: ', ref.current);
        if (screenVideoRef.current) {
            const stream = screenVideoRef.current.srcObject;
            if (stream && stream instanceof MediaStream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                screenVideoRef.current.srcObject = null;
                handleToggleClick('screenshare');
            }
        }
    };

    // useEffect(() => {





    //     if (toggleClicked['screenshare']) {
    //         startScreenShare()
    //     }
    //     if(!toggleClicked['screenshare']){
    //         stopScreenShare()
    //     }
    //     return () => {
    //         // Cleanup on component unmount
    //         // const ref = getScreenVideoRef();
    //         // console.log('screen: ', ref.current);
    //         // if (ref.current) {
    //         //     const tracks = screenVideoRef.current.srcObject?.getTracks() || [];
    //         //     tracks.forEach(track => track.stop());
    //         //     ref.current.srcObject = null;
    //         // }
    //         // if(toggleClicked['screenshare'] == false){
    //         //     stopScreenShare()
    //         // }
    //     };
    // }, [toggleClicked['screenshare'], socketRef]);

    return { startScreenShare, stopScreenShare }
}

export default useScreenShare;