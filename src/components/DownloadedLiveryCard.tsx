import { useState } from 'react';
import type { InstalledLiveryRecord } from '@/types/electron-api';
import type { Livery, LiveryUpdate } from '@/types/livery';
import styles from './DownloadedLiveryCard.module.css';

interface DownloadedLiveryCardProps {
    entry: InstalledLiveryRecord & LiveryUpdate;
    liveryMatch?: Livery;
    update?: LiveryUpdate;
    onUninstall: (entry: InstalledLiveryRecord) => Promise<void>;
    onUpdate?: (update: LiveryUpdate) => Promise<void>;
}

const classNames = (...tokens: Array<string | false | undefined>) => tokens.filter(Boolean).join(' ');

const UninstallIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const UpdateIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
    </svg>
);

export const DownloadedLiveryCard = ({ entry, liveryMatch, update, onUninstall, onUpdate }: DownloadedLiveryCardProps) => {
    const [busy, setBusy] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleUninstall = async () => {
        setBusy(true);
        try {
            await onUninstall(entry);
        } finally {
            setBusy(false);
        }
    };

    const handleUpdate = async () => {
        if (!update || !onUpdate) return;
        setUpdating(true);
        try {
            await onUpdate(update);
        } finally {
            setUpdating(false);
        }
    };

    const preview = liveryMatch?.preview;
    const aircraftTitle = liveryMatch?.aircraftProfileName ?? 'Unknown aircraft';
    const developer = liveryMatch?.developerName ?? 'Unknown developer';
    const simulatorLabel = (entry.simulator ?? 'Unknown').toUpperCase();
    const engineType = liveryMatch?.engine ?? '';
    const category = liveryMatch?.categoryName ?? '';

    const formatInstallDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const hasUpdate = Boolean(update);
    const disabled = busy || updating;

    return (
        <article className={styles.card} aria-label={`${entry.originalName ?? entry.liveryName ?? 'Livery'} update`}>
            <div className={styles.imageContainer}>
                <span className={styles.simulatorBadge}>{simulatorLabel}</span>
                {hasUpdate && <span className={styles.updateBadge}>Update</span>}

                {preview ? (
                    <img className={styles.image} src={preview} alt={`${entry.originalName} preview`} loading="lazy" />
                ) : (
                    <div className={styles.placeholder}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>No preview</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.titleRow}>
                    <div>
                        <p className={styles.developer}>{developer}</p>
                        <h3 className={styles.title}>{entry.originalName ?? entry.liveryName}</h3>
                    </div>
                </div>

                <dl className={styles.meta}>
                    <div>
                        <dt className={styles.metaLabel}>Aircraft</dt>
                        <dd className={styles.metaValue}>{aircraftTitle}</dd>
                    </div>
                    <div>
                        <dt className={styles.metaLabel}>Resolution</dt>
                        <dd className={styles.metaValue}>{entry.resolution ?? '—'}</dd>
                    </div>
                    <div>
                        <dt className={styles.metaLabel}>Installed</dt>
                        <dd className={styles.metaValue}>{entry.installDate ? formatInstallDate(entry.installDate) : '—'}</dd>
                    </div>
                    {engineType && (
                        <div>
                            <dt className={styles.metaLabel}>Engine</dt>
                            <dd className={styles.metaValue}>{engineType}</dd>
                        </div>
                    )}
                    {category && (
                        <div>
                            <dt className={styles.metaLabel}>Category</dt>
                            <dd className={styles.metaValue}>{category}</dd>
                        </div>
                    )}
                </dl>

                {hasUpdate && update && (
                    <div className={styles.updateInfo}>
                        <div className={styles.updateVersions}>
                            <span className={styles.versionOld}>v{update.currentVersion}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                            <span className={styles.versionNew}>v{update.latestVersion}</span>
                        </div>
                        {update.changelog && (
                            <p className={styles.changelog}>{update.changelog}</p>
                        )}
                    </div>
                )}

                <div className={styles.actions}>
                    {hasUpdate && (
                        <button
                            className={classNames(styles.updateButton, updating && styles.updateButtonBusy)}
                            onClick={handleUpdate}
                            disabled={disabled}
                            aria-label={`Update ${entry.originalName}`}
                        >
                            <UpdateIcon />
                            {updating ? 'Updating…' : 'Update'}
                        </button>
                    )}
                    <button
                        className={classNames(styles.uninstallButton, busy && styles.uninstallButtonBusy)}
                        onClick={handleUninstall}
                        disabled={disabled}
                        aria-label={`Uninstall ${entry.originalName}`}
                    >
                        <UninstallIcon />
                        {busy ? 'Removing…' : 'Uninstall'}
                    </button>
                </div>
            </div>
        </article>
    );
};
