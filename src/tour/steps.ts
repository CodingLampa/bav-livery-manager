import { DriveStep } from "driver.js";

export const MAIN_TOUR_STEPS: DriveStep[] = [
    {
        element: "#sidebar",
        popover: {
            title: "Sidebar",
            description: "Navigate between sections",
            side: "right",
            align: "start",
        },
    }
];