import { useContext } from "react";
import MediaContext from "../Context/MediaProvider";

const useMedia = () => {
    return useContext(MediaContext);
}

export default useMedia;