import { useContext } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import styles from './App.module.scss';
import ChatList from './pages/PageChatList';
import ChatItem from './pages/PageChat';
import UserProfile from './pages/PageUserProfile';
import { ChatContext } from './context/ChatProvider';
import { HeaderChat } from './components/Header';
import NotFound from './components/NotFound';

const App = () => {
  const { createChat, selectChat } = useContext(ChatContext);

  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/"
          element={<ChatList onChatSelect={selectChat} createChat={createChat} />}
        />
        <Route path="/chat/:chatId" element={<ChatView />} />
        <Route
          path="/profile"
          element={
            <>
              <UserProfile />
            </>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/404" element={<NotFound />} />
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
  const chat = chats.find(chat => chat.chatId === parseInt(chatId));

  if (chats.length === 0) {
    return <div>Загрузка...</div>;
  }

  if (!chat) return <Navigate to="/" replace />;

  return (
    <>
      <HeaderChat title={chat.name} avatarUrl={chat.imageUrl} />
      <ChatItem chat={chat} messages={messages[chat.chatId] || []} />
    </>
  );
};

export default App;
