import axios from '../Api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    // console.log('auth: ', auth);

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log('this is prev auth: ', JSON.stringify(prev));
            console.log(response.data);
            return { 
                ...prev, 
                ...response.data }
        });
        console.log('this is new auth: ', JSON.stringify(auth));
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
