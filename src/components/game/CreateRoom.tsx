import React, { useContext } from 'react';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import { Mode } from './GameState';

const CreateRoom: React.FC = () => {
  const conn = useContext(ConnContext);

  const handleSubmit = (name: string, hoot: number) => {
    // TODO
    conn.createRoom(name, hoot);
  };

  const handleBack = () => {
    conn.updateMode(Mode.HOME);
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
