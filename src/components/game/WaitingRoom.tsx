import React, { useState, useContext } from 'react';

import AddQuestions from './AddQuestions';
import Lobby from './Lobby';
import GameContext from './GameContext';

// Reachable from:
// Host told server to create room, and server responds with a room id.
// User joined room via gameCode, and chose a character already.
// Users have finished a game and pressed play again
const WaitingRoom: React.FC = () => {
  const [addingQuestion, setAddingQuestion] = useState(false);

  const { state } = useContext(GameContext);
  const { questions: existingQuestions } = state!;
  const [questions, setQuestions] = useState(existingQuestions);

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
