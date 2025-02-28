import { useState, useRef } from "react";
import { CarouselApi } from "@/components/ui/carousel";

export function useSwipe(api: CarouselApi | null) {
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [isManual, setIsManual] = useState(false);
    const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetAutoScroll = () => {
        if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
        setIsManual(true);
        manualTimeoutRef.current = setTimeout(() => setIsManual(false), 5000);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        resetAutoScroll();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX || !api) return;

        const swipeDistance = touchStartX - touchEndX;
        if (swipeDistance > 100) {
            api.scrollNext();
        } else if (swipeDistance < -100) {
            api.scrollPrev();
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };

    return { handleTouchStart, handleTouchMove, handleTouchEnd, isManual };
}