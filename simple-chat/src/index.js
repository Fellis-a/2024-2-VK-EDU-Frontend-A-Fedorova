import './index.css';

const form = document.querySelector('form');
const input = document.querySelector('.chat__input');
const message = document.querySelector('.chat__messages');
const MESSAGES_KEY = 'messages';

form.addEventListener('submit', handleSubmit);
// form.addEventListener('keypress', handleKeyPress);

const currentUser = 'Я';
const otherUser = 'Друг';

function getMessages() {
    let messages = localStorage.getItem(MESSAGES_KEY);
    if (messages) {
        return JSON.parse(messages);
    } else return [];
}

function saveMessages(messages) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

function displayMessages() {
    let messages = getMessages();
    message.innerHTML = '';
    for (let msg of messages) {
        let newMessage = document.createElement("div");
        newMessage.innerHTML = ` <strong>${msg.sender}</strong><p> ${msg.text}</p><div><span class="message__time">${msg.time}</span><i class="material-icons">done_all</i></div>`;
        newMessage.classList.add('message');
        newMessage.classList.add(msg.sender === currentUser ? 'sent' : 'received');
        message.append(newMessage);
    }

}

function getCurrentTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function handleSubmit(event) {
    event.preventDefault();
    let messageText = input.value.trim();

    if (messageText) {
        const messages = getMessages();

        const newMessage = {
            text: messageText,
            sender: currentUser,
            time: getCurrentTime()
        };

        messages.push(newMessage);
        saveMessages(messages);

        input.value = '';
        displayMessages();

        setTimeout(() => {
            sendAutoReply();
        }, 1000 + Math.random() * 1000);
    }

}

// function handleKeyPress(event) {
//     if (event.keyCode === 13) {
//         event.preventDefault();
//         form.dispatchEvent(new Event('submit'));

//     }
// }

window.addEventListener('load', displayMessages);

function sendAutoReply() {
    const replies = [
        "Привет!",
        "Как дела?",
        "Что нового?",
        "Хорошо, спасибо!"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const messages = getMessages();

    const replyMessage = {
        text: randomReply,
        sender: otherUser,
        time: getCurrentTime()
    };

    messages.push(replyMessage);
    saveMessages(messages);

    displayMessages();
}