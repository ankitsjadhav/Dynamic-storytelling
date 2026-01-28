import { useState, useEffect, useRef } from "react";

export function TypewriterEffect({
    text,
    speed = 25,
    shouldAnimate = true,
    onComplete,
}: {
    text: string;
    speed?: number;
    shouldAnimate?: boolean;
    onComplete?: () => void;
}) {
    const [displayedText, setDisplayedText] = useState(shouldAnimate ? "" : text);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        if (!shouldAnimate || !text) {
            setDisplayedText(text || "");
            if (!hasCompletedRef.current && onComplete) {
                hasCompletedRef.current = true;
                onComplete();
            }
            return;
        }

        setDisplayedText("");
        hasCompletedRef.current = false;

        const words = text.split(/(\s+)/);

        let i = 0;
        const timer = setInterval(() => {
            if (i < words.length) {
                const nextWord = words[i];
                if (nextWord !== undefined && nextWord !== null) {
                    setDisplayedText((prev) => prev + nextWord);
                }
                i++;
            } else {
                clearInterval(timer);
                if (!hasCompletedRef.current && onComplete) {
                    hasCompletedRef.current = true;
                    onComplete();
                }
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed, shouldAnimate, onComplete]);

    return (
        <span className="font-serif leading-relaxed text-lg md:text-[20px] text-gray-800 tracking-wide">
            {displayedText}
        </span>
    );
}
