import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import { Mode } from './GameState';
import OuterGrid from '../common/OuterGrid';

const CreateRoom: React.FC = () => {
  const conn = useContext(ConnContext);

  const history = useHistory();

  const handleSubmit = (name: string, hoot: number) => {
    // TODO
    const gameCode = conn.createRoom(name, hoot);
    history.replace(`/?gameCode=${gameCode}`);
  };

  const handleBack = () => {
    conn.updateMode(Mode.HOME);
  };

  return (
    <OuterGrid>
      <CreatePlayer handleCreate={handleSubmit} handleBack={handleBack} />
    </OuterGrid>
  );
};

export default CreateRoom;
