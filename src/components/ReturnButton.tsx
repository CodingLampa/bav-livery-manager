import { useNavigate } from "react-router-dom";
import styles from './ReturnButton.module.css';
import { ArrowLeftCircle } from 'react-feather';


function returnButton() {
    const navigate = useNavigate();

    return (
        <div>
            <button className={styles.returnButton} onClick={() => navigate(-1)}>
                <ArrowLeftCircle width={17} height={17} />
                Go Back
            </button>
        </div>
    );
}

export default returnButton;