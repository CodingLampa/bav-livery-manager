import { create } from "zustand";
import { persist } from "zustand/middleware";
import { driver, DriveStep, Driver } from "driver.js";
import "driver.js/dist/driver.css";

let driverInstance: Driver | null = null;

interface TourState {
    hasSeenTour: boolean;
    isActive: boolean;
    isWelcomeOpen: boolean;
    currentStep: number;
    totalSteps: number;
}

interface TourActions {
    openWelcome: () => void;
    acceptTour: (steps: DriveStep[]) => void;
    declineTour: () => void;
    startTour: (steps: DriveStep[]) => void;
    stopTour: () => void;
    resetTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    moveTo: (index: number) => void;
    _syncStep: (index: number) => void;
    _onTourEnd: () => void;
}

export const useTourStore = create<TourState & TourActions>()(
    persist(
        (set, get) => ({
            hasSeenTour: false,
            isActive: false,
            isWelcomeOpen: false,
            currentStep: 0,
            totalSteps: 0,

            openWelcome: () => set({ isWelcomeOpen: true }),

            acceptTour: (steps) => {
                set({ isWelcomeOpen: false, hasSeenTour: true });
                setTimeout(() => get().startTour(steps), 400);
            },

            declineTour: () => {
                set({ isWelcomeOpen: false, hasSeenTour: true });
            },

            startTour: (steps) => {
                driverInstance?.destroy();

                driverInstance = driver({
                    showProgress: true,
                    allowClose: true,
                    steps,
                    onDestroyStarted: () => {
                        const instance = driverInstance;
                        get()._onTourEnd();
                        instance?.destroy();
                    },
                    onNextClick: () => {
                        driverInstance?.moveNext();
                        get()._syncStep(driverInstance?.getActiveIndex() ?? 0);
                    },
                    onPrevClick: () => {
                        driverInstance?.movePrevious();
                        get()._syncStep(driverInstance?.getActiveIndex() ?? 0);
                    },
                    onHighlightStarted: (_el, _step, opts) => {
                        get()._syncStep(opts.state.activeIndex ?? 0);
                    },
                });

                set({ isActive: true, currentStep: 0, totalSteps: steps.length });
                driverInstance.drive();
            },

            stopTour: () => {
                driverInstance?.destroy();
                driverInstance = null;
                set({ isActive: false, currentStep: 0 });
            },

            resetTour: () => {
                driverInstance?.destroy();
                driverInstance = null;
                set({ hasSeenTour: false, isActive: false, currentStep: 0 });
            },

            nextStep: () => {
                driverInstance?.moveNext();
                get()._syncStep(driverInstance?.getActiveIndex() ?? 0);
            },

            prevStep: () => {
                driverInstance?.movePrevious();
                get()._syncStep(driverInstance?.getActiveIndex() ?? 0);
            },

            moveTo: (index) => {
                driverInstance?.drive(index);
                get()._syncStep(index);
            },

            _syncStep: (index) => set({ currentStep: index }),

            _onTourEnd: () => {
                driverInstance = null;
                set({ isActive: false, currentStep: 0 });
            },
        }),
        {
            name: "tour-storage",
            partialize: (state) => ({ hasSeenTour: state.hasSeenTour }),
        }
    )
);