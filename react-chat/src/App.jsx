import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatList from './pages/PageChatList';
import ChatItem from './pages/PageChat';
import UserProfile from './pages/PageUserProfile';
import Login from './pages/PageLogin';
import Register from './pages/PageRegister';
import NotFound from './components/NotFound';
import useAuthStore from './store/authStore';
import PrivateRoute from './components/PrivateRoute';

import useChatStore from './store/chatsListStore';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { tokens, currentUser, } = useAuthStore();
  console.log('Tokens in appjs:', tokens);
  const { subscribeToChannel, unsubscribeFromChannel } = useChatStore();
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const tokens = useAuthStore.getState().tokens;

      if (tokens?.access) {
        const { exp } = JSON.parse(atob(tokens.access.split('.')[1]));
        const timeLeft = exp * 1000 - Date.now();

        if (timeLeft < 5 * 60 * 1000 && tokens?.refresh) {
          useAuthStore.getState().refreshTokens();
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);


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
  }, [tokens, currentUser?.id]);


  return (
    <div className="app">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={tokens ? (
              <ChatList
              />
            ) : (
              <Navigate to="/login" replace />
            )}
          />
          <Route
            path="/chat/:chatId"
            element={<ChatItem />}
            loader={({ params }) => {
              const { chatId } = params;
              const { fetchMessages } = useChatStore.getState();
              const tokens = useAuthStore.getState().tokens;
              return fetchMessages(chatId, tokens.access);
            }}
          />

          <Route path="/profile" element={<UserProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
    </div>

  );
};

export default App;