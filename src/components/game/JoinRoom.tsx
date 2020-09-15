import React, { useContext } from 'react';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import GameContext from './GameContext';
import { Mode } from './GameState';
import JoinRoomForm from './JoinRoomForm';
import { useHistory } from 'react-router-dom';

// load form if room in state is empty. otherwise load player
const JoinRoom: React.FC = () => {
  const conn = useContext(ConnContext);
  const { roomId, participants } = useContext(GameContext);

  const history = useHistory();

  const handleJoin = (roomId: string) => {
    conn.joinRoom(roomId);
    history.replace(`/?roomId=${roomId}`);
  };

  const handleBack = () => {
    conn.updateMode(Mode.HOME);
    history.replace('/');
  };

  const handleCreatePlayer = (name: string, hoot: number) => {
    // TODO: update server
    conn.updateMode(Mode.WAITING_ROOM);
  };

  return (
    <>
      {roomId === null ? (
        <JoinRoomForm handleSubmit={handleJoin} handleBack={handleBack} />
      ) : (
        <CreatePlayer
          handleSubmit={handleCreatePlayer}
          handleBack={handleBack}
          participants={participants}
        />
      )}
    </>
  );
};

export default JoinRoom;
