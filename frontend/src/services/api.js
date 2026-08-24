import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 10000
});


// Get latest prediction
export const getLatestPrediction = async () => {
    const response = await API.get(
        "/predictions/latest"
    );

    return response.data;
};


// Get all predictions
export const getAllPredictions = async () => {
    const response = await API.get(
        "/predictions"
    );

    return response.data;
};


// Get patient history
export const getPatientHistory = async (patientId) => {
    const response = await API.get(
        `/patients/${patientId}`
    );

    return response.data;
};
// Get patient profile
export const getPatientProfile = async (patientId) => {

    const response = await API.get(
        `/patients/profile/${patientId}`
    );

    return response.data;
};