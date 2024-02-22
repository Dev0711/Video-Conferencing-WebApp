import { useContext } from "react";
import ToggleContext from "../Context/ToggleProvider";

const useToggle = () => {
    return useContext(ToggleContext);
}

export default useToggle;