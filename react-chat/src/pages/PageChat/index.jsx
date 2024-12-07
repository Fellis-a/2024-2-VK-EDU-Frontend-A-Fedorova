import { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from '../../context/ChatProvider';
import { AuthContext } from '../../context/AuthContext';
import styles from './ChatItem.module.scss';
import useChats from '../../context/useChats';
import { HeaderChat } from '../../components/Header';

import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatItem = () => {
    const { chatId } = useParams();
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const chatMessages = useMemo(() => messages[chatId] || [], [messages, chatId]);
    const messagesEndRef = useRef(null);
    const [voiceBlob, setVoiceBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const { chats } = useChats();
    const { tokens } = useContext(AuthContext);
    const currentChat = chats.find((chat) => chat.id === chatId);
    const [isDragging, setIsDragging] = useState(false);

    const handleSendMessage = () => {
        if (!tokens?.access) {
            console.error('Токен не найден!');
            return;
        }
        if (message.trim()) {
            sendMessage(chatId, message.trim(), null, null);
            setMessage('');
        }
    };


    const handleSendLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationUrl = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
                    sendMessage(chatId, locationUrl, null, null);
                    console.log("Отправка геолокации:", { chatId, locationUrl });
                },
                (error) => {
                    console.error('Ошибка при получении геолокации', error);
                }
            );
        } else {
            console.error('Geolocation не поддерживается этим браузером');
        }
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = getSupportedMimeType();

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                setVoiceBlob(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Ошибка при попытке записи голоса:', error);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (voiceBlob) {
                handleSendVoice();
            }
        }
    };

    const getSupportedMimeType = () => {
        const mimeTypes = [
            'audio/webm;codecs=opus',
            'audio/ogg;codecs=opus',
            'audio/mp4;codecs=aac',
        ];
        return mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';
    };

    const handleVoiceButtonClick = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    const handleSendVoice = async () => {
        if (!voiceBlob || !tokens?.access) return;
        const mimeType = getSupportedMimeType();
        const file = new File([voiceBlob], 'recording.ogg', { type: mimeType });

        const formData = new FormData();
        formData.append('chat', chatId);
        formData.append('text', message.trim() || '');
        formData.append('voice', file);

        try {
            const response = await fetch(`${BASE_URL}/api/messages/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка при отправке:', errorData);
                throw new Error('Ошибка при отправке голосового сообщения');
            }

            // const messageData = await response.json();
            // sendMessage(chatId, messageData.text || '[голосовое сообщение]', null, messageData.voiceUrl);
            setVoiceBlob(null);
        } catch (error) {
            console.error('Ошибка при отправке голосового сообщения:', error);
        }
    };
    const handleFileDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);

        const files = Array.from(event.dataTransfer.files);
        if (!tokens?.access) {
            console.error('Токен не найден');
            return;
        }

        const formData = new FormData();
        formData.append('chat', chatId);
        formData.append('text', message.trim() || '');

        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await fetch(`${BASE_URL}/api/messages/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка при отправке файла:', errorData);
                throw new Error('Ошибка загрузки файла');
            }

            const messageData = await response.json();
            console.log('Ответ от сервера:', messageData);

            // // Добавляем сообщение в чат
            // sendMessage(chatId, messageData.text || '[Файл]', messageData.files?.[0]?.item);
        } catch (error) {
            console.error('Ошибка при отправке файла:', error);
        }
    };


    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().catch(console.error);
        }
    }, []);

    const showNotification = (title, body) => {
        if (Notification.permission === 'granted') {
            console.log('Отправка уведомления:', { title, body });
            new Notification(title, { body });
        } else {
            console.warn('Нет разрешения для отправки уведомлений.');
        }
    };

    useEffect(() => {
        const newMessages = Object.entries(messages).filter(([id, msgs]) => {
            const isNotCurrentChat = id !== chatId;
            const lastMessage = msgs[msgs.length - 1];

            return isNotCurrentChat && lastMessage && !lastMessage.notified;
        });

        newMessages.forEach(([id, msgs]) => {
            const lastMessage = msgs[msgs.length - 1];
            lastMessage.notified = true;
            showNotification(
                chats.find(chat => chat.id === id)?.title || 'Новое сообщение',
                lastMessage.text || 'Вложение'
            );
        });
    }, [messages, chatId, chats]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    useEffect(() => {
        if (voiceBlob) {
            handleSendVoice();
        }
    }, [voiceBlob]);

    return (
        <div className={styles.chatItem}>
            <HeaderChat title={currentChat ? currentChat.title : 'Чат'} avatarUrl={currentChat ? currentChat.avatar : ''} />
            <div
                className={`${styles.chatMessages} ${isDragging ? styles.dragging : ''}`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => {
                        const isSent = msg.senderId === userId;
                        return (
                            <div key={index} className={isSent ? `${styles.message} ${styles.sent}` : `${styles.message} ${styles.received}`}>
                                <span className={styles.sender}>{msg.senderName}</span>
                                <div className={styles.messageContent}>
                                    {msg.files?.map((file, index) => (
                                        <img key={index} src={file.item} alt="Uploaded content" className={styles.messageImage} />
                                    ))}

                                    {typeof msg.text === 'string' && msg.text.startsWith('http') ? (
                                        <a className={styles.geoLink} href={msg.text} target="_blank" rel="noopener noreferrer">
                                            {msg.text}
                                        </a>
                                    ) : (
                                        msg.text && <span>{msg.text}</span>
                                    )}
                                    {msg.voice && (
                                        <audio controls className={styles.voiceMessage}>
                                            <source src={msg.voice} type={getSupportedMimeType()} />
                                            Ваш браузер не поддерживает аудио.
                                        </audio>
                                    )}
                                </div>
                                <div className={styles.messageInfo}>
                                    <span title={`Дата: ${msg.date}, Время: ${msg.time}`} className={styles.messageTime}>
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
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button className={styles.chatBtnSend} onClick={handleSendMessage}>
                    <ArrowUpwardIcon />
                </button>
                <button className={styles.chatBtnSend} onClick={handleSendLocation}><AddLocationIcon /></button>
                <button onClick={handleVoiceButtonClick} className={styles.chatBtnSend}>
                    {isRecording ? <StopCircleIcon /> : <KeyboardVoiceIcon />}
                </button>
            </footer>
        </div>
    );
};

export default ChatItem;