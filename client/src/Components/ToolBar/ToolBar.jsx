import { useState } from "react";
import './toolbar.css';
import microphone from "../../assets/images/microphone.svg";
import microphone_off from "../../assets/images/microphone-off.svg";
import video from "../../assets/images/video.svg";
import video_off from "../../assets/images/video-off.svg";
import phone from "../../assets/images/phone.svg";
import screen_share from "../../assets/images/screen-share.svg";
import dots_vertical from "../../assets/images/dots-vertical.svg";
import dots from "../../assets/images/dots.svg";

export default function ToolBar() {
    const [isUnmute, setIsUnmute] = useState(true);
    const [isOn, setIsOn] = useState(true);

    return (
        <>
            <div className="toolbar-container fixed flex w-full bottom-0 justify-center items-center bg-black">
                <div className="toolbar-btn-s w-fit h-fit flex flex-row gap-10 lg:gap-20 justify-between items-center ps-1 pe-1">
                    <div className="leave-btn my-2 h-auto w-fit p-2 cursor-pointer rounded-full bg-red-600">
                        <img className="w-auto lg:h-7 -rotate-225" src={phone} alt="" />
                    </div>
                    <div className="mic-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => { setIsUnmute(!isUnmute) }}>
                        <img className="w-auto lg:h-7" src={isUnmute ? microphone : microphone_off} alt="" />
                    </div>
                    <div className="video-btn my-2 h-auto w-fit p-2 cursor-pointer" onClick={() => { setIsOn(!isOn) }}>
                        <img className="w-auto lg:h-7" src={isOn ? video : video_off} alt="" />
                    </div>
                    <div className="screen-btn my-2 h-auto w-fit p-2 cursor-pointer">
                        <img className="w-auto lg:h-7" src={screen_share} alt="" />
                    </div>
                    <div className="more-btn my-2 h-auto w-fit p-2 cursor-pointer fill-red-700">
                        <img className="w-auto lg:h-7" src={dots} alt="" />
                    </div>
                </div>
            </div>
        </>
    );
}
