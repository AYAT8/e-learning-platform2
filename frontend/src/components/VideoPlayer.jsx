import { useState, useRef } from "react";

const VideoPlayer = ({ url, title }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setFullscreen(!fullscreen);
  };

  return (
    
      <div className="relative">
        <video
          ref={videoRef}
          src={url}
          className="w-full rounded-lg"
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        
        
    
    </div>
  );
};

export default VideoPlayer;