import { Tldraw } from "tldraw";
import "./white-board.css";


export default function WhiteBoard() {
    return (
        <div className=" absolute z-20 flex mx-auto top-0 my-2 h-[90%] w-[55%] ">
            <Tldraw />
        </div>
    );
}