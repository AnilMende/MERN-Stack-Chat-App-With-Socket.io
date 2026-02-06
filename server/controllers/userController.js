import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

//Sign up a new user
export const signup = async (req, res) => {

    const { email, fullName, bio, password } = req.body;

    try {

        if (!fullName || !email || !bio || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "Account Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email, fullName, password: hashedPassword, bio
        })

        const token = generateToken(newUser._id);

       // localStorage.setItem("token", token);

        res.json({ success: true, userData: newUser, token, message: "Account Created Successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


//Controller to login User
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;
        //fetching user data from db using the email
        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        //if the credential are correct, we are generating a token
        const token = generateToken(userData._id);
        //localStorage.setItem("token", token);

        res.json({ success: true, userData, token, message: "Login Successful" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


//controller to check if the user is authenticated
export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user });
}

//controller to update the user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, bio } = req.body;

        const userId = req.user._id;

        let updatedUser;
        //user is not willing to update profile Pic
        //Be default findOneAnUpdate() will give you the object as it was before the update was applied
        //If you set new : true, findOneAndUpdate() will give you the object after update was applied

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { $set: { bio, fullName } },
                { new: true });

        } else {
            //user wants to update profilPic, fullName, and bio
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, { $set : { profilePic: upload.secure_url, bio, fullName } },
                { new: true });
        }

        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}