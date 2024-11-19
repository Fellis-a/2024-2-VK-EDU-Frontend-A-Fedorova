import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ChatList from './pages/PageChatList';
import ChatItem from './pages/PageChat';
import UserProfile from './pages/PageUserProfile';
import Login from './pages/PageLogin';
import Register from './pages/PageRegister';
import NotFound from './components/NotFound';
import useChats from './context/useChats';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { tokens } = useContext(AuthContext);
  const { createChat, selectChat } = useChats();

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
    selectChat(chatId);
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
            <Navigate to="/login" />
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