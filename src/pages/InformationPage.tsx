import { useLiveryStore } from "@/store/liveryStore";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ReturnButton from "@/components/ReturnButton";
import styles from "@/pages/InformationPage.module.css"

const DeveloperLogo = ({ developerName }: { developerName: string }) => {
    const logoSrc = `public/${developerName}.png`;
    return <img src={logoSrc} alt={`${developerName} logo`} />;
};

export function InformationPage() {
    const { liveryId } = useParams();

    const { liveries } = useLiveryStore();

    const selectedLivery = useMemo(() => {
        return liveries.find(livery => livery.id === liveryId)
    }, [liveries, liveryId]);


    // TODO: Show the error

    if (!selectedLivery) {
        return (
            <>
                NOTHING !!!
            </>
        )
    }

    return (
        <div className="information-page">
            <div className="returnButton">
                <ReturnButton />
            </div>
            <div className={styles.headerSection}>
                <div className={styles.textContainer}>
                    <h1>{selectedLivery.name}</h1>
                    <h3>
                        {selectedLivery.aircraftProfileName} | {selectedLivery.engine} | {selectedLivery.categoryName}
                    </h3>
                </div>
                <div className={styles.devLogo}>
                    <DeveloperLogo developerName={selectedLivery.developerName} />
                </div>
            </div>
            <div className={styles.mainBody}>
                <div className={styles.realInfoBox}>
                    <dl className={styles.meta}>
                        <div>
                            <dt className={styles.metaLabel}>Registration</dt>
                            <dd className={styles.metaValue}>{selectedLivery.name ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className={styles.metaLabel}>MSN</dt>
                        </div>
                        <div>
                            <dt className={styles.metaLabel}>SELCAL</dt>
                        </div>
                        <div>
                            <dt className={styles.metaLabel}>Mode-S</dt>
                        </div>
                    </dl>
                    <dl className={styles.metaSecond}>
                        <div>
                            <dt className={styles.metaLabel}>Manufacturer</dt>
                        </div>
                        <div>
                            <dt className={styles.metaLabel}>Year Built</dt>
                            <dd className={styles.metaValue}>{selectedLivery.year ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className={styles.metaLabel}>Delivery Date</dt>
                        </div>
                        <div>
                            <dt className={styles.metaLabel}>Livery Name</dt>
                        </div>
                    </dl>
                        <dl className={styles.metaThird}>
                        <div>
                            <button className={styles.plannerButtons}>FlightRadar24</button>
                        </div>
                        <div>
                            <button className={styles.plannerButtons}>AirNavRadar</button>
                        </div>    
                    </dl>
                </div>
                <div className={styles.liveryBox}>
                    <img src={selectedLivery.preview ?? ""} alt={`${selectedLivery.name} preview`} loading="lazy" />
                </div>
                <div className={styles.changesBox}>
                    <h2>Changelog for {selectedLivery.version}</h2>
                </div>
            </div>
        </div>
    );
}