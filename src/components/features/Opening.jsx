import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Play } from 'lucide-react';
import FilmGrain from '../common/FilmGrain';
import storyData from '../../data/story.json';

export default function Opening({ onStart, onComplete }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, ready, countdown, explosion, reveal, zooming
  const [countdownVal, setCountdownVal] = useState(3);

  // Generate random positions for the explosion images
  // We duplicate storyData to have "many" pictures
  const explosionImages = useMemo(() => {
    const combined = [...storyData, ...storyData, ...storyData]; // 3x the images
    return combined.map((item, i) => ({
        ...item,
        uniqueId: `exp-${i}`,
        top: Math.random() * 80 + 10, // Avoid extreme edges
        left: Math.random() * 80 + 10,
        rotation: Math.random() * 30 - 15,
        scale: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        // Spread delays over the entire sequence (Countdown 3s + Reveal 1s + Zoom 1.5s = ~5.5s)
        delay: Math.random() * 5.0, 
    }));
  }, []);

  // Loading Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase('ready');
          return 100;
        }
        return prev + 1;
      });
    }, 30); // ~3 seconds load time

    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setPhase('countdown'); // Images start appearing here
    onStart(); // Trigger audio start
    
    // Countdown Logic
    let currentCount = 3;
    const countTimer = setInterval(() => {
        currentCount--;
        if (currentCount > 0) {
            setCountdownVal(currentCount);
        } else {
            clearInterval(countTimer);
            
            // Countdown finished, go to Reveal
            setPhase('reveal');
            
            // Hold Reveal then Zoom
            setTimeout(() => {
                setPhase('zooming');
                
                // End after zoom
                setTimeout(() => {
                    onComplete();
                }, 1500); // Zoom duration
            }, 1000); // Reveal hold time
        }
    }, 1000);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden cursor-pointer"
        exit={{ opacity: 0 }}
      >
        <FilmGrain />
        <div className="absolute inset-0 z-40 tv-overlay opacity-30 pointer-events-none" />
        <div className="absolute inset-0 z-40 bg-[radial-gradient(circle,transparent_60%,black_100%)] pointer-events-none" />

        {/* Phase: Loading & Ready */}
        {(phase === 'loading' || phase === 'ready') && (
          <motion.div 
            key="loader"
            exit={{ opacity: 0, scale: 0.9 }}
            className="z-50 flex flex-col items-center gap-8"
            onClick={phase === 'ready' ? handleStart : undefined}
          >
             {phase === 'loading' ? (
                <motion.div className="flex flex-col items-center">
                   <span className="font-mono text-sm tracking-widest text-gray-500 mb-2 animate-pulse">
                     INITIALIZING SYSTEM...
                   </span>
                   <h1 className="font-display text-9xl font-bold tracking-tighter animate-flicker">
                     {count}%
                   </h1>
                </motion.div>
             ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="p-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md group-hover:bg-white/10 transition-colors">
                     <Play className="w-8 h-8 fill-white" />
                  </div>
                  <span className="tracking-[0.5em] font-light text-sm text-gray-400 group-hover:text-white transition-colors">CLICK TO START</span>
                </motion.div>
             )}
          </motion.div>
        )}

        {/* Phase: Countdown & Images */}
        {(phase === 'countdown' || phase === 'reveal' || phase === 'zooming') && (
            <>
             {/* Countdown Numbers */}
             {phase === 'countdown' && (
                 <motion.div
                    key="countdown"
                    className="z-50 relative"
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                 >
                    <div className="font-display text-[20rem] font-bold leading-none tracking-tighter flex items-center justify-center h-screen w-screen mix-blend-exclusion text-white">
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={countdownVal}
                                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {countdownVal}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                 </motion.div>
             )}

             {/* Images appearing during countdown and continuing until end */}
            <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
                <AnimatePresence>
                    {explosionImages.map((img) => (
                        <motion.div
                            key={img.uniqueId}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: img.scale }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ 
                                duration: 0.8, 
                                delay: img.delay,
                                ease: "easeInOut"
                            }}
                            className="absolute rounded-lg overflow-hidden border border-white/20 shadow-2xl"
                            style={{
                                top: `${img.top}%`,
                                left: `${img.left}%`,
                                width: '200px',
                                height: '140px',
                                rotate: img.rotation
                            }}
                        >
                            <img 
                                src={img.imageId} 
                                alt="Memory" 
                                className="w-full h-full object-cover shadow-lg"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            </>
        )}

        {/* Phase: Reveal & Zooming */}
        {(phase === 'reveal' || phase === 'zooming') && (
            <motion.div
                key="reveal"
                className="z-50 text-center flex flex-col items-center justify-center h-screen w-screen absolute inset-0"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                    animate={
                        phase === 'zooming' 
                        ? { scale: 50, opacity: 0 } 
                        : { scale: 1, opacity: 1, filter: "blur(0px)" }
                    }
                    transition={
                        phase === 'zooming'
                        ? { duration: 2, ease: "easeInOut" } // Smoother, slightly slower zoom
                        : { duration: 1.5, ease: "easeOut" }
                    }
                    className="flex flex-col items-center"
                >
                    <h1 className="font-display text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-white mix-blend-difference">
                        2025
                    </h1>
                </motion.div>
                
                {/* Message - Fades out during zoom */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        phase === 'zooming'
                        ? { opacity: 0 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{ delay: 0.5, duration: 1 }}
                    className="font-serif text-xl md:text-2xl text-gray-300 italic mt-8"
                >
                    Thank you for being part of my story.
                </motion.p>
            </motion.div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
