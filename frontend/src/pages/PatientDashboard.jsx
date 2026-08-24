import { useState } from "react";

import {
    getPatientHistory,
    getPatientProfile
} from "../services/api";

import DiseaseCard
    from "../components/DiseaseCard";


function PatientDashboard() {

    const [patientId, setPatientId]
        = useState("");

    const [profile, setProfile]
        = useState(null);

    const [data, setData]
        = useState(null);

    const [loading, setLoading]
        = useState(false);

    const [error, setError]
        = useState("");


    const searchPatient = async () => {

        if (!patientId.trim()) {

            setError(
                "Please enter Patient ID."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            // Get patient profile
            const patientProfile =
                await getPatientProfile(
                    patientId.trim()
                );


            // Get ThingSpeak predictions
            const patientData =
                await getPatientHistory(
                    patientId.trim()
                );


            setProfile(
                patientProfile
            );

            setData(
                patientData
            );


        } catch (error) {

            console.error(error);

            setProfile(null);

            setData(null);

            setError(
                "Patient could not be found."
            );


        } finally {

            setLoading(false);
        }
    };


    const latest =
        data?.records?.length
            ? data.records[
                data.records.length - 1
              ]
            : null;


    return (

        <div className="dashboard">

            <h1>
                Patient Dashboard
            </h1>

            <p className="subtitle">
                DiagaNova Multi Disease
                Prediction System
            </p>


            {/* SEARCH */}

            <div className="search-box">

                <input

                    type="text"

                    placeholder="Enter Patient ID"

                    value={patientId}

                    onChange={(e) =>
                        setPatientId(
                            e.target.value
                        )
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            searchPatient();

                        }

                    }}

                />


                <button
                    onClick={searchPatient}
                >
                    SEARCH
                </button>

            </div>


            {/* LOADING */}

            {loading && (

                <p>
                    Loading patient data...
                </p>

            )}


            {/* ERROR */}

            {error && (

                <p className="error">
                    {error}
                </p>

            )}


            {/* PATIENT PROFILE */}

            {profile && (

                <div className="patient-profile">

                    <div>

                        <span>
                            Patient Name
                        </span>

                        <strong>
                            {profile.name}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            {profile.patient_id}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Age
                        </span>

                        <strong>
                            {profile.age}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Gender
                        </span>

                        <strong>
                            {profile.gender}
                        </strong>

                    </div>

                </div>

            )}


            {/* PREDICTION RESULTS */}

            {latest && (

                <>

                    <h2 className="section-title">
                        Latest Screening Result
                    </h2>


                    <div className="disease-grid">

                        <DiseaseCard

                            title="Heart Disease"

                            icon="❤️"

                            value={
                                latest.heart_disease
                            }

                        />


                        <DiseaseCard

                            title="Diabetes"

                            icon="🩸"

                            value={
                                latest.diabetes
                            }

                        />


                        <DiseaseCard

                            title="Brain Tumor"

                            icon="🧠"

                            value={
                                latest.brain_tumor
                            }

                        />

                    </div>


                    <div className="assessment-info">

                        <strong>
                            Last Assessment
                        </strong>

                        <span>
                            {latest.created_at}
                        </span>

                    </div>


                    <div className="disclaimer">

                        AI-assisted screening only.
                        This system does not replace
                        professional medical diagnosis.

                    </div>

                </>

            )}

        </div>
    );
}


export default PatientDashboard;