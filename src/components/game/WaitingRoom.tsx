import React, { useState } from 'react';

import AddQuestions from './AddQuestions';
import Lobby from './Lobby';

// Reachable from:
// Host told server to create room, and server responds with a room id.
// User joined room via roomId, and chose a character already.
// Users have finished a game and pressed play again
const WaitingRoom: React.FC = () => {
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [questions, setQuestions] = useState([] as string[]);

  return (
    <>
      {addingQuestion ? (
        <AddQuestions
          roomQuestions={questions}
          setRoomQuestions={setQuestions}
          handleBack={() => setAddingQuestion(false)}
        />
      ) : (
        <Lobby
          questions={questions}
          handleAddQuestionButton={() => setAddingQuestion(true)}
        />
      )}
    </>
  );
};

export default WaitingRoom;
