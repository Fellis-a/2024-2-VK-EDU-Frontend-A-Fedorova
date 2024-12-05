import { create } from 'zustand';
import { fetchChats, fetchMessages, sendMessageApi, createChatApi } from '../api/chats';
import { connect, disconnect } from '../api/centrifugo';


const useChatStore = create((set, get) => ({
    chats: [],
    selectedChat: null,
    messages: {},
    loading: false,


    loadChats: async (tokens) => {
        set({ loading: true });
        try {
            const data = await fetchChats(tokens.access);
            const chatsWithLastMessages = await Promise.all(
                data.results.map(async (chat) => {
                    const messagesData = await fetchMessages(chat.id, tokens.access);
                    const sortedMessages = (messagesData.results || []).sort(
                        (a, b) => new Date(a.created_at) - new Date(b.created_at)
                    );
                    const lastMessage = sortedMessages[sortedMessages.length - 1];

                    return {
                        ...chat,
                        avatar: chat.avatar || '/default-avatar.png',
                        lastMessage: lastMessage
                            ? lastMessage.text ||
                            (lastMessage.voice ? '[Голосовое сообщение]' : '') ||
                            (lastMessage.files?.length ? '[Изображение]' : 'Нет сообщений')
                            : 'Нет сообщений',
                        lastMessageTime: lastMessage
                            ? new Date(lastMessage.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : '',
                    };
                })
            );
            set({ chats: chatsWithLastMessages });
        } catch (error) {
            console.error('Failed to load chats:', error);
            set({ chats: [] });
        } finally {
            set({ loading: false });
        }
    },


    selectChat: async (chatId, { access }) => {
        if (!access) {
            console.error('Token not found!');
            return;
        }

        console.log(chatId);

        const chat = get().chats.find((chat) => chat.id === chatId);
        if (chat) {
            set({ selectedChat: chat });
            try {
                const data = await fetchMessages(chatId, access);
                const chatMessages = (data.results || []).sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );

                set((state) => ({
                    messages: {
                        ...state.messages,
                        [chatId]: chatMessages.map((msg) => ({
                            senderId: msg.sender.id,
                            senderName: msg.sender.first_name,
                            text: msg.text,
                            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            date: new Date(msg.created_at).toLocaleDateString(),
                            files: msg.files || null,
                            voice: msg.voice || null,
                        })),
                    },
                }));
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        }
    },

    setChats: (newChats) => set({ chats: newChats }),
    setSelectedChat: (chat) => set({ selectedChat: chat }),


    handleNewMessage: (data) => {
        if (data?.data?.event === 'create') {
            const newMessage = data.data.message;
            const chatId = newMessage.chat;
            set((prevState) => {
                const chatMessages = prevState.messages[chatId] || [];
                if (chatMessages.some((msg) => msg.id === newMessage.id)) {
                    return prevState;
                }

                const updatedMessages = {
                    ...prevState.messages,
                    [chatId]: [
                        ...chatMessages,
                        {
                            id: newMessage.id,
                            senderId: newMessage.sender.id,
                            senderName: newMessage.sender.first_name,
                            text: newMessage.text,
                            time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            date: new Date(newMessage.created_at).toLocaleDateString(),
                            files: newMessage.files || null,
                            voice: newMessage.voice || null,
                        },
                    ],
                };
                return { messages: updatedMessages };
            });

            set((prevState) =>
                prevState.chats.map((chat) =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            lastMessage: newMessage.text ||
                                (newMessage.voice ? '[Голосовое сообщение]' : '') ||
                                (newMessage.files?.length ? '[Изображение]' : 'Нет сообщений'),
                            lastMessageTime: new Date(newMessage.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        }
                        : chat
                )
            );
        }
    },


    sendMessage: async (chatId, messageText = '', files = null, voice = null, tokens) => {
        if (!tokens) {
            console.error('Токен авторизации отсутствует или некорректен');
            console.log(tokens)
            return;
        }

        try {
            await sendMessageApi(chatId, messageText, voice, files, tokens);


            console.log('Сообщение успешно отправлено');
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    },


    // Создаёт новый чат
    createChat: async (chatData, tokens) => {

        if (!tokens || !tokens.access) {
            throw new Error('Недействительные токены');
        }
        const response = await createChatApi(chatData, tokens.access);
        set((state) => ({
            chats: [...state.chats, response],
        }));
        console.log('Чат успешно создан:', response);
        console.log('Текущий список чатов:', get().chats);

        return response;

    },



    subscribeToChannel: (userId, tokens) => {
        connect(userId, tokens.access, get().handleNewMessage);
        set({ subscription: true });
    },


    unsubscribeFromChannel: () => {
        disconnect();
        set({ subscription: null });
    },

}));

export default useChatStore;
