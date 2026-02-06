import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const Sidebar = () => {

    //Chat Context
    const { users, getUsers, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

    //AuthContext
    const { logout, onlineUsers } = useContext(AuthContext);

    //state for the seraching of user
    const [input, setInput] = useState("");

    //filtering the user from all the users
    //when the input is empty the filter naturally shows all the users.
    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()));

    //whenever the onlineUsers changes we will get the users
    //with onlineUsers we are able to know users who are online and offline
    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    const navigate = useNavigate();

    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white 
               ${selectedUser ? "max-md:hidden" : ""}`}>

            <div className="pb-5">
                <div className="flex justify-between items-center">
                    <img src={assets.logo} alt="logo" className="max-w-40" />
                    <div className="relative py-2 group">
                        <img src={assets.menu_icon} alt="Menu" className="max-h-5 cursor-pointer" />
                        <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md 
                        bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
                            <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm">Edit Profile</p>
                            <hr className="my-2 border-t border-gray-500" />
                            {/*--on click of this user will get loggedout with the help of logout function
                            which removes the token from the localStorage*/}
                            <p onClick={() => logout()} className="cursor-pointer text-sm">Logout</p>
                        </div>
                    </div>
                </div>


                <div className="bg-[#282142] rounded-full flex items-center gap-2 px-4 py-3 mt-3">
                    <img src={assets.search_icon} alt="Search" className="w-2" />

                    <input onChange={(event) => setInput(event.target.value)} value={input}
                        type="text" placeholder="Serach User" className="bg-transparent border-none 
                    outline-none text-white text-xs placeholder-[#c8c8c8] flex-1" />
                </div>
            </div>

            <div className="flex flex-col">
                {
                    filteredUsers.map((user, index) => (
                        <div onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                            key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded 
                        cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                            <img src={user?.profilePic || assets.avatar_icon} alt=""
                                className="w-[35px] aspect-[1/1] rounded-full" />
                            <div className="flex flex-col leading-5">
                                <p>{user.fullName}</p>
                                {
                                    onlineUsers.includes(user._id)
                                        ? <span className="text-green-400 text-xs">Online</span>
                                        : <span className="text-neutral-400 text-xs">Offline</span>
                                }
                            </div>
                            {/*--if there are unseen messages and the unseen messages count is greater than 0*/}
                            {
                                unseenMessages[user._id] > 0 && <p className="absolute top-4 
                                right-4 text-xs h-5 w-5 flex justify-center items-center 
                                rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar;