import { useTourStore } from "@/store/tourStore";
import { MAIN_TOUR_STEPS } from "@/tour/steps";
import styles from "./TourWelcomeModal.module.css";

export function TourWelcomeModal() {
    const isWelcomeOpen = useTourStore((s) => s.isWelcomeOpen);
    const acceptTour    = useTourStore((s) => s.acceptTour);
    const declineTour   = useTourStore((s) => s.declineTour);

    if (!isWelcomeOpen) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <img
                    src="/tour/welcome-banner.gif"
                    alt="Welcome"
                    className={styles.banner}
                />

                <div className={styles.content}>
                    <h2 className={styles.title}>Welcome! 👋</h2>

                    <p className={styles.description}>
                        Looks like it's your first time here. Would you like a quick tour
                        to get familiar with the app?
                    </p>

                    <div className={styles.actions}>
                        <button className={styles.btnSecondary} onClick={declineTour}>
                            Skip for now
                        </button>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => acceptTour(MAIN_TOUR_STEPS)}
                        >
                            Show me around →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}