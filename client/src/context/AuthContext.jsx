import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("projecthubUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [loading, setLoading] = useState(false);

    const saveSession = (data) => {
        localStorage.setItem("projecthubToken", data.token);
        localStorage.setItem("projecthubUser", JSON.stringify(data.user));
        setUser(data.user);
    };

    const signup = async (formData) => {
        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", formData);
            saveSession(data);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", formData);
            saveSession(data);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("projecthubToken");
        localStorage.removeItem("projecthubUser");
        setUser(null);
    };

    const refreshProfile = async () => {
        const { data } = await api.get("/auth/profile");
        localStorage.setItem("projecthubUser", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    useEffect(() => {
        const syncUser = () => {
            const storedUser = localStorage.getItem("projecthubUser");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener("storage", syncUser);
        return () => window.removeEventListener("storage", syncUser);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, loading, signup, login, logout, refreshProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);