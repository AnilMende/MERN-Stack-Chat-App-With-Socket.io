import React, { useRef, useEffect, useContext, useState } from "react";
import assets from "../assets/assets.js";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState("");

    //handle sending a message
    const handleSendMessage = async (event) => {
        event.preventDefault();
        //if it is a empty message we will not send message
        if (input.trim() == "") return null;
        await sendMessage({ text: input.trim() });
        setInput("");
    }

    //handle sending a image
    const handleSendImage = async (event) => {
        const file = event.target.files[0];
        //if file is not selected or the selected file is not in the required format
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select an Image File")
            return;
        }
        //if the image is selected
        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
            //after sending the image make it as null
            event.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    //for every selectedUser get the message
    useEffect(() => {
        //if the selectedUser is available
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);


    const scrollEnd = useRef();

    //whenever the new message comes in or there are messages
    //it will scroll down , adding messages as dependency
    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages]);


    return selectedUser ? (
        <div className="h-full overflow-scroll relative backdrop-blur-lg">
            {/*---header----*/}

            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">

                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded full" />

                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    {selectedUser.fullName}
                    {/*-- if onlineUsers contains the id of the selectedUser then display green dot
                    and whenever the selectedUser is in online then we display the green dot*/}
                    {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full
                     bg-green-500"></span>}
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt=""
                    className="md:hidden max-w-7" />
                <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
            </div>
            {/*---Char area----*/}
            <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
                {
                    messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 justify-end 
                            ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>

                            {
                                msg.image ? (
                                    <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700
                                    rounded-lg overflow-hidden mb-8" />
                                ) : (
                                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 
                                        break-all bg-violet-500/30 
                                        text-white ${msg.senderId === authUser._id ? 'rounded-br-none'
                                            : 'rounded-bl-none'} `}>{msg.text}</p>
                                )
                            }

                            <div className="text-center text-xs">
                                <img src={msg.senderId === authUser._id ? authUser?.profilePic ||
                                    assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                                    alt="" className="w-7 rounded-full" />

                                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
                            </div>

                        </div>
                    ))
                }

                <div ref={scrollEnd}></div>
            </div>

            {/*---Bottom area----*/}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
                <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">

                    <input onChange={(event) => setInput(event.target.value)} value={input}
                        onKeyDown={(event) => event.key === "Enter" ? handleSendMessage(event) : null}
                        type="text" placeholder="Send a message"
                        className="flex-1 text-sm p-3 border-none rounded-lg outline-none
                     text-white placeholder-gray-400"/>

                    <input onChange={handleSendImage} type="file" id="image"
                        accept="image/png image/jpeg" hidden />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
                    </label>

                </div>
                <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />
            </div>

        </div>
    ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
            <img src={assets.logo_icon} className="max-w-16" alt="" />
            <p className="text-lg font-medium text-white ">Chat anytime, anywhere</p>
        </div>
    )
}
export default ChatContainer;