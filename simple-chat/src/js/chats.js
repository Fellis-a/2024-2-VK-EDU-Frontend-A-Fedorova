import '../css/chats.css';

document.querySelectorAll('.chat__item').forEach((chat, index) => {
    const chatId = JSON.parse(localStorage.getItem('chats'))[index].chatId;
    const lastMessage = localStorage.getItem(`lastMessage_${chatId}`);
    const lastMessageElement = chat.querySelector('.chat__last-message');

    lastMessageElement.textContent = lastMessage ? JSON.parse(lastMessage).text : 'Начните переписку прямо сейчас!';

    chat.addEventListener('click', () => {
        const name = chat.querySelector('.chat__title').textContent;
        localStorage.setItem('selectedChatId', chatId);
        localStorage.setItem('name', name);

        const imageUrl = chatImages.find(c => c.chatId === chatId)?.imageUrl || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg';
        localStorage.setItem(`chatImage_${chatId}`, imageUrl);
    });
});


// функция для генерации уникального идентификатора чата
function generateUniqueChatId() {
    let chats = JSON.parse(localStorage.getItem('chats')) || [];
    let chatId;

    do {
        chatId = Math.floor(Math.random() * 1000000);
    } while (chats.some(chat => chat.chatId === chatId));

    return chatId;
}


document.getElementById('createChatButton').addEventListener('click', () => {
    const chatId = generateUniqueChatId();
    const chatName = prompt('Введите имя собеседника:', 'Новый Чат');
    let chatImage = prompt('Введите URL картинки собеседника или просто нажмите ок:', 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg');

    if (chatName) {
        const newChat = {
            chatId,
            name: chatName,
            imageUrl: chatImage || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg',
            lastMessage: 'Начните переписку прямо сейчас!',
        };

        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        chats.push(newChat);
        localStorage.setItem('chats', JSON.stringify(chats));

        const initialMessage = { text: 'Начните переписку прямо сейчас!' };
        localStorage.setItem(`lastMessage_${chatId}`, JSON.stringify(initialMessage));

        displayChats();
    } else {
        alert('Чат не был создан. Имя собеседника не указано.');
    }
});

function displayChats() {
    const chatsContainer = document.querySelector('.chat');
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    chatsContainer.innerHTML = '';

    chats.forEach(chat => {
        const chatElement = document.createElement('a');
        chatElement.classList.add('chat__item');
        chatElement.href = `chat.html?chat_id=${chat.chatId}`;
        let d = new Date();
        const lastMessage = JSON.parse(localStorage.getItem(`lastMessage_${chat.chatId}`))?.text || 'Начните переписку прямо сейчас!';

        let chatImage = chat.imageUrl || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg';


        chatElement.innerHTML = `
        <img class="chat__avatar"
                src="${chatImage}"
                alt="Avatar">
            <div class="chat__details">
                <div class="chat__info">
                    <h2 class="chat__title">${chat.name}</h2>
                    <div>
                        <i class="chat__status material-icons">done_all</i>
                        <span class="chat__time">${String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')}</span>
                    </div>
                </div>
                <div>
                    <p class="chat__last-message">${lastMessage}</p>
                </div>
            </div>
        `;

        chatElement.addEventListener('click', () => {
            localStorage.setItem('selectedChatId', chat.chatId);
            localStorage.setItem('name', chat.name);
            localStorage.setItem(`chatImage_${chat.chatId}`, chatImage);
        });

        chatsContainer.appendChild(chatElement);
    });
}

window.addEventListener('load', displayChats);
