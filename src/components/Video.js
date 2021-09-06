import React, { useEffect, useRef } from 'react';

const Video = (props) => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.srcObject = props.stream;
  });

  return (
    <video
      autoPlay
      className='screen-player'
      ref={videoRef}
    ></video>
  );
}

export default Video;