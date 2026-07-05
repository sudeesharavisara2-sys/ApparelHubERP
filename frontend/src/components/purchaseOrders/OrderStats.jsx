/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const saveUser = (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("authToken", data.token); // ✅ Changed from 'token' to 'authToken'
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken"); // ✅ Changed from 'token' to 'authToken'
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            saveUser,
            logout,
        }),
        [user]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}