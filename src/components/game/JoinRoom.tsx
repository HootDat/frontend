import React, { useContext } from 'react';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import GameContext from './GameContext';
import { Mode } from './GameState';
import JoinRoomForm from './JoinRoomForm';

// load form if room in state is empty. otherwise load player
const JoinRoom: React.FC = () => {
  const conn = useContext(ConnContext);
  const { roomId, participants } = useContext(GameContext);

  const handleJoin = (roomId: string) => {
    conn.joinRoom(roomId);
  };

  const handleBack = () => {
    conn.updateMode(Mode.HOME);
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
