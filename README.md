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
