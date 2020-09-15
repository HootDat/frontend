import React from 'react';
import { ChatBubbleOutline } from '@material-ui/icons';

const ChatShell: React.FC = ({ children }) => {
  return (
    <>
      <ChatBubbleOutline />
      {children}
    </>
  );
};

export default ChatShell;
