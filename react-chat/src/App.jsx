import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatList from './pages/PageChatList';
import ChatItem from './pages/PageChat';
import UserProfile from './pages/PageUserProfile';
import Login from './pages/PageLogin';
import Register from './pages/PageRegister';
import NotFound from './components/NotFound';
import useAuthStore from './store/authStore';

import useChatStore from './store/chatsListStore';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { tokens, currentUser, } = useAuthStore();
  const { createChat, selectChat } = useChatStore();
  console.log('Tokens in appjs:', tokens);
  const { subscribeToChannel, unsubscribeFromChannel } = useChatStore();
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    if (tokens && !currentUser) {
      fetchCurrentUser();
    }
  }, [tokens, currentUser]);

  useEffect(() => {
    if (tokens && currentUser?.id) {
      subscribeToChannel(currentUser.id, tokens);

      return () => {
        unsubscribeFromChannel();
      };
    } else {
      console.log("User is not logged in or no user ID found");
    }
  }, [tokens, currentUser, subscribeToChannel, unsubscribeFromChannel]);



  useEffect(() => {
    if (tokens) {
      console.log("User is logged in");
    } else {
      console.log("User is not logged in");
    }
  }, [tokens]);

  const handleCreateChat = (chatName, chatImage) => {
    createChat(chatName, chatImage);
  };

  const handleChatSelect = (chatId) => {

    const token = tokens?.access;
    if (!token) {
      console.error('Token not found!');
      return;
    }

    selectChat(chatId, { access: token });
  };



  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={tokens ? (
            <ChatList
              onChatSelect={handleChatSelect}
              createChat={handleCreateChat}
            />
          ) : (
            <Navigate to="/login" replace />
          )}
        />
        <Route path="/chat/:chatId" element={<ChatItem />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
    </div>

  );
};

export default App;