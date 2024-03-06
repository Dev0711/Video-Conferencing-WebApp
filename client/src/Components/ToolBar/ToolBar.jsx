import './toolbar.css';
import microphone from "../../assets/images/microphone.svg";
import microphone_off from "../../assets/images/microphone-off.svg";
import video from "../../assets/images/video.svg";
import video_off from "../../assets/images/video-off.svg";
import phone from "../../assets/images/phone.svg";
import screen_share from "../../assets/images/screen-share.svg";
import screen_share_off from "../../assets/images/screen-share-off.svg";
import chalkboard from "../../assets/images/chalkboard.svg";
// import dots_vertical from "../../assets/images/dots-vertical.svg";
// import dots from "../../assets/images/dots.svg";
import useToggle from "../../Hooks/useToggle";
import useMedia from "../../Hooks/useMedia";

export default function ToolBar() {
    const { toggleClicked } = useToggle();
    const { toggleAudio, toggleVideo, screenShareToggle } = useMedia();


    return (
        <>
            <section className="toolbar-container absolute flex w-full bottom-0 justify-center items-center bg-black z-10">
                <div className="toolbar-btn-s w-fit h-fit flex flex-row gap-10 lg:gap-20 justify-between items-center ps-1 pe-1">
                    <div className="leave-btn my-2 h-auto w-fit p-2 cursor-pointer rounded-full bg-red-600">
                        <img className="w-auto lg:h-7 -rotate-225" src={phone} alt="" />
                    </div>
                    <div className="mic-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => toggleAudio()} >
                        <img className="w-auto lg:h-7" src={toggleClicked['audio'] ? microphone : microphone_off} alt="" />
                    </div>
                    <div className="video-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => toggleVideo()}>
                        <img className="w-auto lg:h-7" src={toggleClicked['video'] ? video : video_off} alt="" />
                    </div>
                    <div className="screen-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => screenShareToggle()}>
                        <img className="w-auto lg:h-7" src={toggleClicked['screenshare'] ? screen_share : screen_share_off} alt="" />
                    </div>
                    <div className="screen-btn my-2 h-auto w-fit p-2 cursor-pointer">
                        <img className="w-auto lg:h-7" src={chalkboard} alt="" />
                    </div>
                </div>
            </section>

        </>
    );
}
