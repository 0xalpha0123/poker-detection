import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const Room = (props) => {
  let socket = useRef(null);
  let peer = useRef(null);
  const [peers, setPeers] = useState({});

  const ROOM_ID = props.match.params.id;
  const videoRef = useRef(null);
  const guestRefs = {};

  const connectToNewUser = (userId, stream) => {
    console.log('calling', userId, stream);
    const call = peer.current.call(userId, stream);
    call.on('stream', userVideoStream => {
      console.log(111111111111);
      addVideoStream(guestRefs[userId].current, userVideoStream);
    });
    call.on('close', () => {
      guestRefs[userId].current.remove();
    });
    call.on('error', e => console.error(e));

    setPeers({
      ...peers,
      [userId]: call,
    });
  }

  const addVideoStream = (video, stream) => {
    console.log(11111111, video);
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }

  useEffect(() => {
    socket.current = io('http://localhost:5001');
    peer.current = new Peer(undefined, {
      host: '/',
      port: '5003',
      secure: true,
    });

    navigator.mediaDevices.getDisplayMedia({
      // video: {
      //   cursor: 'always',
      // },
      video: true,
      audio: false,
    })
      .then(stream => {
        console.log('Me', peer.current.id);

        addVideoStream(videoRef.current, stream);

        peer.current.on('call', call => {
          console.log('called');
          call.answer(stream);
          call.on('stream', userVideoStream => {
            console.log('called', call.id);
            addVideoStream(guestRefs[call.id].current, userVideoStream);
          });
        });
      
        socket.current.on('user-connected', userId => {
          console.log('New user', userId);
          connectToNewUser(userId, stream);
        });
      });

    socket.current.on('user-disconnected', userId => {
      if (peers[userId]) {
        peers[userId].close();
      }
    });

    peer.current.on('open', id => {
      socket.current.emit('join-room', ROOM_ID, id);
    });
  }, []);

  return (
    <div>
      <div>Room</div>
      <video className='screen-player' ref={videoRef}></video>
      {Object.keys(peers).map((p, index) => (
        <video key={index} className='screen-player' ref={ref => guestRefs[p] = ref}></video>
      ))}
    </div>
  );
}

export default Room;
