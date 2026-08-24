import PatientRegistration from "./pages/PatientRegistration";

import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Home
    from "./pages/Home";

import PatientDashboard
    from "./pages/PatientDashboard";

import DoctorDashboard
    from "./pages/DoctorDashboard";

import DoctorLogin
    from "./pages/DoctorLogin";

import "./App.css";


function App() {

    return (

        <BrowserRouter>

            {/* ==================================================
                NAVIGATION BAR
            ================================================== */}

            <nav className="navbar">

                <Link
                    to="/"
                    className="brand"
                >
                    DiagaNova
                </Link>


                <div className="nav-links">

                    {/* PATIENT */}

                    <Link
                        to="/patient/register"
                    >
                        Patient Login
                    </Link>


                    {/* DOCTOR */}

                    <Link
                        to="/doctor-login"
                    >
                        Doctor Acess 
                    </Link>

                </div>

            </nav>


            {/* ==================================================
                ROUTES
            ================================================== */}

            <Routes>


                {/* ==================================================
                    HOME
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                {/* ==================================================
                    PATIENT REGISTRATION
                ================================================== */}

                <Route
                    path="/patient/register"
                    element={
                        <PatientRegistration />
                    }
                />


                {/* ==================================================
                    PATIENT DASHBOARD
                ================================================== */}

                <Route
                    path="/patient"
                    element={
                        <PatientDashboard />
                    }
                />


                {/* ==================================================
                    DOCTOR LOGIN
                ================================================== */}

                <Route
                    path="/doctor-login"
                    element={
                        <DoctorLogin />
                    }
                />


                {/* ==================================================
                    DOCTOR DASHBOARD
                ================================================== */}

                <Route
                    path="/doctor"
                    element={
                        <DoctorDashboard />
                    }
                />


            </Routes>


        </BrowserRouter>

    );

}


export default App;