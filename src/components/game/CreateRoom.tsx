import React, { useContext } from 'react';
import CreatePlayer from './CreatePlayer';
import GameContext from './GameContext';

const CreateRoom: React.FC = () => {
  const context = useContext(GameContext);

  const handleSubmit = (name: string, hoot: number) => {
    // TODO
    context.createRoom(name, hoot);
  };

  return (
    <>
      <CreatePlayer handleSubmit={handleSubmit} participants={{}} />
    </>
  );
};

export default CreateRoom;
