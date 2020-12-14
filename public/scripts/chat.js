//
// COMP 484 | Spring 2020
// chat.js | Brandon Dahl, Priya Singh
//
// Contains the event handlers for the chat rooms
//======================================================================

// Variables
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});  // Ignore special characters in beginnng of query string target
const socket = io(); // Use socket functions


// Join Chat room
socket.emit('joinRoom', {
    username,
    room
}); // end socket


// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
}); // end socket


// Message from server
socket.on('message', message => {

    // Convert UTC time to client time
    message.time = new Date(message.time).toLocaleTimeString([], {timeStyle: "short"});
    outputMessage(message);

   // Scroll down when a message is sent by user
    chatMessages.scrollTop = chatMessages.scrollHeight;
}); // end socket


// Message submit handler, Listens when the user clicks submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent submission to file (default behavior)

    // Store inputted message
    const msg = e.target.elements.msg.value;

    // Emit message to the server
    socket.emit('chatMessage', msg);

    // Clear input box after message is sent
    e.target.elements.msg.value = '';

    // Focus cursor in input box
    e.target.elements.msg.focus();
}); // end chatForm


// Output message to DOM
function outputMessage(message) {
	// Create div in HTML to hold message
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}
	<span>${message.time}</span>
	</p>
	<p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
} // end outputMessages


// Add room name to DOM
function outputRoomName(room){
    roomName.innerHTML = room;
} // end outputRoomName


//Add users to Users List DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
} // end outputUsers


// Redirect user to main page after they leave the room
function leaveRoom() {
	location.href = 'index.html';
}
