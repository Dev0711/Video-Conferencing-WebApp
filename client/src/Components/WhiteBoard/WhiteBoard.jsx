import { Tldraw } from "tldraw";
import "./white-board.css";


export default function WhiteBoard() {
    return (
        <div className=" z-20 absolute top-0 left-1/2 -translate-x-1/2   my-2  h-[90%] w-[55%]  rounded-md ">
            <Tldraw />
        </div>
    );
}