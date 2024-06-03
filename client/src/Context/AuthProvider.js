import { createContext, useState } from "react";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);

    return (
        <AuthContext.Provider value={{auth, setAuth, loggingOut, setLoggingOut}}>
            { children }
        </AuthContext.Provider>
    );
}

export default AuthContext;