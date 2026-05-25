import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("projectHubUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    localStorage.setItem("projectHubToken", data.token);
    localStorage.setItem("projectHubUser", JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (formData) => {
    setLoading(true);

    try {
      const payload = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        password: formData.password,
        position: formData.position?.trim() || "Team Member",
      };

      const { data } = await api.post("/auth/register", payload);
      saveSession(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);

    try {
      const payload = {
        email: formData.email?.trim().toLowerCase(),
        password: formData.password,
      };

      const { data } = await api.post("/auth/login", payload);
      saveSession(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("projectHubToken");
    localStorage.removeItem("projectHubUser");
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/profile");

    localStorage.setItem("projectHubUser", JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  };

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("projectHubUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);