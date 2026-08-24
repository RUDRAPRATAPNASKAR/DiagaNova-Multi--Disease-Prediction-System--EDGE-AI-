import React, { useState } from "react";
import "./DoctorLogin.css";
import doctorImage from "../assets/dr_pic.png";

function DoctorLogin() {
    const [doctorId, setDoctorId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!doctorId.trim() || !password) {
            setError("Please enter your Doctor ID and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://127.0.0.1:8000/api/doctor/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        doctor_id: doctorId.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Invalid Doctor ID or password."
                );
            }

            // Keep the logged-in doctor information for
            // the Doctor Dashboard and assessment workflow.
            localStorage.setItem(
                "doctor_id",
                data.doctor_id
            );

            localStorage.setItem(
                "doctor_name",
                data.doctor_name || ""
            );

            localStorage.setItem(
                "access_token",
                data.access_token || ""
            );

            window.location.href = "/doctor";

        } catch (err) {
            setError(
                err.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="doctor-login-page">

            {/* ==================================================
                LEFT BRAND / HERO PANEL
            ================================================== */}

            <section className="doctor-login-hero">

                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>

                <div className="hero-top">

                    <div className="hero-brand">
                        <span className="brand-symbol">✦</span>
                        <span>DiagaNova</span>
                    </div>

                    <span className="hero-badge">
                        ● AI HEALTHCARE PLATFORM
                    </span>

                </div>

                <div className="hero-content">

                    <div className="eyebrow">
                        SECURE CLINICAL ACCESS
                    </div>

                    <h1>
                        Smarter Healthcare
                        <br />
                        Starts With
                        <span> DiagaNova.</span>
                    </h1>

                    <p>
                        A unified AI-assisted screening platform
                        connecting patients, doctors, machine learning
                        and real-time healthcare data.
                    </p>

                    <div className="hero-features">

                        <div className="hero-feature">
                            <span>✓</span>
                            AI-assisted disease screening
                        </div>

                        <div className="hero-feature">
                            <span>✓</span>
                            Real-time patient data
                        </div>

                        <div className="hero-feature">
                            <span>✓</span>
                            Secure doctor assessment
                        </div>

                    </div>

                </div>

                {/* ==================================================
                    MEDICAL AI VISUAL
                ================================================== */}

                <div className="medical-visual">

                    <div className="visual-orbit orbit-one"></div>
                    <div className="visual-orbit orbit-two"></div>

                    <div className="ai-core">
                        <div className="ai-core-icon">✦</div>
                        <strong>AI</strong>
                        <span>SCREENING</span>
                        <span>WITH DIAGANOVA</span>
                    </div>

                    {/* <div className="floating-card heart-card">
                        <div className="floating-icon heart-icon">♥</div>
                        <div>
                            <small>Heart Disease</small>
                            <strong>AI Probability</strong>
                        </div>
                        <b>78.4%</b>
                    </div> */}
{/* 
                    <div className="floating-card diabetes-card">
                        <div className="floating-icon drop-icon">◆</div>
                        <div>
                            <small>Diabetes</small>
                            <strong>AI Probability</strong>
                        </div>
                        <b>24.2%</b>
                    </div> */}

                    {/* <div className="floating-card brain-card">
                        <div className="floating-icon brain-icon">✦</div>
                        <div>
                            <small>Brain Tumor</small>
                            <strong>AI Probability</strong>
                        </div>
                        <b>6.3%</b>
                    </div> */}

                    <div className="system-card">
                        <span className="online-dot"></span>
                        <div>
                            <small>System Status</small>
                            <strong>All Systems Operational</strong>
                        </div>
                    </div>

                </div>

                <div className="hero-footer">
                    <span>ML</span>
                    <span>IoT</span>
                    <span>FASTAPI</span>
                    <span>THINGSPEAK</span>
                    <span>COMPUTER VISION</span>
                </div>
                <img
                    className="doctor-hero-image"
                    src={doctorImage}
                    alt="Doctor"
                />

            </section>


            {/* ==================================================
                RIGHT LOGIN PANEL
            ================================================== */}

            <section className="doctor-login-panel">

                <div className="login-card">

                    <div className="mobile-brand">
                        <span className="brand-symbol">✦</span>
                        DiagaNova
                    </div>

                    <div className="login-header">

                        <div className="login-lock">
                            🔐
                        </div>

                        <div className="login-eyebrow">
                            DOCTOR PORTAL
                        </div>

                        <h2>
                            Welcome back, Doctor
                        </h2>

                        <p>
                            Sign in to securely access patient
                            screening and clinical assessment.
                        </p>

                    </div>


                    {error && (
                        <div className="doctor-login-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}


                    <form
                        className="doctor-login-form"
                        onSubmit={handleLogin}
                    >

                        <div className="login-field">

                            <label htmlFor="doctor-id">
                                Doctor ID
                            </label>

                            <div className="input-wrap">

                                <span className="input-icon">
                                    ID
                                </span>

                                <input
                                    id="doctor-id"
                                    type="text"
                                    value={doctorId}
                                    onChange={(e) =>
                                        setDoctorId(e.target.value)
                                    }
                                    placeholder="Enter your unique Doctor ID"
                                    autoComplete="username"
                                />

                            </div>

                        </div>


                        <div className="login-field">

                            <label htmlFor="doctor-password">
                                Password
                            </label>

                            <div className="input-wrap">

                                <span className="input-icon">
                                    •••
                                </span>

                                <input
                                    id="doctor-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        <div className="security-note">

                            <span>✓</span>

                            <div>
                                <strong>Secure clinical access</strong>
                                <small>
                                    Your credentials are protected.
                                </small>
                            </div>

                        </div>


                        <button
                            type="submit"
                            className="doctor-login-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In to Doctor Portal
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    <div className="login-divider">
                        <span>AUTHORIZED ACCESS ONLY</span>
                    </div>


                    <div className="login-info">

                        <div className="info-icon">
                            ✓
                        </div>

                        <div>
                            <strong>For registered doctors</strong>
                            <p>
                                Use the unique Doctor ID provided
                                by the DiagaNova administrator.
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        className="back-home-button"
                        onClick={() =>
                            window.location.href = "/"
                        }
                    >
                        ← Back to DiagaNova Home
                    </button>

                </div>

                <div className="login-bottom">
                    DiagaNova · Intelligent Multi-Disease Screening
                </div>

            </section>

        </div>
    );
}

export default DoctorLogin;