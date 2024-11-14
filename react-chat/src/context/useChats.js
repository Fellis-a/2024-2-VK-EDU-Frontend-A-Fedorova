import { useContext } from 'react';
import { ChatContext } from './ChatProvider';

const useChats = () => useContext(ChatContext);

export default useChats;
