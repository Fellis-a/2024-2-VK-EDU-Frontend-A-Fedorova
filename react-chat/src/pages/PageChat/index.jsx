import { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatProvider';
import { AuthContext } from '../../context/AuthContext';
import styles from './ChatItem.module.scss';
import useChats from '../../context/useChats';
import { HeaderChat } from '../../components/Header';

import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const ChatItem = () => {
    const { chatId } = useParams();
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const chatMessages = useMemo(() => messages[chatId] || [], [messages, chatId]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { chats } = useChats();


    const currentChat = chats.find((chat) => chat.id === chatId);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);

    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log('Токен доступа:', tokens.access);

    const handleStartRecording = () => {
        setIsRecording(true);

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                const chunks = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                    setAudioBlob(audioBlob);
                };

                mediaRecorderRef.current.start();
            })
            .catch((error) => {
                console.error('Ошибка при записи аудио:', error);
            });
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };


    const handleSendVoiceMessage = async () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('voice', audioBlob, 'message.wav');
            formData.append('chat', chatId);

            if (!tokens.access) {
                console.error('Токен не найден');
                return;
            }

            try {
                const response = await fetch('/api/messages/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tokens.access}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Не удалось отправить голосовое сообщение');
                }

                const messageData = await response.json();
                sendMessage(chatId, { text: '[Голосовое сообщение]', audioSrc: messageData.src });
                setAudioBlob(null);
            } catch (error) {
                console.error('Ошибка при отправке голосового сообщения:', error);
            }
        }
    };

    const handleFileDrop = async (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;

        if (!tokens.access) {
            console.error('Токен не найден');
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                formData.append('image', file);
            }
        });

        try {
            const response = await fetch('/api/messages/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить изображения');
            }

            const messageData = await response.json();
            sendMessage(chatId, { text: '[Изображение]', imageSrc: messageData.src });
        } catch (error) {
            console.error('Ошибка при отправке картинок:', error);
        }
    };

    // const renderMessage = (msg) => {
    //     if (msg.imageSrc) {
    //         return <img src={msg.imageSrc} alt="User upload" className={styles.imageMessage} />;
    //     }
    //     return <span>{msg.text}</span>;
    // };


    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(chatId, message);
            setMessage('');

            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 0);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const notifyNewMessage = (message) => {
        if (document.hidden) {
            if (Notification.permission === 'granted') {
                new Notification('Новое сообщение', {
                    body: message.text,
                });
            }

            if (navigator.vibrate) {
                navigator.vibrate(1000);
            }
        }
    };

    useEffect(() => {
        chatMessages.forEach(msg => {
            if (msg.chat !== chatId) {
                notifyNewMessage(msg);
            }
        });
    }, [chatMessages]);

    const handleSendLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationUrl = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
                    sendMessage(chatId, locationUrl); // Отправить ссылку
                },
                (error) => {
                    console.error('Ошибка при получении геолокации', error);
                }
            );
        } else {
            console.error('Geolocation не поддерживается этим браузером');
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    useEffect(() => {
        const savedChatId = localStorage.getItem('selectedChatId');
        if (savedChatId && (!chatId || savedChatId !== chatId)) {
            navigate(`/chat/${savedChatId}`);
        }
    }, [chatId, navigate]);

    return (
        <div className={styles.chatItem}>
            <HeaderChat
                title={currentChat ? currentChat.title : 'Чат'}
                imageUrl={currentChat ? currentChat.imageUrl : ''}
            />
            <div className={styles.chatMessages} onDrop={handleFileDrop} onDragOver={handleDragOver}>
                {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => {
                        const isSent = msg.senderId === userId;
                        return (
                            <div
                                key={index}
                                className={
                                    isSent
                                        ? `${styles.message} ${styles.sent}`
                                        : `${styles.message} ${styles.received}`
                                }
                            >
                                <span className={styles.sender}>{msg.senderName}</span>
                                <p className={styles.messageText}>{msg.text}</p>
                                <div className={styles.messageInfo}>
                                    <span
                                        title={`Дата: ${msg.date}, Время: ${msg.time}`}
                                        className={styles.messageTime}
                                    >
                                        {msg.time}
                                    </span>
                                    <span className={styles.icon}>
                                        <DoneAllIcon className={isSent ? styles.sentIcon : styles.receivedIcon} />
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.noMessages}>
                        <ChatBubbleOutlineIcon className={styles.noMessagesIcon} />
                        <p className={styles.noMessagesText}>Нет сообщений</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <footer className={styles.chatInputForm}>
                <input
                    className={styles.chatInput}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button className={styles.chatBtnSend} onClick={handleSendMessage}>
                    <ArrowUpwardIcon />
                </button>
                <button className={styles.chatBtnSend} onClick={handleSendLocation}><AddLocationIcon /></button>
                <button className={styles.chatBtnVoice} onClick={handleStartRecording} disabled={isRecording}>
                    {isRecording ? <RecordVoiceOverIcon /> : <KeyboardVoiceIcon />}
                </button>

                <button className={styles.chatBtnVoice} onClick={handleStopRecording} disabled={!isRecording}>
                    <StopCircleIcon />
                </button>

                <button className={styles.chatBtnVoice} onClick={handleSendVoiceMessage} disabled={!audioBlob}>
                    Send Voice Message
                </button>
            </footer>
        </div>
    );
};

export default ChatItem;
