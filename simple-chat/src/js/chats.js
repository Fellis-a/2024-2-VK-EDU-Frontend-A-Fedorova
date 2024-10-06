import '../css/chats.css';



document.querySelectorAll('.chat__item').forEach((chat, index) => {
    chat.addEventListener('click', () => {
        const name = chat.querySelector('.chat__title').textContent;
        const chatId = index + 1;
        localStorage.setItem('selectedChatId', chatId);
        localStorage.setItem('name', name);

        window.location.href = 'index.html';
    });
});
