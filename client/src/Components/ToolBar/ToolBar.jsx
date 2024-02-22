import './toolbar.css';
import microphone from "../../assets/images/microphone.svg";
import microphone_off from "../../assets/images/microphone-off.svg";
import video from "../../assets/images/video.svg";
import video_off from "../../assets/images/video-off.svg";
import phone from "../../assets/images/phone.svg";
import screen_share from "../../assets/images/screen-share.svg";
// import dots_vertical from "../../assets/images/dots-vertical.svg";
import dots from "../../assets/images/dots.svg";
import MoreDropDown from "../MoreDropDown/MoreDropDown";
import useToggle from "../../Hooks/useToggle";
import useMedia from "../../Hooks/useMedia";

export default function ToolBar({setIsSideBar}) {
    const { toggleClicked, handleToggleClick } = useToggle();
    const { toggleMedia } = useMedia();


    return (
        <>
            <section className="toolbar-container absolute flex w-full bottom-0 justify-center items-center bg-black z-10">
                <div className="toolbar-btn-s w-fit h-fit flex flex-row gap-10 lg:gap-20 justify-between items-center ps-1 pe-1">
                    <div className="leave-btn my-2 h-auto w-fit p-2 cursor-pointer rounded-full bg-red-600">
                        <img className="w-auto lg:h-7 -rotate-225" src={phone} alt="" />
                    </div>
                    <div className="mic-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => toggleMedia('audio')} >
                        <img className="w-auto lg:h-7" src={toggleClicked['audio'] ? microphone : microphone_off} alt="" />
                    </div>
                    <div className="video-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => toggleMedia('audio')}>
                        <img className="w-auto lg:h-7" src={toggleClicked['video'] ? video : video_off} alt="" />
                    </div>
                    <div className="screen-btn my-2 h-auto w-fit p-2 cursor-pointer">
                        <img className="w-auto lg:h-7" src={screen_share} alt="" />
                    </div>
                    <div className="more-btn flex flex-col items-center my-2 h-auto w-fit cursor-pointer fill-red-700">
                        <div className="p-2" onClick={() => handleToggleClick('dropdown')}>
                            <img className="w-auto lg:h-7" src={dots} alt="" />
                        </div>
                        <div className="absolute bottom-16 lg:bottom-18 rounded">
                            {toggleClicked['dropdown'] && <MoreDropDown />}
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
