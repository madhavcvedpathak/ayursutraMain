import { useState } from 'react';
import { MessageCircle, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    // Construct URL with User Context
    const botUrl = `https://ayursutrabot.netlify.app${currentUser ? `?uid=${currentUser.uid}&email=${encodeURIComponent(currentUser.email || '')}` : ''}`;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            width: isExpanded ? '400px' : '350px',
                            height: isExpanded ? '600px' : '500px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-brand-ocean px-4 py-3 text-white">
                            <div className="flex items-center gap-2">
                                <div className="relative h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </div>
                                <span className="font-medium">Ayursutra Assistant</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsExpanded(!isExpanded)} className="opacity-80 hover:opacity-100">
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="opacity-80 hover:opacity-100">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Iframe */}
                        <iframe
                            src={botUrl}
                            className="h-full w-full border-0 bg-gray-50"
                            title="Ayursutra Bot"
                            allow="microphone" // Allow voice input if bot supports it
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-colors ${isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-brand-ocean hover:bg-brand-deep'}`}
            >
                {isOpen ? <X size={24} /> : (
                    <>
                        <MessageCircle size={28} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        </span>
                    </>
                )}
            </motion.button>
        </>
    );
};
