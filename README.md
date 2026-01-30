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
