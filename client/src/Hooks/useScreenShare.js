

const useScreenShare = () => {
    useEffect(() => {

        const startScreenShare = async () => {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
                if (screenVideoRef.current) {
                    screenVideoRef.current.srcObject = screenStream;
                }
            } catch (error) {
                alert(error)
            }
        }

        const stopScreenShare = () => {
            const ref = getScreenVideoRef();
            console.log('hello: ', ref.current);
            if (ref.current) {
                console.log(1);
                const tracks = screenVideoRef.current.getTracks();
                tracks.forEach(track => track.stop());
                ref.current.srcObject = null;
            }
        };

        if (toggleClicked['screenshare']) {
            startScreenShare()
        }if(toggleClicked['screenshare'] == false){
            stopScreenShare()
        }
        return () => {
            // Cleanup on component unmount
            // const ref = getScreenVideoRef();
            // console.log('screen: ', ref.current);
            // if (ref.current) {
            //     const tracks = screenVideoRef.current.srcObject?.getTracks() || [];
            //     tracks.forEach(track => track.stop());
            //     ref.current.srcObject = null;
            // }
            // if(toggleClicked['screenshare'] == false){
            //     stopScreenShare()
            // }
        };
    }, [toggleClicked['screenshare'], socketRef]);
}