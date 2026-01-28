import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface StoryLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function StoryLoadingOverlay({
  isVisible,
  message = "The next chapter forms...",
}: StoryLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 h-full flex flex-col items-center justify-center z-50 pointer-events-none space-y-6"
        >
          <Sparkles className="w-8 h-8 text-indigo-300 animate-spin" />
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold animate-pulse">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
