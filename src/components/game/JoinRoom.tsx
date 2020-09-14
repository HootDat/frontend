import React, { useContext } from 'react';
import GameContext from './GameContext';
import { Mode } from './GameState';
import JoinRoomForm from './JoinRoomForm';
import CreatePlayer from './CreatePlayer';

// load form if room in state is empty. otherwise load player
const JoinRoom: React.FC<{
  roomId: string | null;
  participants: { [key: string]: [string, number] };
}> = ({ roomId, participants }) => {
  const context = useContext(GameContext);

  const handleJoin = (roomId: string) => {
    context.joinRoom(roomId);
  };

  const handleBack = () => {
    context.updateMode(Mode.HOME);
  };

  const handleCreatePlayer = (name: string, hoot: number) => {
    // TODO: update server
    context.updateMode(Mode.WAITING_ROOM);
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
