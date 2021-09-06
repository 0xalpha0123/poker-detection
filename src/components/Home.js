import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home = (props) => {
  const [isJoinRoomDisplayed, setIsJoinRoomDisplayed] = useState(false);
  const [roomId, setRoomId] = useState('');
  const history = useHistory();
  
  const joinRoom = () => {
    history.push(`/room/${roomId}`);
  } 
  
  return (
    <div className="flex flex-col container mx-auto items-center">
      <h1 className='text-4xl my-4'>Home</h1>
      <div>
        <button className='btn-primary'>Create Room</button>
        <button className='btn-secondary' onClick={() => setIsJoinRoomDisplayed(true)}>Join Room</button>
      </div>
      {isJoinRoomDisplayed && (
        <div className='mt-7'>
          <input
            type='text'
            className='input-control'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className='btn-primary' onClick={joinRoom}>Join</button>
        </div>
      )}
    </div>
  );
}

export default Home;
