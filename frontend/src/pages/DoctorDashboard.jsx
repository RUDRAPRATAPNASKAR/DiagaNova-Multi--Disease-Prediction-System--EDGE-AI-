import { useState } from "react";
import axios from "axios";

import {
    getPatientHistory,
    getPatientProfile
} from "../services/api";


function DoctorDashboard() {

    // ========================================================
    // PATIENT
    // ========================================================

    const [patientId, setPatientId] = useState("");

    const [profile, setProfile] = useState(null);

    const [history, setHistory] = useState(null);


    // ========================================================
    // STATUS
    // ========================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================================
    // DOCTOR FEEDBACK
    // ========================================================

    const [clinicalAssessment, setClinicalAssessment] =
        useState("");

    const [recommendation, setRecommendation] =
        useState("");

    const [reviewed, setReviewed] =
        useState(false);


    // ========================================================
    // ASSESSMENT
    // ========================================================

    const [savingAssessment, setSavingAssessment] =
        useState(false);

    const [assessmentSaved, setAssessmentSaved] =
        useState(false);


    // ========================================================
    // PDF
    // ========================================================

    const [generatingPDF, setGeneratingPDF] =
        useState(false);


    // ========================================================
    // EMAIL
    // ========================================================

    const [patientEmail, setPatientEmail] =
        useState("");

    const [sendingEmail, setSendingEmail] =
        useState(false);


    // ========================================================
    // SEARCH PATIENT
    // ========================================================

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

            setSuccess("");

            setProfile(null);

            setHistory(null);

            setClinicalAssessment("");

            setRecommendation("");

            setReviewed(false);

            setAssessmentSaved(false);

            setPatientEmail("");


            // ------------------------------------------------
            // PATIENT PROFILE
            // ------------------------------------------------

            const patientProfile =
                await getPatientProfile(
                    patientId.trim()
                );


            // ------------------------------------------------
            // PATIENT HISTORY
            // ------------------------------------------------

            const patientHistory =
                await getPatientHistory(
                    patientId.trim()
                );


            setProfile(
                patientProfile
            );

            setHistory(
                patientHistory
            );


        } catch (error) {

            console.error(
                "Patient search error:",
                error
            );

            setProfile(null);

            setHistory(null);

            setError(
                error.response?.data?.detail ||
                "Patient not found."
            );


        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LATEST RECORD
    // ========================================================

    const latestRecord =
        history?.records?.length
            ? history.records[
                history.records.length - 1
            ]
            : null;


    // ========================================================
    // PREDICTION TEXT
    // ========================================================

    const predictionPercentage = (value) => {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "N/A";
    }

    return `${number.toFixed(2)}%`;
    };


    // ========================================================
    // CHECK FEEDBACK
    // ========================================================

    const feedbackComplete =
        clinicalAssessment.trim().length > 0 &&
        recommendation.trim().length > 0 &&
        reviewed;


    // ========================================================
    // SAVE DOCTOR ASSESSMENT
    // ========================================================

    const saveDoctorAssessment = async () => {

        if (!profile) {

            setError(
                "Please search for a patient first."
            );

            return;
        }


        if (!clinicalAssessment.trim()) {

            setError(
                "Please enter the clinical assessment."
            );

            return;
        }


        if (!recommendation.trim()) {

            setError(
                "Please enter the doctor's recommendation."
            );

            return;
        }


        if (!reviewed) {

            setError(
                "Please confirm that you reviewed the AI results."
            );

            return;
        }


        try {

            setSavingAssessment(true);

            setError("");

            setSuccess("");


            // ------------------------------------------------
            // GET LOGGED-IN DOCTOR ID
            // ------------------------------------------------

            const doctorId =
                localStorage.getItem(
                    "doctor_id"
                );


            if (!doctorId) {

                setError(
                    "Doctor session not found. Please login again."
                );

                return;
            }


            // ------------------------------------------------
            // SEND ASSESSMENT
            // ------------------------------------------------

            const response =
                await axios.post(

                    "http://127.0.0.1:8000/api/doctor/assessment",

                    {

                        patient_id:
                            profile.patient_id,

                        doctor_id:
                            doctorId,

                        clinical_assessment:
                            clinicalAssessment.trim(),

                        recommendation:
                            recommendation.trim()

                    }

                );


            console.log(
                "Assessment saved:",
                response.data
            );


            setAssessmentSaved(true);

            setSuccess(
                "Doctor assessment saved successfully."
            );


        } catch (error) {

            console.error(
                "Assessment save error:",
                error
            );


            setError(

                error.response?.data?.detail ||

                "Unable to save doctor assessment."

            );


        } finally {

            setSavingAssessment(false);
        }
    };


    // ========================================================
    // GENERATE PDF
    // ========================================================

    const generatePDF = async () => {

        if (!profile) {

            setError(
                "Please search for a patient first."
            );

            return;
        }


        if (!assessmentSaved) {

            setError(
                "Please save the doctor's assessment first."
            );

            return;
        }


        try {

            setGeneratingPDF(true);

            setError("");

            setSuccess("");


            const response =
                await axios.get(

                    `http://127.0.0.1:8000/api/reports/generate/${profile.patient_id}`,

                    {
                        responseType: "blob"
                    }

                );


            const blob =
                new Blob(

                    [response.data],

                    {
                        type:
                            "application/pdf"
                    }

                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;


            link.download =
                `DiagaNova_Patient_${profile.patient_id}_Report.pdf`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            setSuccess(
                "Patient PDF report generated successfully."
            );


        } catch (error) {

            console.error(
                "PDF generation error:",
                error
            );


            setError(

                error.response?.data?.detail ||

                "Unable to generate patient PDF report."

            );


        } finally {

            setGeneratingPDF(false);
        }
    };


    // ========================================================
    // SEND PDF BY EMAIL
    // ========================================================

    const sendReportByEmail = async () => {

        // ----------------------------------------------------
        // CHECK PATIENT
        // ----------------------------------------------------

        if (!profile) {

            setError(
                "Please search for a patient first."
            );

            return;
        }


        // ----------------------------------------------------
        // CHECK ASSESSMENT
        // ----------------------------------------------------

        if (!assessmentSaved) {

            setError(
                "Please save the doctor's assessment first."
            );

            return;
        }


        // ----------------------------------------------------
        // CHECK EMAIL
        // ----------------------------------------------------

        if (!patientEmail.trim()) {

            setError(
                "Please enter the patient's email address."
            );

            return;
        }


        // ----------------------------------------------------
        // BASIC EMAIL VALIDATION
        // ----------------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                patientEmail.trim()
            )
        ) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        try {

            setSendingEmail(true);

            setError("");

            setSuccess("");


            // ------------------------------------------------
            // SEND EMAIL REQUEST
            // ------------------------------------------------

            const response =
                await axios.post(

                    `http://127.0.0.1:8000/api/reports/email/${profile.patient_id}`,

                    {

                        patient_email:
                            patientEmail.trim()

                    }

                );


            console.log(
                "Email response:",
                response.data
            );


            setSuccess(
                `Patient report successfully sent to ${patientEmail.trim()}`
            );


        } catch (error) {

            console.error(
                "Email sending error:",
                error
            );


            setError(

                error.response?.data?.detail ||

                "Unable to send patient report by email."

            );


        } finally {

            setSendingEmail(false);
        }
    };


    return (

        <div className="doctor-dashboard">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="doctor-header">

                <div className="dashboard-label">
                    DiagaNova
                </div>

                <h1>
                    Doctor Dashboard
                </h1>

                <p>
                    Patient Assessment Portal
                </p>

            </div>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="doctor-search">

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

                    onClick={
                        searchPatient
                    }

                    disabled={
                        loading
                    }

                >

                    {loading

                        ? "SEARCHING..."

                        : "SEARCH PATIENT"

                    }

                </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="doctor-error">

                    {error}

                </div>

            )}


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (

                <div className="feedback-status complete">

                    ✓ {success}

                </div>

            )}


            {/* ==================================================
                PATIENT PROFILE
            ================================================== */}

            {profile && (

                <div className="doctor-profile">


                    <div className="doctor-profile-card">

                        <span>
                            Patient Name
                        </span>

                        <strong>
                            {profile.name}
                        </strong>

                    </div>


                    <div className="doctor-profile-card">

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            {profile.patient_id}
                        </strong>

                    </div>


                    <div className="doctor-profile-card">

                        <span>
                            Age
                        </span>

                        <strong>
                            {profile.age}
                        </strong>

                    </div>


                    <div className="doctor-profile-card">

                        <span>
                            Gender
                        </span>

                        <strong>
                            {profile.gender}
                        </strong>

                    </div>

                </div>

            )}


            {/* ==================================================
                AI RESULTS
            ================================================== */}

            {latestRecord && (

                <div className="doctor-results">

                    <h2>
                        Latest AI Screening
                    </h2>

                    {/* ==================================================
                        AI PREDICTION PROBABILITIES
                    ================================================== */}

                    <div className="disease-grid">

                        {/* HEART DISEASE */}

                        <div className="disease-card">

                            <div className="disease-icon">
                                ❤️
                            </div>

                            <div className="disease-content">

                                <h3>
                                    Heart Disease
                                </h3>

                                <strong
                                    className="prediction-percentage"
                                    style={{
                                        display: "block",
                                        fontSize: "30px",
                                        fontWeight: "800",
                                        color: "#2563eb",
                                        marginTop: "6px"
                                    }}
                                >
                                    {predictionPercentage(
                                        latestRecord.heart_disease
                                    )}
                                </strong>

                                <p
                                    className="prediction-label"
                                    style={{
                                        margin: "6px 0 0",
                                        fontSize: "13px",
                                        color: "#667085",
                                        fontWeight: "500"
                                    }}
                                >
                                    Prediction Probability
                                </p>

                            </div>

                        </div>


                        {/* DIABETES */}

                        <div className="disease-card">

                            <div className="disease-icon">
                                🩸
                            </div>

                            <div className="disease-content">

                                <h3>
                                    Diabetes
                                </h3>

                                <strong
                                    className="prediction-percentage"
                                    style={{
                                        display: "block",
                                        fontSize: "30px",
                                        fontWeight: "800",
                                        color: "#2563eb",
                                        marginTop: "6px"
                                    }}
                                >
                                    {predictionPercentage(
                                        latestRecord.diabetes
                                    )}
                                </strong>

                                <p
                                    className="prediction-label"
                                    style={{
                                        margin: "6px 0 0",
                                        fontSize: "13px",
                                        color: "#667085",
                                        fontWeight: "500"
                                    }}
                                >
                                    Prediction Probability
                                </p>

                            </div>

                        </div>


                        {/* BRAIN TUMOR */}

                        <div className="disease-card">

                            <div className="disease-icon">
                                🧠
                            </div>

                            <div className="disease-content">

                                <h3>
                                    Brain Tumor
                                </h3>

                                <strong
                                    className="prediction-percentage"
                                    style={{
                                        display: "block",
                                        fontSize: "30px",
                                        fontWeight: "800",
                                        color: "#2563eb",
                                        marginTop: "6px"
                                    }}
                                >
                                    {predictionPercentage(
                                        latestRecord.brain_tumor
                                    )}
                                </strong>

                                <p
                                    className="prediction-label"
                                    style={{
                                        margin: "6px 0 0",
                                        fontSize: "13px",
                                        color: "#667085",
                                        fontWeight: "500"
                                    }}
                                >
                                    Prediction Probability
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ASSESSMENT INFORMATION
                    ================================================== */}

                    <div className="assessment-summary">

                        <div>

                            <span>
                                Assessment ID
                            </span>

                            <strong>
                                {latestRecord.entry_id}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Assessment Date
                            </span>

                            <strong>
                                {latestRecord.created_at}
                            </strong>

                        </div>

                    </div>


                    {/* ==================================================
                        OVERALL PROBABILITY SUMMARY
                    ================================================== */}

                    <div className="overall-status">

                        <span>
                            AI Probability Summary
                        </span>

                        <strong>
                            Heart: {predictionPercentage(latestRecord.heart_disease)}
                            {" "}
                            | Diabetes: {predictionPercentage(latestRecord.diabetes)}
                            {" "}
                            | Brain Tumor: {predictionPercentage(latestRecord.brain_tumor)}
                        </strong>

                    </div>

                </div>

            )}


            {/* ==================================================
                DOCTOR ASSESSMENT
            ================================================== */}

            {profile && latestRecord && (

                <div className="doctor-feedback-section">


                    <div className="feedback-header">

                        <h2>
                            Doctor's Clinical Assessment
                        </h2>

                        <p>

                            Review the AI screening
                            results and provide
                            your professional
                            assessment.

                        </p>

                    </div>


                    {/* ==================================================
                        CLINICAL ASSESSMENT
                    ================================================== */}

                    <div className="feedback-field">

                        <label>

                            Clinical Assessment

                            <span className="required">
                                *
                            </span>

                        </label>


                        <textarea

                            value={
                                clinicalAssessment
                            }

                            onChange={(e) =>
                                setClinicalAssessment(
                                    e.target.value
                                )
                            }

                            placeholder="Enter your clinical observations, findings, or comments..."

                            rows="6"

                        />


                        <div className="character-count">

                            {clinicalAssessment.length}
                            {" "}characters

                        </div>

                    </div>


                    {/* ==================================================
                        RECOMMENDATION
                    ================================================== */}

                    <div className="feedback-field">

                        <label>

                            Doctor's Recommendation

                            <span className="required">
                                *
                            </span>

                        </label>


                        <textarea

                            value={
                                recommendation
                            }

                            onChange={(e) =>
                                setRecommendation(
                                    e.target.value
                                )
                            }

                            placeholder="Enter recommended follow-up, consultation, tests, lifestyle advice, or other clinical recommendations..."

                            rows="5"

                        />


                        <div className="character-count">

                            {recommendation.length}
                            {" "}characters

                        </div>

                    </div>


                    {/* ==================================================
                        REVIEW
                    ================================================== */}

                    <div className="review-confirmation">

                        <label className="checkbox-label">

                            <input

                                type="checkbox"

                                checked={
                                    reviewed
                                }

                                onChange={(e) =>
                                    setReviewed(
                                        e.target.checked
                                    )
                                }

                            />

                            <span>

                                I confirm that I
                                have reviewed the
                                AI-assisted screening
                                results.

                            </span>

                        </label>

                    </div>


                    {/* ==================================================
                        STATUS
                    ================================================== */}

                    <div

                        className={
                            feedbackComplete
                                ? "feedback-status complete"
                                : "feedback-status incomplete"
                        }

                    >

                        {feedbackComplete

                            ? "✓ Assessment complete. Ready to save."

                            : "Please complete the clinical assessment, recommendation, and review confirmation before saving."

                        }

                    </div>


                    {/* ==================================================
                        SAVE ASSESSMENT
                    ================================================== */}

                    <button

                        className="generate-report-button"

                        disabled={
                            !feedbackComplete ||
                            savingAssessment
                        }

                        onClick={
                            saveDoctorAssessment
                        }

                    >

                        {savingAssessment

                            ? "SAVING ASSESSMENT..."

                            : "SAVE DOCTOR ASSESSMENT"

                        }

                    </button>


                    {/* ==================================================
                        GENERATE PDF
                    ================================================== */}

                    <button

                        className="generate-report-button"

                        disabled={
                            !assessmentSaved ||
                            generatingPDF
                        }

                        onClick={
                            generatePDF
                        }

                    >

                        {generatingPDF

                            ? "GENERATING PDF..."

                            : "GENERATE PDF REPORT"

                        }

                    </button>


                    {/* ==================================================
                        EMAIL SECTION
                    ================================================== */}

                    <div className="email-report-section">

                        <h2>
                            Send Report to Patient
                        </h2>


                        <p>

                            Enter the patient's email
                            address. The PDF report will
                            be generated and sent as an
                            attachment.

                        </p>


                        <div className="feedback-field">

                            <label>

                                Patient Email Address

                                <span className="required">
                                    *
                                </span>

                            </label>


                            <input

                                type="email"

                                value={
                                    patientEmail
                                }

                                onChange={(e) =>
                                    setPatientEmail(
                                        e.target.value
                                    )
                                }

                                placeholder="patient@example.com"

                            />

                        </div>


                        {/* ==================================================
                            SEND EMAIL BUTTON
                        ================================================== */}

                        <button

                            className="generate-report-button"

                            disabled={
                                !assessmentSaved ||
                                sendingEmail ||
                                !patientEmail.trim()
                            }

                            onClick={
                                sendReportByEmail
                            }

                        >

                            {sendingEmail

                                ? "SENDING REPORT..."

                                : "SEND PDF TO PATIENT"

                            }

                        </button>

                    </div>


                </div>

            )}


            {/* ==================================================
                HISTORY
            ================================================== */}

            {history &&
                history.records.length > 0 && (

                    <div className="history">

                        <h2>
                            Assessment History
                        </h2>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Entry
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Heart Disease
                                        </th>

                                        <th>
                                            Diabetes
                                        </th>

                                        <th>
                                            Brain Tumor
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {history.records
                                        .slice()
                                        .reverse()
                                        .map(
                                            (record) => (

                                                <tr
                                                    key={
                                                        record.entry_id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            record.entry_id
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            record.created_at
                                                        }
                                                    </td>

                                                    <td>

                                                        {predictionPercentage(
                                                            record.heart_disease
                                                        )}

                                                    </td>

                                                    <td>

                                                        {predictionPercentage(
                                                            record.diabetes
                                                        )}

                                                    </td>

                                                    <td>

                                                        {predictionPercentage(
                                                            record.brain_tumor
                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )
            }


            {/* ==================================================
                NO HISTORY
            ================================================== */}

            {history &&
                history.records.length === 0 && (

                    <div className="doctor-message">

                        No prediction records found
                        for this patient.

                    </div>

                )
            }


            {/* ==================================================
                DISCLAIMER
            ================================================== */}

            {profile && (

                <div className="doctor-disclaimer">

                    <strong>
                        Clinical Disclaimer
                    </strong>

                    <p>

                        DiagaNova provides
                        AI-assisted screening
                        results. These results
                        should not be considered
                        a substitute for professional
                        medical diagnosis or clinical
                        examination.

                    </p>

                </div>

            )}

        </div>

    );
}


export default DoctorDashboard;