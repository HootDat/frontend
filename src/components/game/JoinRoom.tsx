import React, { useContext } from 'react';

import ConnContext from './connection/ConnContext';
import CreatePlayer from './CreatePlayer';
import GameContext from './GameContext';
import { Mode } from './GameState';
import JoinRoomForm from './JoinRoomForm';
import { useHistory } from 'react-router-dom';
import OuterGrid from '../common/OuterGrid';

// load form if room in state is empty. otherwise load player
const JoinRoom: React.FC = () => {
  const conn = useContext(ConnContext);
  const { roomId, participants } = useContext(GameContext);

  const history = useHistory();

  const handleJoin = (roomId: string) => {
    conn.joinRoom(roomId);
    history.replace(`/?roomId=${roomId}`);
  };

  // when they are in the createPlayer page and leave,
  // they need to tell the server
  // they aren't in the room anymore, so this isn't sufficient.
  const handleBack = () => {
    conn.updateMode(Mode.HOME);
    history.replace('/');
  };

  const handleCreatePlayer = (name: string, hoot: number) => {
    // TODO: update server
    conn.createPlayer(name, hoot);
  };

  return (
    <OuterGrid>
      {roomId === null ? (
        <JoinRoomForm handleJoin={handleJoin} handleBack={handleBack} />
      ) : (
        <CreatePlayer
          handleCreate={handleCreatePlayer}
          handleBack={handleBack}
          participants={participants}
        />
      )}
    </OuterGrid>
  );
};

export default JoinRoom;
