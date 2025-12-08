import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Chatbot = () => {
    return (
        <motion.a
            href="https://ayursutrabot.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-ocean text-white shadow-xl hover:shadow-2xl transition-shadow"
            title="Chat with Ayursutra Bot"
        >
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
        </motion.a>
    );
};
