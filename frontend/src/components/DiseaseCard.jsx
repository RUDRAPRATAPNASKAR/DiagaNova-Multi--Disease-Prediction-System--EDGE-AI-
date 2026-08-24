function DiseaseCard({ title, icon, value }) {

    // ThingSpeak value is displayed directly
    // as the prediction percentage.
    const percentage = value !== null && value !== undefined
        ? String(value)
        : "N/A";

    return (
        <div className="disease-card">

            <div className="disease-icon">
                {icon}
            </div>

            <div className="disease-content">

                <h3>
                    {title}
                </h3>

                <div className="percentage-value">
                    {percentage}%
                </div>

                <p className="percentage-label">
                    AI Prediction Probability
                </p>

            </div>

        </div>
    );
}

export default DiseaseCard;