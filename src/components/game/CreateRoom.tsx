import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import { Mode } from './GameState';

const CreateRoom: React.FC = () => {
  const conn = useContext(ConnContext);

  const history = useHistory();

  const handleSubmit = (name: string, hoot: number) => {
    // TODO
    const roomId = conn.createRoom(name, hoot);
    history.replace(`/?roomId=${roomId}`);
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
