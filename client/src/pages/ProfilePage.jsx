import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

import { AuthContext } from "../../context/AuthContext.jsx";

const ProfilePage = () => {

    //upadateProfiler is to update the user profile details
    const { authUser, updateProfile } = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState(null);
    //initially name is set to John
    const [name, setName] = useState(authUser.fullName);
    //initially bio is set to Hi I am using QuickChat.
    const [bio, setBio] = useState(authUser.bio);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        //if prfoileImage is not avialable means user is not willing to change the profileImg
        //only add the name and bio into updateProfile
        console.log("FORM SUBMITTED");
        if (!selectedImg) {
            await updateProfile({ fullName: name, bio });
            navigate("/");
            return;
        }

        //if the user wants to change the profileImg
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);

        reader.onload = async () => {
            const base64Image = reader.result;
            await updateProfile({
                profilePic: base64Image,
                fullName: name,
                bio
            });
            navigate("/");
        };

    }

    return (
        <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
            <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
            border-gray-600 flex items-center justify-between max-sm:flex-col-reverse
            rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                    <h1 className="text-lg">Profile Details</h1>

                    <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                        <input onChange={(event) => setSelectedImg(event.target.files[0])}
                            type="file" id="avatar" accept=".png .jpg .jpeg" hidden />
                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt=""
                            className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
                        upload profile image
                    </label>

                    <input type="text" onChange={(event) => setName(event.target.value)} value={name}
                        placeholder="Your Name"
                        className="p-2 border border-gray-500 rounded-md focus:outline-none 
                    focus:ring-2 focus:ring-violet-500" />

                    <textarea onChange={(event) => setBio(event.target.value)} value={bio}
                        rows={4} placeholder="Write profile bio" required
                        className="p-2 border border-gray-500 rounded-md focus:outline-none
                    focus:ring-2 focus:ring-violet-500"></textarea>

                    <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 
                    text-white p-2 rounded-full text-lg cursor-pointer">Save</button>

                </form>
                {/*-- if the image is selected it will display as rounded image*/}
                <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`}
                    src={authUser?.profilePic || assets.logo_icon} alt="" />
            </div>
        </div>
    )
}

export default ProfilePage;