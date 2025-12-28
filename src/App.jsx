import { useState, useRef, useEffect } from 'react';
import Opening from './components/features/Opening';
import Gallery from './components/features/Gallery';
import SecretMessage from './components/features/SecretMessage';
import TVFrame from './components/common/TVFrame';
import Navbar from './components/common/Navbar';


function App() {
  const [showOpening, setShowOpening] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'gallery', 'message'
  const audioRef = useRef(null);

  // Audio Tracks
  const AUDIO_MAIN = "https://res.cloudinary.com/ddnxfpziq/video/upload/v1766942225/The_1975_-_About_You_Official_.publer.com_p4qqoh.mp3";
  const AUDIO_MESSAGE = "https://res.cloudinary.com/demo/video/upload/v1689632836/docs/cinematic-audio-placeholder.mp3"; // Or different track

  const startExperience = () => {
    console.log("Starting experience...");
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Start at 50% volume
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio played successfully");
          })
          .catch(error => {
            console.error("Audio play failed:", error);
          });
      }
    }
  };

  const handleOpeningComplete = () => {
    setShowOpening(false);
    setCurrentView('gallery'); // Default to gallery after opening
  };

  const handleNavigate = (view) => {
    if (view === 'home') {
       // Reset to opening? Or scroll to top of gallery? Let's just scroll Gallery to top if in gallery mode
       if (currentView === 'gallery') {
          const homeEl = document.getElementById('home');
          if(homeEl) homeEl.scrollIntoView({ behavior: 'smooth'});
       } else {
          setCurrentView('gallery');
          // Wait for render then scroll
          setTimeout(() => {
             const homeEl = document.getElementById('home');
             if(homeEl) homeEl.scrollIntoView({ behavior: 'smooth'});
          }, 100);
       }
    } else {
       setCurrentView(view);
    }
  };

  // Handle Audio Switching
  useEffect(() => {
    if (audioRef.current) {
       const track = currentView === 'message' ? AUDIO_MESSAGE : AUDIO_MAIN;
       if (audioRef.current.src !== track) {
           const isPlaying = !audioRef.current.paused;
           audioRef.current.src = track;
           if (isPlaying) audioRef.current.play().catch(e => console.log(e));
       }
    }
  }, [currentView]);

  return (
    <>
      <audio 
        ref={audioRef} 
        src={AUDIO_MAIN} 
        loop 
      />
      
      <TVFrame />

      {showOpening ? (
        <Opening 
          onStart={startExperience} 
          onComplete={handleOpeningComplete} 
        />
      ) : (
        <>
            <Navbar currentView={currentView} onNavigate={handleNavigate} />
            
            <main className="w-full h-full relative">
                {currentView === 'gallery' && <Gallery />}
                {currentView === 'message' && <SecretMessage />}
            </main>
        </>
      )}
    </>
  );
}

export default App;
