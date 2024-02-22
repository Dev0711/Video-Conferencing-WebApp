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
            console.log(response.data.accessToken);
            return { 
                ...prev, 
                ...response.data }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
