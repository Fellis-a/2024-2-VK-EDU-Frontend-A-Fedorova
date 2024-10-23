import { useState, useContext } from 'react';
import styles from './App.module.scss';
import Header from './components/Header/Header';
import ChatList from './components/ChatList/ChatList';
import ChatItem from './components/ChatItem/ChatItem';
import FloatingButton from './components/FloatingButton/FloatingButton';
import { ChatContext } from './context/ChatProvider';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const App = () => {
  const { chats, createChat } = useContext(ChatContext);
  const [selectedChat, setSelectedChat] = useState(null);

  const selectChat = (chatId) => {
    const chat = chats.find((chat) => chat.chatId === chatId);
    setSelectedChat(chat);
  };

  const goBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className={styles.app}>
      {selectedChat ? (
        <Header

          leftElement={
            <button onClick={goBackToList} className={styles.backButton}>
              <ArrowBackIosNewIcon />
            </button>
          }
          centerElement={<img src={selectedChat.imageUrl} alt={selectedChat.name} className={styles.chatAvatar} />}
          title={selectedChat.name}
          rightElement={
            <div>
              <SearchIcon />
              <MoreVertIcon />
            </div>
          }
        />
      ) : (
        <div className={styles.headerMain}>
          <Header title="Чаты" />
          <SearchIcon />
        </div>
      )}

      {selectedChat ? (
        <ChatItem chat={selectedChat} goBack={goBackToList} />
      ) : (
        <>
          <ChatList chats={chats} onChatSelect={selectChat} />
          <FloatingButton addChat={createChat} />
        </>
      )}
    </div>
  );
};

export default App;
