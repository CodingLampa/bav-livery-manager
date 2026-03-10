import { useParams } from "react-router-dom";

export function InformationPage() {
    const { liveryId } = useParams();

    return (
        <div className="information-page">
            <h1>Information Page</h1>
            <p>This is the information page of the livery with ID: {liveryId}.</p>
        </div>
    );
}