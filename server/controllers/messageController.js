import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from '../lib/cloudinary.js';
import { io, userSocketMap } from '../server.js';

//Get all users except the logged In user
export const getUsersForSidebar = async () => {

    try {
        //this is the receiver Id or Our Id
        const userId = req.user._id;
        //filtered Users contains all the users by excluding the receiver Id
        //and their passwords will not be fetched, we will get the senders details whose
        //Id is not equal to the recieverId.
        const filteredUsers = await User.find({_id : {$ne : userId}}).select("-password");
        
        //Count number of messages not seen
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId : user._id, receiverId : userId, seen : false});
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);

        res.json({success : true, users : filteredUsers, unseenMessages});
    } catch (error) {
        console.log(error.message);
        res.json({success : false, message : error.message})
    }
}


//Get all messages for selected User

export const getMessages = async (req, res) => {

    try {

        const { id : selectedUserId } = req.params;
        const myId = req.user._id;

        //to display the messages between the two users
        //messages sent by the user1 to user2
        //and messages sent by the user2 to user1
        const messages = await Message.find({
            $or : [
                {senderId : myId, receiverId : selectedUserId },
                {senderId : selectedUserId, receiverId : myId }
            ]
        })
        //marking the messages as read
        //whenever the user opens chats of another user all the messages are marked as seen
        await Message.updateMany({senderId : selectedUserId, receiverId : myId }, { seen : true });

        res.json({success: true, messages});
        
    } catch (error) {
        console.log(error.message);
        res.json({success : false, message : error.message});
    }
}


//api to mark messages as seen using message id 
// (marking the individual message)

export const markMessageAsSeen = async (req, res) => {

    try {

        //id of the single message
        const { id } = req.params;
        //the id with that message will be marked as seen
        await Message.findByIdAndUpdate(id, { seen : true });
        res.json({success : true });

    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}


//Send message to selected User

export const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        //if the image is available we have to upload it to cloudinary
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        //this newMessage will get stored in the Database
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        //Emit the newMessage to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success : true, newMessage});
        
    } catch (error) {
        console.log(error.message);
        res.json({success : false, message : error.message});
    }
}
