import { useEffect, useState } from "react";
import { useContext } from "react";
import { Children } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const ChatContext = createContext();


export const ChatProvider = ({ children }) => {


    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});


    const { socket, axios } = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async () => {

        try {

            const { data } = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to get Messages for Selected User
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to send messages to selected user
    const sendMessage = async (messageData) => {

        try {

            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                //spread helps to add the new data with the already existing data
                //...prevMessages helps in adding the already avialable messages
                //with the new messages that is data.newMessage
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            }
            else{
                toast.error(error.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }


    //function to subscribe to messages for selected user
    const subscribeToMessages =  () => {
        //if the socket is not connected
        if(!socket) return;

        //suppose if the socket is conected
        socket.on("newMessage", (newMessage) => {
            //the message sender id and the id of the user we selected are same then the chatbox is open
            //or the messages can be marked as seen
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            //new messgaes are occurred but the user we selected is not same as the user who sent the messages
            //then they can be marked as unseen Messages.
            else{
                setUnseenMessages((previousUnseenMessages) => ({
                    ...previousUnseenMessages, [newMessage.senderId] : 
                       previousUnseenMessages[newMessage.senderId] ? previousUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }


    //function to unSubscribe from messages
    const unsubscribeFromMessages =  () => {
        if(socket) socket.off("newMessage");
    }


    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();

    }, [ socket, selectedUser ]);


    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        setMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    }

    return(
        <ChatContext.Provider value={value}>
            {Children}
        </ChatContext.Provider>
    )
}