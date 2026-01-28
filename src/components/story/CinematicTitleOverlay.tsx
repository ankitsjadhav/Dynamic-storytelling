import { motion, AnimatePresence } from "framer-motion";

interface CinematicTitleOverlayProps {
    isVisible: boolean;
    title: string;
}

export function CinematicTitleOverlay({
    isVisible,
    title,
}: CinematicTitleOverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-white"
                >
                    <motion.h1
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                        className="text-3xl md:text-5xl font-serif tracking-widest text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 drop-shadow-lg pb-2"
                    >
                        {title}
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60px" }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-0.5 bg-indigo-500 mt-6 rounded-full"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
