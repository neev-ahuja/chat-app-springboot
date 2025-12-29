import { useContext, createContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {


  const [user, setUser] = useState({});

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    setLoading(false);
  }, [])

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const fetchUser = async () => {
        const response = await api.get("/api/user");
        setUser(response.data);
        setIsConnected(true);
      }
      fetchUser();
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post("/api/login", {
      username,
      password
    });
    if(response.data.startsWith("FAILED")) return;
    localStorage.setItem("token", response.data);
    setToken(response.data);
  }

  const register = async (username, password, name) => {
    const response = await api.post("/api/register", {
      username,
      password,
      name
    });
    if(response.data === "SUCESS") await login(username , password);  
  }

  const logOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser({});
  }



  return (
    <AuthContext.Provider value={{ user, token, login, register, logOut, loading  , isConnected}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};