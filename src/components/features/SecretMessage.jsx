import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Lock, Unlock, User, Key, ChevronRight, LogOut, Image as ImageIcon } from 'lucide-react';
import messagesData from '../../data/messages.json';

export default function SecretMessage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = messagesData.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setError(false);
      setUsername('');
      setPassword('');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!currentUser ? (
           <motion.div 
             key="login"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
             className="w-full max-w-md"
           >
             <form onSubmit={handleLogin} className="flex flex-col gap-6 p-8 border border-white/10 bg-black/50 backdrop-blur-sm relative transition-colors hover:border-white/20">
               {/* Corner Accents */}
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50" />
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50" />
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />

               <div className="text-center mb-4">
                 <Lock className="w-8 h-8 text-white/50 mx-auto mb-2" />
                 <h2 className="font-mono text-xs tracking-[0.3em] text-white/70 uppercase">Restricted Access</h2>
                 <h1 className="font-display text-3xl font-bold text-white mt-2">Identify Yourself</h1>
               </div>

               <div className="space-y-4">
                 <div className="relative group">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                   <input
                     type="text"
                     placeholder="IDENTITY"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 px-10 py-3 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-white/40 transition-colors uppercase placeholder:text-white/20"
                   />
                 </div>

                 <div className="relative group">
                   <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                   <input
                     type="password"
                     placeholder="ACCESS CODE"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 px-10 py-3 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
                   />
                 </div>
               </div>

               {error && (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-red-500 font-mono text-xs text-center tracking-widest"
                 >
                   ACCESS DENIED. INVALID CREDENTIALS.
                 </motion.p>
               )}

               <button 
                 type="submit"
                 className="mt-4 bg-white text-black font-mono text-xs font-bold tracking-widest py-3 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
               >
                 AUTHENTICATE <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </button>
             </form>
           </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl h-full flex flex-col pt-12 pb-12 overflow-y-auto scrollbar-hide px-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-white/70" />
                 </div>
                 <div>
                    <h2 className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Welcome Back</h2>
                    <h1 className="font-display text-2xl text-white">{currentUser.name}</h1>
                 </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 transition-colors text-white/50 hover:text-white text-xs font-mono tracking-widest uppercase">
                 <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>

            {/* Message Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                     <Unlock className="w-4 h-4 text-emerald-500" />
                     <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">Decrypted Message </span>
                  </div>
                  
                  {/* Title Added */}
                  <h3 className="font-display text-3xl md:text-5xl text-white font-bold leading-tight">
                    {currentUser.title}
                  </h3>

                  {/* Description Smaller */}
                  <p className="font-serif text-lg md:text-xl text-gray-300 leading-relaxed italic border-l-2 border-white/20 pl-6 py-2">
                    "{currentUser.message}"
                  </p>
               </div>

               {/* Photo Grid */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                     <ImageIcon className="w-4 h-4 text-white/50" />
                     <span className="font-mono text-xs text-white/50 tracking-widest uppercase">Attached Evidence ({currentUser.images?.length || 0})</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     {currentUser.images && currentUser.images.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="aspect-[4/5] bg-zinc-900 border border-white/10 overflow-hidden relative group"
                        >
                           <img 
                              src={img} 
                              alt={`Memory ${idx + 1}`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
