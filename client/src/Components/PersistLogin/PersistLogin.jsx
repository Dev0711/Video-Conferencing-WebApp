import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../../Hooks/useRefreshToken';
import useAuth from '../../Hooks/useAuth';
import Spinner from '../../assets/images/Spinner.gif';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, loggingOut } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            if (loggingOut) {
                setIsLoading(false);
                return;
            }
            try {
                await refresh()
            } catch (err) {
                console.log(err);
                toast.error(err)
            }
            finally {
                setIsLoading(false)
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

    }, [auth?.accessToken]);

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`);
    //     console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    // }, [isLoading]);

    return (
        <>
            {isLoading ? <img
                src={Spinner}
                className=' w-10 mx-auto block text-white'
                alt="Loading..."
            /> : <Outlet />}
        </>
    );
}
