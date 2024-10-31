import { useContext } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import styles from './App.module.scss';
import Header from './components/Header';
import ChatList from './pages/PageChatList';
import ChatItem from './pages/PageChat';
import UserProfile from './pages/PageUserProfile';
import FloatingButton from './components/FloatingButton';
import { ChatContext } from './context/ChatProvider';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const App = () => {
  const { createChat, selectChat } = useContext(ChatContext);

  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className={styles.headerMain}>
                <Header title="Чаты" />
                <button className={styles.searchButton}>
                  <SearchIcon />
                </button>

              </div>
              <ChatList onChatSelect={selectChat} />
              <FloatingButton addChat={createChat} />
            </>
          }
        />
        <Route path="/chat/:chatId" element={<ChatView />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/language" element={<LanguagePage />} /> */}
      </Routes>
    </div>
  );
};

const ChatView = () => {
  const { chats, messages } = useContext(ChatContext);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const chat = chats.find(chat => chat.chatId === parseInt(chatId));

  if (!chat) return <Navigate to="/" replace />;

  return (
    <>
      <Header
        leftElement={
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowBackIosNewIcon />
          </button>
        }
        centerElement={<img src={chat.imageUrl} alt={chat.name} className={styles.chatAvatar} />}
        title={chat.name}
        rightElement={
          <div className={styles.chatButtons}>
            <button className={styles.searchButton}>
              <SearchIcon />
            </button>
            <button className={styles.moreButton}>
              <MoreVertIcon />
            </button>
          </div>
        }
      />
      <ChatItem chat={chat} messages={messages[chat.chatId] || []} />
    </>
  );
};

export default App;
