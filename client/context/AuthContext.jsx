
import { createContext, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from 'socket.io-client';


const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url;

//creating the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] =  useState(null);

    //check if user is authenticated and if so, set the user data and connect the socket.
    const checkAuth = async () => {
        try {
            
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast(error.message);
        }
    }


    //Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        //we are using it for both login and signup(register)
        //state variable holds values login and signup
        try {

            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = token;
                setToken(data.token);
                localStorage.setItem("token", data.token);

                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }


    //Logout function to handle user logout and socket disconnection
    const logout = async () => {
        //remove the token from the localStorage;
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        socket.disconnect();
    }

    //Update Profile Function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Connect socket function to handle socket connection and online users updates.
    // -> conncectSocket creates a socket connection for a logged-in user
    // -> Registers that user as online in the backend
    // -> Listens for updates about who else is online
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backend_url, {
            query : {
                userId : userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}