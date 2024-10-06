import './index.css';

const form = document.querySelector('form');
const input = document.querySelector('.chat__input');
const message = document.querySelector('.chat__messages');
const MESSAGES_KEY = 'messages';
const selectedChatId = localStorage.getItem('selectedChatId');
const selectedName = localStorage.getItem('name');
const chatName = document.querySelector(' .chat__name');

form.addEventListener('submit', handleSubmit);
// form.addEventListener('keypress', handleKeyPress);

const currentUser = 'Я';
const otherUser = selectedName;
console.log(otherUser);

function getMessages() {
    let messages = localStorage.getItem(MESSAGES_KEY);
    if (messages) {
        return JSON.parse(messages);
    } else return {};
}

function saveMessages(chatId, messages) {
    const allMessages = getMessages();
    if (!allMessages[chatId]) {
        allMessages[chatId] = [];
    }
    allMessages[chatId] = messages;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
}

function displayMessages() {
    chatName.textContent = selectedName;
    let messages = getMessages()[selectedChatId] || [];
    message.innerHTML = '';
    for (let msg of messages) {
        let newMessage = document.createElement("div");
        newMessage.innerHTML = ` <strong>${msg.sender}</strong><p> ${msg.text}</p><div><span class="message__time">${msg.time}</span><i class="material-icons">done_all</i></div>`;
        newMessage.classList.add('message');
        newMessage.classList.add(msg.sender === currentUser ? 'sent' : 'received');
        message.append(newMessage);
    }
    scrollToBottom()

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
        const messages = getMessages()[selectedChatId] || [];

        const newMessage = {
            text: messageText,
            sender: currentUser,
            time: getCurrentTime()
        };

        messages.push(newMessage);
        saveMessages(selectedChatId, messages);

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

    const messages = getMessages()[selectedChatId] || [];

    const replyMessage = {
        text: randomReply,
        sender: otherUser,
        time: getCurrentTime()
    };
    messages.push(replyMessage);
    saveMessages(selectedChatId, messages);

    displayMessages();
}

function scrollToBottom() {
    message.scrollTop = message.scrollHeight;
}


// назад к списку чатов
const backButton = document.querySelector('.back-button');

backButton.addEventListener('click', () => {

    window.location.href = 'chats.html';
});

