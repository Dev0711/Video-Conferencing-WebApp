import { useEffect, useRef } from 'react';

export default function MediaElement({ remoteProducerId, track, kind }) {
    const mediaRef = useRef(null);

    useEffect(() => {
      if (mediaRef.current) {
        mediaRef.current.srcObject = new MediaStream([track]);
      }
    }, [track]);
  
    return (
      <div id={`td-${remoteProducerId}`} className={kind === 'video' ? 'remoteVideo' : ''}>
        {kind === 'audio' ? (
          <audio id={remoteProducerId} ref={mediaRef} autoPlay></audio>
        ) : (
          <video id={remoteProducerId} ref={mediaRef} autoPlay></video>
        )}
      </div>
    );
}
