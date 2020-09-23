import React, { useContext } from 'react';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import { Mode } from './GameState';
import OuterGrid from '../common/OuterGrid';

const CreateRoom: React.FC = () => {
  const conn = useContext(ConnContext);

  const handleSubmit = (name: string, hoot: number) => {
    conn.createRoom(name, hoot);
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
