import { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatList from './pages/PageChatList';
import ChatItem from './pages/PageChat';
import UserProfile from './pages/PageUserProfile';
import Login from './pages/PageLogin';
import Register from './pages/PageRegister';
import NotFound from './components/NotFound';
import useAuthStore from './store/authStore';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import useChatStore from './store/chatsListStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { tokens, currentUser, fetchCurrentUser, createChat } = useAuthStore();
  const { subscribeToChannel, unsubscribeFromChannel } = useChatStore();

  const refreshTokens = useCallback(() => {
    const tokens = useAuthStore.getState().tokens;

    if (tokens?.access) {
      const { exp } = JSON.parse(atob(tokens.access.split('.')[1]));
      const timeLeft = exp * 1000 - Date.now();

      if (timeLeft < 5 * 60 * 1000 && tokens?.refresh) {
        useAuthStore.getState().refreshTokens();
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshTokens, 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshTokens]);


  useEffect(() => {
    if (tokens && !currentUser) {
      fetchCurrentUser();
    }
  }, [tokens, currentUser, fetchCurrentUser]);

  useEffect(() => {
    if (tokens && currentUser?.id) {
      subscribeToChannel(currentUser.id, tokens);

      return () => {
        unsubscribeFromChannel();
      };
    }
  }, [tokens, currentUser?.id, subscribeToChannel, unsubscribeFromChannel]);

  const handleCreateChat = useCallback((chatName, chatImage) => {
    createChat(chatName, chatImage);
  }, [createChat]);

  return (
    <div className="app">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={tokens ? (
              <ChatList
                createChat={handleCreateChat}
              />
            ) : (
              <Navigate to="/login" replace />
            )}
          />
          <Route
            path="/chat/:chatId"
            element={<ChatItem />}
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
    </div>
  );
};

export default App;
