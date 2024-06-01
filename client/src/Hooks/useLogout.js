import axios from "../Api/axios";
import useAuth from "./useAuth";
import { toast } from "react-toastify";

const useLogout = () => {
    const { setAuth, setLoggingOut } = useAuth();

    const logout = async () => {
        setAuth(() => null);
        setLoggingOut(() => true);
        try {
            await axios.get('/logout', {
                withCredentials: true
            });
            toast.success("You have been Logged Out");
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout
