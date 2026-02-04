import React, { useContext, useState } from "react";
import assets from "../assets/assets.js";
import { AuthContext } from "../../context/AuthContext.jsx";

const LoginPage = () => {


    const [currState, setCurrState] = useState("Sign up")

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");

    const [isDataSubmitted, setIsDataSubmitted] = useState(false);


    //This function fetches the data from the backend
    const { login } = useContext(AuthContext);


    const onSubmitHandler = (event) => {
        event.preventDefault();

        if(currState === "Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true);
            return;
        }

        //if the currState is signup it will call the signup api otherwise it will call the login api
        //login function contains state and credentials as parameters.
        login(currState === "Sign up" ? "signup" : "login", { fullName, email, password, bio});
    }


    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 
        sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
            {/*--Left--*/}
            <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />
            {/*--Right--*/}
            <form onSubmit={onSubmitHandler}
            className="border-2 bg-white/8 text-white border-gray-500 p-4 flex flex-col 
            gap-6 rounded-lg shadow-lg">
                <h2 className="font-medium text-2xl flex justify-between items-center">
                    {currState}
                    {/*-we can back to the previous form,when data is submitted we can show this icon  */}
                    {
                        isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} 
                        src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
                    }
                </h2>

                {/*--we only need full name for the signup state--*/}
                {
                    currState === "Sign up" && !isDataSubmitted && (

                        <input onChange={(event) => setFullName(event.target.value)} value={fullName}
                            type="text" placeholder="Full Name" className="p-2 border border-gray-500
                     rounded-md focus:outline-none" required />
                    )}

                {/*--when the user clicks the Login, isDataSubmitted becomes 
                true then we can show the login details--*/}
                {
                    !isDataSubmitted && (
                        <>
                            <input onChange={(event) => setEmail(event.target.value)} value={email}
                                type="email" placeholder="Email address" className="p-2 border border-gray-500
                        rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

                            <input onChange={(event) => setPassword(event.target.value)} value={password}
                                type="password" placeholder="Enter Password" className="p-2 border 
                        border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required />
                        </>
                    )
                }

                {currState == "Sign up" && isDataSubmitted && (
                    <textarea onChange={(event) => setBio(event.target.value)} value={bio}
                        rows={4} placeholder="provide a short bio..." className="p-2
                        border border-gray-500 rounded-md focus:outline-none focus:ring-2
                        focus:ring-indigo-500" required></textarea>
                )
                }

                <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 
                to-violet-600 text-white rounded-md cursor-pointer">
                    {currState == "Sign up" ? "Create Account" : "Login Now"}
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <input type="checkbox" required/>
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>

                <div className="flex flex-col gap-2">
                    {
                        currState == "Sign up" ? (
                            <p className="text-sm text-gray-500">Already Have an Account?
                                <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}
                                    className="font-medium text-violet-500 cursor-pointer">Login Here</span></p>
                        ) : (
                            <p className="text-sm text-gray-500">Create an Account
                                <span onClick={() => setCurrState("Sign up")}
                                    className="font-medium text-violet-500 cursor-pointer">Click Here</span></p>
                        )
                    }
                </div>
            </form>
        </div>
    )
}

export default LoginPage;