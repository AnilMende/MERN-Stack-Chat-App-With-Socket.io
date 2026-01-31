import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Middleware to protect routes
export const protectRoute = async (req, res, next) => {

    try {

        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({success : false, message : "User not found"});
        }

        //suppose the user is valid
        //in that case we will add the user data in the request
        //and now we can access the user data in the controller function
        req.user = user;
        
    } catch (error) {
        console.log(error.message);
        res.json({success : false, error : error.message});
    }
}