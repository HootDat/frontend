import React, { useContext } from 'react';
import CreatePlayer from './CreatePlayer';
import GameContext from './GameContext';
import { Mode } from './GameState';

const CreateRoom: React.FC = () => {
  const context = useContext(GameContext);

  const handleSubmit = (name: string, hoot: number) => {
    // TODO
    context.createRoom(name, hoot);
  };

  const handleBack = () => {
    context.updateMode(Mode.HOME);
  };

  return (
    <>
      <CreatePlayer
        handleSubmit={handleSubmit}
        handleBack={handleBack}
        participants={{}}
      />
    </>
  );
};

export default CreateRoom;
