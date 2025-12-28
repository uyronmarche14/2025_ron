import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Home, MessageSquare, Images } from 'lucide-react';
import { cn } from '../../lib/utils';

// eslint-disable-next-line no-unused-vars
const NavItem = ({ icon: Icon, label, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center p-2.5 transition-all duration-300 rounded-sm hover:bg-white/10",
        isActive ? "text-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "text-white/40"
      )}
      aria-label={label}
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      
      {/* Film-style Label Tooltip */}
      <span className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black border border-white/20 text-[10px] font-mono tracking-widest text-white/80 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
      
      {/* Active Indicator Dot */}
      {isActive && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
        />
      )}
    </button>
  );
};

export default function Navbar({ currentView, onNavigate }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -30, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 mix-blend-difference"
    >
      <div className="flex items-center gap-1 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
        <NavItem 
          icon={Home} 
          label="Home" 
          onClick={() => onNavigate('home')} 
          isActive={currentView === 'home'}
        />
        
        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1" />
        
        <NavItem 
          icon={Images} 
          label="Gallery" 
          onClick={() => onNavigate('gallery')} 
          isActive={currentView === 'gallery'}
        />

        <div className="w-px h-4 bg-white/10 mx-1" />

        <NavItem 
          icon={MessageSquare} 
          label="Messages" 
          onClick={() => onNavigate('message')} 
          isActive={currentView === 'message'}
        />
      </div>
    </motion.nav>
  );
}

