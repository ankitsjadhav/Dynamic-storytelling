import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoryNavigationProps {
    onBack: () => void;
    onForward: () => void;
    viewIndex: number;
    historyLength: number;
}

export function StoryNavigation({
    onBack,
    onForward,
    viewIndex,
    historyLength,
}: StoryNavigationProps) {
    return (
        <>
            <div className="fixed inset-y-0 left-0 z-30 flex items-center px-4 md:px-8 pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    disabled={
                        historyLength === 0 && viewIndex === -1 ? true : viewIndex === 0
                    }
                    className="pointer-events-auto h-20 w-20 rounded-full text-white/10 hover:text-white/60 hover:bg-black/10 hover:scale-110 active:scale-95 transition-all disabled:opacity-0"
                >
                    <ChevronLeft className="w-12 h-12" strokeWidth={1} />
                </Button>
            </div>

            <div className="fixed inset-y-0 right-0 z-30 flex items-center px-4 md:px-8 pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onForward}
                    disabled={viewIndex === -1}
                    className="pointer-events-auto h-20 w-20 rounded-full text-white/10 hover:text-white/60 hover:bg-black/10 hover:scale-110 active:scale-95 transition-all disabled:opacity-0"
                >
                    <ChevronRight className="w-12 h-12" strokeWidth={1} />
                </Button>
            </div>
        </>
    );
}
