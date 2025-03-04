import './toolbar.css';
import { useNavigate } from 'react-router-dom';
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
import useScreenShare from '../../Hooks/useScreenShare';

// export function ToolTip({ text }) {
//     return ()
// }

export default function ToolBar() {
    const { toggleClicked, handleToggleClick } = useToggle();
    const { toggleAudio, toggleVideo } = useMedia();
    const { startScreenShare, stopScreenShare } = useScreenShare()

    const navigate = useNavigate()

    const handleScreenShareClick = () => {
        if (!toggleClicked['screenshare']) {
            startScreenShare();
        } 
        if(toggleClicked['screenshare']) {
            stopScreenShare();
        }
    }

    return (
        <>
            <section className="toolbar-container absolute flex w-full bottom-0 justify-center items-center bg-black z-10">
                <div className="toolbar-btn-s w-fit h-fit flex flex-row gap-10 lg:gap-20 justify-between items-center ps-1 pe-1">
                    <div title='leave meeting' className="leave-btn my-2 h-auto w-fit p-2 cursor-pointer rounded-full bg-red-600" onClick={() => navigate("/")}>
                        <img className="w-auto lg:h-7 -rotate-225" src={phone} alt="" />
                    </div>
                    <div title={toggleClicked['audio'] ? 'mute audio' : 'unmute audio'} className="mic-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => toggleAudio()} >
                        <img className="w-auto lg:h-7" src={toggleClicked['audio'] ? microphone : microphone_off} alt="" />
                    </div>
                    <div title={toggleClicked['audio'] ? 'show video' : 'hide video'} className="video-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => toggleVideo()}>
                        <img className="w-auto lg:h-7" src={toggleClicked['video'] ? video : video_off} alt="" />
                    </div>
                    <div className="screen-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => handleScreenShareClick()}>
                        <img className="w-auto lg:h-7" src={!toggleClicked['screenshare'] ? screen_share : screen_share_off} alt="" />
                    </div>
                    <div title='whiteboard' className="screen-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => handleToggleClick('whiteboard')}>
                        <img className="w-auto lg:h-7" src={chalkboard} alt="" />
                    </div>
                </div>
            </section>
        </>
    );
}


// onClick={() => screenShareToggle()}