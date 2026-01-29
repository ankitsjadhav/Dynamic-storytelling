import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryHUDProps {
  viewIndex: number;
  historyLength: number;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  onExit: () => void;
  onBack?: () => void;
  onForward?: () => void;
}

export function StoryHUD({
  viewIndex,
  historyLength,
  isSpeaking,
  onToggleSpeech,
  onExit,
  onBack,
  onForward,
}: StoryHUDProps) {
  const canGoBack =
    !(historyLength === 0 && viewIndex === -1) && viewIndex !== 0;
  const canGoForward = viewIndex !== -1;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 pointer-events-none transition-opacity duration-500">
      <div className="pointer-events-auto flex items-center bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-lg overflow-hidden">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="md:hidden p-3 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors border-r border-white/5"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold px-4 py-2 select-none">
          SCENE {viewIndex === -1 ? historyLength + 1 : viewIndex + 1}
        </span>

        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="md:hidden p-3 hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors border-l border-white/5"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="pointer-events-auto flex gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSpeech}
          className={cn(
            "rounded-full bg-black/20 text-white/70 border border-white/5 hover:bg-black/40 hover:text-white transition-all",
            isSpeaking && "text-indigo-400 animate-pulse",
          )}
        >
          {isSpeaking ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="md:hidden rounded-full bg-white/10 text-white/80 border border-white/5 hover:bg-red-500/20 hover:text-white transition-all shadow-lg"
        >
          <LogOut className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          onClick={onExit}
          className="hidden md:flex rounded-full bg-white/10 text-white/80 border border-white/5 hover:bg-red-500/20 hover:text-white transition-all text-xs font-medium uppercase px-4 shadow-lg"
        >
          Exit
        </Button>
      </div>
    </header>
  );
}
