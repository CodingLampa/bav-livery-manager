import { useEffect } from "react";
import { useTourStore } from "@/store/tourStore";
import { TourWelcomeModal } from "@/tour/TourWelcomeModal";

export function TourInitializer() {
    const hasSeenTour = useTourStore((s) => s.hasSeenTour);
    const openWelcome = useTourStore((s) => s.openWelcome);
    const stopTour    = useTourStore((s) => s.stopTour);

    useEffect(() => {
        if (!hasSeenTour) {
            const timer = setTimeout(() => openWelcome(), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        return () => stopTour();
    }, []);

    return <TourWelcomeModal />;
}