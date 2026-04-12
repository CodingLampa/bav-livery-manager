import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';
import {TourInitializer} from "@/tour/TourInitializer";

export const Layout = () => (
    <div className={styles.appShell}>
        <TourInitializer />
        <Sidebar />
        <main className={styles.mainContent}>
            <div className={styles.pageContainer}>
                <Outlet />
            </div>
        </main>
    </div>
);
