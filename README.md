For Creating this real-time messaging feature we will use Socket.io. It is a free open-source library that enables real time bi-direction,
communication between client app and server.

==> Added Sidebar <==
-> included search bar with input to get the users.
-> displayed the users form the dummyuserData.
-> by displaying their status whether it is online or offline.
-> Sidebar also contains the menu icon which has Edit Profile and Logout sections as pages.
-> They can only be seen when the we hovered on the menu icon.
-> on clicking the EditProfile we will be redirected to /profile.
-> This is done using the useNavigate()
-> user info like image, status whether online or offline, name and if there are any unread messages are visible on the sidebar.
-> selectedUser and setSelectedUser are passed as props to the sidebar from the Homepage.

==> Added ChatContainer <==
-> added messages form both the sender and receiver.
-> added input to send the message and file upload feature to chose a file from the system.

==> Added RightSidebar <==
-> Displayed user profilePic, username and online status on clicking on the user profile.
-> Media section used to display all the images sent between the users.
-> on clicking the image it will be opened on the new window using window.opnen(url).

==> Added LoginPage <===
-> For Sign up page fullName, email, password, create Account.
-> separate states for the fullName, email, password.
-> For Login page email, password and Login as button.

==> Added Profile Page <==
-> added an image input of file to change the user prfoilePic.
-> an input to change the user name using setName state.
-> used textArea to change the user bio using setbio state.
-> onSubmiting of the form the, when clicked on the save the user will navigated to the home page using th useNavigate Hook.
-> event.preventDefault() is used to prevent the website from the refresh on submission.

== Backend ==
-> express : Useful in Routing, Middlewares.
-> bcryptjs : Helps to hash the passwords.
-> mongoose : Helps you write the strict MongoDB Schemas.
-> nodemon : helps in restarting the server on every change we make, instead of killing the server and starting it.
-> Socket.io : Helpful in the bidirectional communication of messages between the users, built on top of the webSockets.
-> cors : Helps in connceting your backend with any other frontend urls.
-> cloudinary : to store the images.

==> User Authentication <==
-> Sign Up : to create a new user with the details like email, fullName, bio, profilePic, and Password.
-> Login : To login the existing user with details email and password.
-> protectedRoute : It's a middleware which will be executed before executing the controller function, helpful in accessing the protected routes.
-> checkAuth : to check the user authorization details.
-> updateProfile : to update the fullName, profilePic and bio, profilePic will updated using the clodinary and fullname , bio throught req.body.
-> By default findOneAndUpdate() with return the Object before update was applied, by setting the new : true, findOneAndUpdate() will give you the object after update was applied.
-> Routes are /signup, /login,/update-profile, /check.

==> Protected Route (Middleware) <==
-> contains req, res, next as parameters.
-> middleware helps to change the req and res.
-> after successfull verification of the user.
-> the access passed to the next route uisng the next() at the end of the route.

==> Message Controllers <==
-> UsersForSidebar : By excluding the main user displaying all the users that is contact list, we are getting all the users by comparing the users not equal to actual user.
-> Counting Unseen Messages using the senderId and receiverId where the messages are not seen add that count of messages with senderId in the unseenMessages.
-> getMessages : get all messages for the selected user, displaying the messages between the two users, and whenever user opens chats then all the messages will be marked as seen.
-> markMessageAsSeen : this is the api to mark the message as seen by using the message id, that is we are marking the particular message as seen using the id of that message,
-> in this we are using findByIdAndUpdate() by passing id and seen : true.
-> sendMessage : to send the message from the sender to receiver, if there is image then upload it to te cloudinary and store that url in the db, 
                 create a newMessage with senderId, recieverId, text and image : imageUrl, with the help of the socket.io based on the receiver sokcetid we send the messages,
                 that is emit messages to receiverSocketId by newMessage operation.By this the messages will get displayed on the receiver side.

==> Added Functions to Fetch Data From Backend <==
-> With Help of react hook useContext we can share values between multiple levels of components without passing props through each level.
-> checkAuth is to check the user authentication, if valid user setAuthUser to data.user and connectSocket to the data.user.
-> setAuthUser is to store the authenticated user in frontend.
-> connectSocket is to connect socket for authentication.
-> setToken is to set the token in the frontend
-> and token is stored in localStorage using setItem("token", token)
-> login function to handle user authentication and socket connection, if user is valid we make socket connection.
-> logout function is to remove the token from the localStorage using the removeItem("token") and setAuthUser to null and socket.disconnect() to disconnect with socket.
-> updateProfile is to update the userData using update-profile api from the backend, and user to setAuthUser.

==> Connected Backend APIs with Functions to Use them with Frontend <==
-> With the help of useContext we can use the functions in AuthContext.
-> login function is to display the signup form and login form based on the currState whether it is signup or login.
-> updateProfile is to update the details of the user like profilePic, fullName, bio. If the profilePic is not changed we can include fullName and bio.
-> if the profilePic we can not directly store it, FileReader is a browser API, it reads files on the client side.
-> FileReader is needed because files can't be sent directly as JSON.
-> reader.readAsDataURL(image) starts reading the image file, and converts it into a Data URL.
-> Exampel : Format will look like  data : image/png: base64, ioveIhefogrtg..
-> This code includes file type (image/png).
-> encoding type 64.
-> reader.onload() this function runs only after the file is fully read.
-> reader.result contains Base64 string.
-> after successful profile update, redirect the user to home page.
-> logout function is imported form the AuthContext.
-> logout function removes the token from the localStorage.removeItem("token")
-> if there is no token then we are logged out and socket is disconected.
-> onclicking the logut we get logged out.
