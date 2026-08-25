import axios from "axios";

const API = axios.create({
    baseURL: "https://diaganova-backend.onrender.com/api",
    timeout: 20000
});


// ============================================================
// GET LATEST PREDICTION
// ============================================================

export const getLatestPrediction = async () => {

    const response = await API.get(
        "/predictions/latest"
    );

    return response.data;
};


// ============================================================
// GET ALL PREDICTIONS
// ============================================================

export const getAllPredictions = async () => {

    const response = await API.get(
        "/predictions"
    );

    return response.data;
};


// ============================================================
// GET PATIENT HISTORY
// ============================================================

export const getPatientHistory = async (patientId) => {

    const response = await API.get(
        `/patients/${patientId}`
    );

    return response.data;
};


// ============================================================
// GET PATIENT PROFILE
// ============================================================

export const getPatientProfile = async (patientId) => {

    const response = await API.get(
        `/patients/${patientId}`
    );

    return response.data;
};


// ============================================================
// API INSTANCE
// ============================================================

export default API;
