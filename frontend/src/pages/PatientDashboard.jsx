import { useState } from "react";

import {
    getPatientHistory,
    getPatientProfile
} from "../services/api";

import DiseaseCard from "../components/DiseaseCard";


function PatientDashboard() {

    const [patientId, setPatientId] = useState("");

    const [profile, setProfile] = useState(null);

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ============================================================
    // SEARCH PATIENT
    // ============================================================

    const searchPatient = async () => {

        const id = patientId.trim();

        if (!id) {

            setError("Please enter Patient ID.");

            return;
        }


        try {

            setLoading(true);

            setError("");

            setProfile(null);

            setData(null);


            // ====================================================
            // 1. GET SQL PATIENT PROFILE
            // ====================================================

            let patientProfile = null;

            try {

                patientProfile =
                    await getPatientProfile(id);

                console.log(
                    "SQL PATIENT PROFILE:",
                    patientProfile
                );

                setProfile(patientProfile);

            } catch (profileError) {

                console.error(
                    "SQL PROFILE ERROR:",
                    profileError
                );

                setProfile(null);
            }


            // ====================================================
            // 2. GET THINGSPEAK / PREDICTION DATA
            // ====================================================

            let patientData = null;

            try {

                patientData =
                    await getPatientHistory(id);

                console.log(
                    "PATIENT PREDICTION DATA:",
                    patientData
                );

                setData(patientData);

            } catch (predictionError) {

                console.error(
                    "PREDICTION DATA ERROR:",
                    predictionError
                );

                setData(null);
            }


            // ====================================================
            // CHECK WHETHER ANYTHING WAS FOUND
            // ====================================================

            if (!patientProfile && !patientData) {

                setError(
                    "Patient could not be found."
                );

            }


        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // GET LATEST RECORD
    // ============================================================

    const latest =
        data?.records?.length > 0
            ? data.records[
                data.records.length - 1
            ]
            : null;


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <div className="dashboard">

            <h1>
                Patient Dashboard
            </h1>


            <p className="subtitle">
                DiagaNova Multi Disease Prediction System
            </p>


            {/* ==================================================
                SEARCH
            ================================================== */}

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
                    disabled={loading}
                >

                    {loading
                        ? "SEARCHING..."
                        : "SEARCH"}

                </button>

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

                <p>
                    Loading patient data...
                </p>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <p className="error">
                    {error}
                </p>

            )}


            {/* ==================================================
                PATIENT PROFILE - SQL DATABASE
            ================================================== */}

            {profile && (

                <div className="patient-profile">


                    {/* PATIENT NAME */}

                    <div>

                        <span>
                            Patient Name
                        </span>

                        <strong>
                            {profile.name || "N/A"}
                        </strong>

                    </div>


                    {/* PATIENT ID */}

                    <div>

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            {profile.patient_id || patientId}
                        </strong>

                    </div>


                    {/* AGE */}

                    <div>

                        <span>
                            Age
                        </span>

                        <strong>
                            {profile.age ?? "N/A"}
                        </strong>

                    </div>


                    {/* GENDER */}

                    <div>

                        <span>
                            Gender
                        </span>

                        <strong>
                            {profile.gender || "N/A"}
                        </strong>

                    </div>

                </div>

            )}


            {/* ==================================================
                EXTRA PATIENT INFORMATION
            ================================================== */}

            {profile && (

                <div className="patient-contact-info">

                    {profile.phone && (

                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {profile.phone}
                            </strong>

                        </div>

                    )}


                    {profile.email && (

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {profile.email}
                            </strong>

                        </div>

                    )}

                </div>

            )}


            {/* ==================================================
                PREDICTION RESULTS
            ================================================== */}

            {latest && (

                <>

                    <h2 className="section-title">
                        Latest Screening Result
                    </h2>


                    <div className="disease-grid">


                        {/* HEART DISEASE */}

                        <DiseaseCard

                            title="Heart Disease"

                            icon="❤️"

                            value={
                                latest.heart_disease
                            }

                        />


                        {/* DIABETES */}

                        <DiseaseCard

                            title="Diabetes"

                            icon="🩸"

                            value={
                                latest.diabetes
                            }

                        />


                        {/* BRAIN TUMOR */}

                        <DiseaseCard

                            title="Brain Tumor"

                            icon="🧠"

                            value={
                                latest.brain_tumor
                            }

                        />

                    </div>


                    {/* ==================================================
                        ASSESSMENT DATE
                    ================================================== */}

                    <div className="assessment-info">

                        <strong>
                            Last Assessment
                        </strong>

                        <span>
                            {latest.created_at || "N/A"}
                        </span>

                    </div>


                    {/* ==================================================
                        DISCLAIMER
                    ================================================== */}

                    <div className="disclaimer">

                        AI-assisted screening only.
                        This system does not replace
                        professional medical diagnosis.

                    </div>

                </>

            )}


            {/* ==================================================
                NO PREDICTION DATA
            ================================================== */}

            {profile && !latest && !loading && (

                <div className="no-data">

                    Patient profile found, but no
                    screening prediction is available yet.

                </div>

            )}

        </div>
    );
}


export default PatientDashboard;
