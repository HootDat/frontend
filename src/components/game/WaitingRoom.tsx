import React, { useState } from 'react';

import ChatShell from './ChatShell';
import Lobby from './Lobby';
import AddQuestions from './AddQuestions';

// Reachable from:
// Host told server to create room, and server responds with a room id.
// User joined room via roomId, and chose a character already.
// Users have finished a game and pressed play again
const WaitingRoom: React.FC = () => {
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [questions, setQuestions] = useState([] as string[]);

  const handleAddQuestionButton = () => {
    setAddingQuestion(true);
  };

  const handleAddQuestionBack = () => {
    setAddingQuestion(false);
  };

  return (
    <ChatShell>
      {addingQuestion ? (
        <AddQuestions
          roomQuestions={questions}
          setRoomQuestions={setQuestions}
          handleBack={handleAddQuestionBack}
        />
      ) : (
        <Lobby
          questions={questions}
          handleAddQuestionButton={handleAddQuestionButton}
        />
      )}
    </ChatShell>
  );
};

export default WaitingRoom;
