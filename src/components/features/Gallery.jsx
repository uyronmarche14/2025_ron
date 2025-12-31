import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Calendar, ChevronDown } from 'lucide-react';
import FilmGrain from '../common/FilmGrain';
import storyData from '../../data/story.json';
import { getImageUrl } from '../../lib/cloudinary';

const AmbientFloatingImages = () => {
  const [activeImages, setActiveImages] = useState([]);

  useEffect(() => {
    // Try to add a new random image every second
    const interval = setInterval(() => {
      setActiveImages(prev => {
        // Keep max 3-4 images at once to avoid clutter
        if (prev.length > 3) {
             return prev.slice(1);
        }
        
        const randomItem = storyData[Math.floor(Math.random() * storyData.length)];
        const newImage = {
            id: Date.now(), // timestamp as unique key for this instance
            src: randomItem.imageId,
            top: Math.random() * 80 + 10, // 10% to 90%
            left: Math.random() * 80 + 10,
            scale: Math.random() * 0.3 + 0.5,
            rotation: Math.random() * 20 - 10,
        };
        return [...prev, newImage];
      });
    }, 1500); // Add new one every 1.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {activeImages.map((img) => (
        <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.5, filter: "blur(5px)" }}
            animate={{ opacity: 0.4, scale: img.scale, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(5px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute shadow-2xl rounded-lg overflow-hidden border border-white/10"
            style={{
                top: `${img.top}%`,
                left: `${img.left}%`,
                width: '180px',
                height: '120px',
                rotate: img.rotation,
                zIndex: 0
            }}
        >
             <img src={img.src} alt="" className="w-full h-full object-cover grayscale opacity-70" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.2, 0.65, 0.3, 0.9],
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

// TV Channel Switch / Carousel Effect
const TVCarousel = ({ images }) => {
    // Ensure images is an array
    const slides = Array.isArray(images) ? images : [images];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStatic, setIsStatic] = useState(false);

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            // Trigger Static
            setIsStatic(true);
            
            // Switch Slide slightly after static starts
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % slides.length);
            }, 100);

            // Remove Static
            setTimeout(() => {
                setIsStatic(false);
            }, 300);

        }, 5000); // Switch every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    const currentSrc = slides[currentIndex];
    
    // Check if it's a Cloudinary public ID or full URL
    const isPlaceholder = !currentSrc.startsWith('http') && currentSrc.includes('-'); 
    const finalSrc = isPlaceholder 
      ? `https://source.unsplash.com/random/1920x1080?cinematic,${currentSrc}`
      : getImageUrl(currentSrc, { width: 1920, height: 1080 });

    return (
        <div className="absolute inset-0 z-0">
             {/* Main Image */}
             <motion.div 
                key={currentIndex}
                className="w-full h-full"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
            >
                <img 
                    src={finalSrc} 
                    alt="Story"
                    className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
            </motion.div>

            {/* TV Static Overlay for Transitions */}
            <AnimatePresence>
                {isStatic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-cover pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')" }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};


const StoryCard = ({ item }) => {
  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden snap-start pointer-events-none">
      
      {/* Background with Carousel Effect */}
      <TVCarousel images={item.images || item.imageId} /> 

      {/* Content Overlay - Always Left Aligned */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 items-start transition-all">
        
        {/* Subtle Gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent -z-10" />

        <div className="relative pointer-events-auto max-w-5xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 text-left"
          >
            <motion.h2 variants={textVariants} className="font-display text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-xl tracking-tighter">
              {item.title}
            </motion.h2>

            <motion.div variants={textVariants} className="max-w-3xl relative">
                <p className="font-sans text-xl md:text-2xl text-gray-100 font-medium drop-shadow-lg leading-relaxed">
                  {item.description}
                </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ChapterIndicators = ({ total, current }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 mix-blend-difference hidden md:flex">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            height: current === i ? 32 : 8,
            opacity: current === i ? 1 : 0.5,
            scale: current === i ? 1 : 0.8
          }}
          className="w-1 bg-white rounded-full transition-all duration-500"
        />
      ))}
    </div>
  );
};

export default function Gallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [currentChapter, setCurrentChapter] = useState(0);

  // Update chapter based on container scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const vh = container.clientHeight;
      const scrollPos = container.scrollTop;
      // Add a small offset (vh * 0.5) to change chapter when half of the next section is visible
      const index = Math.floor((scrollPos + vh * 0.5) / vh) - 1; // -1 because first section is Hero
      
      if (index >= 0 && index < storyData.length) {
        setCurrentChapter(index);
      } else if (index < 0) {
        setCurrentChapter(-1); // Hero
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-cinema-black text-cinema-accent h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth w-full">
      <FilmGrain />
      <ChapterIndicators total={storyData.length} current={currentChapter} />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      {/* Hero Section of Gallery */}
      <section id="home" className="h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden snap-start bg-black">
        {/* TV Static Effect */}
        <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-screen overflow-hidden">
             <div className="w-[200%] h-[200%] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')] animate-static -ml-[50%] -mt-[50%]" />
        </div>
        
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black" />

        {/* Floating Ambient Images */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AmbientFloatingImages />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 px-4"
        >
          <h1 className="font-display text-8xl md:text-9xl font-bold mb-4 tracking-tighter animate-flicker text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            2025
          </h1>
          <p id="message" className="font-sans text-xl md:text-2xl text-gray-400 font-light tracking-wide scroll-mt-32">
            A Cinematic Journey
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 z-10"
        >
          <ChevronDown className="w-8 h-8 text-gray-500" />
        </motion.div>
      </section>

      {/* Story Cards */}
      <div id="gallery" className="w-full">
        {storyData.map((item, index) => (
          <StoryCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Footer / Final Chapter */}
      <footer className="h-[100dvh] flex items-center justify-center bg-black text-white relative snap-start overflow-hidden">
        {/* Background Carousel of All Images */}
        <TVCarousel images={storyData.map(s => s.imageId)} />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/80 z-10" />

        <div className="text-center px-4 z-20 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="space-y-8"
          >
             <h2 className="font-display text-6xl md:text-9xl mb-6 tracking-tighter text-white/90">2026?</h2>
             
             {/* Poem Section */}
             <div className="font-serif text-xl md:text-3xl text-gray-300 leading-loose italic tracking-wide space-y-2">
                <p>

                “It doesn’t matter if we’re wrong…because every time we go wrong, we’ll continue to look for the right answer.” – Hachiman Hikigaya</p>
            
             </div>

             <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1.5 }}
                className="pt-12"
             >
                <p className="font-sans text-sm text-gray-500 tracking-[0.3em] uppercase">See you in the next chapter</p>
             </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
