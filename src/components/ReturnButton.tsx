import { useNavigate } from "react-router-dom";
import styles from './ReturnButton.module.css';
import { ArrowLeft } from 'react-feather';


export const ReturnButton = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button className={styles.returnButton} onClick={() => navigate(-1)}>
                <ArrowLeft width={17} height={17} />
                Go Back
            </button>
        </div>
    );
}
