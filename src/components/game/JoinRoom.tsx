import React, { useContext } from 'react';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import { Mode } from './GameState';
import JoinRoomForm from './JoinRoomForm';
import { useHistory, useLocation } from 'react-router-dom';
import OuterGrid from '../common/OuterGrid';

// load form if room in state is empty. otherwise load player
const JoinRoom: React.FC = () => {
  const conn = useContext(ConnContext);

  const gameCode = new URLSearchParams(useLocation().search).get('gameCode');
  const history = useHistory();

  const handleGameCode = (gameCode: string) => {
    history.replace(`/?gameCode=${gameCode}`);
  };

  const handleBack = () => {
    conn.updateMode(Mode.HOME);
    history.replace('/');
  };

  const handleJoinRoom = (name: string, iconNum: number) => {
    conn.joinRoom(gameCode!, name, iconNum);
  };

  return (
    <OuterGrid>
      {gameCode === null ? (
        <JoinRoomForm handleJoin={handleGameCode} handleBack={handleBack} />
      ) : (
        <CreatePlayer handleCreate={handleJoinRoom} handleBack={handleBack} />
      )}
    </OuterGrid>
  );
};

export default JoinRoom;
