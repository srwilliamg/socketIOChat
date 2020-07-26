const socket = io();
let myUsername = "";
let users = {};

const newMsg = (message, isOutgoing) => {
    let date = new Date();

    const div = document.createElement('div');
    div.className = isOutgoing?'outgoing_msg':'received_msg';
    const innerDiv = document.createElement('div');
    innerDiv.className = isOutgoing?'sent_msg':'received_withd_msg';
    const text = document.createElement('p');
    const time = document.createElement('span');
    time.className = "time_date";

    text.innerText = message;
    time.innerText = date.toLocaleTimeString();

    innerDiv.appendChild(text);
    innerDiv.appendChild(time);
    div.appendChild(innerDiv);
    return div;
};

const newUser = (username, isActive = false) => {
    const divChat = document.createElement('div');
    divChat.className = isActive ? 'chat_list active_chat':'chat_list';
    const divPeople = document.createElement('div');
    divPeople.className = 'chat_people';
    const divImg = document.createElement('div');
    divImg.className = 'chat_img';
    const img = document.createElement('img');
    img.setAttribute('src','https://ptetutorials.com/images/user-profile.png');
    const divMsg = document.createElement('div');
    divMsg.className= 'chat_ib';

    const divText = document.createElement('h5');
    divText.innerText = username;

    divChat.appendChild(divPeople);
    divImg.appendChild(img);
    divPeople.appendChild(divImg);
    divPeople.appendChild(divMsg);
    divMsg.appendChild(divText);

    return divChat;
};

socket.on('connect', () => {
    socket.emit('connected');
});

socket.on('updateUsers', (data) => {
    console.log('new user connected');
    console.log(socket.username);
    
    let chatContainer = document.querySelector('#usersChat');

    myUsername = socket.username;
    users = data;
    
    document.querySelector('#username').textContent = username;
    chatContainer.innerHTML = '';

    users.forEach(user => {
        if(user != myUsername){
            chatContainer.appendChild(newUser(user));
        }
        else{
            chatContainer.appendChild(newUser(user, true));
        }
    });
});

socket.on('getMessage', (message) => {
    let messageContainer = document.querySelector('#historyMessageContainer');

    messageContainer.appendChild(newMsg(message, false));
    messageContainer.scrollTo(0,messageContainer.scrollHeight);
});

document.querySelector('#sendButton').addEventListener('click', () => {
    let inputMessage = document.querySelector('#message');
    let messageContainer = document.querySelector('#historyMessageContainer');
    let messageText = inputMessage.value;
    
    if(messageText.length > 0){
        messageContainer.appendChild(newMsg(messageText, true));
    
        inputMessage.value = "";
    
        messageContainer.scrollTo(0,messageContainer.scrollHeight);
        
        socket.emit('sendMessage', messageText);
    }

})