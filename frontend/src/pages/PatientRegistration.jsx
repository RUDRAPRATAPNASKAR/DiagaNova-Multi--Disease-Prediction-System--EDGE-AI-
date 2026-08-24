import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientRegistration.css";
import patientImage from "../assets/patient.png";

function PatientRegistration() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        patient_id: "",
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        access_code: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        setError("");
        setSuccess("");
    };


    const registerPatient = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!form.patient_id.trim()) {
            setError("Please enter your Patient ID.");
            return;
        }

        if (!form.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!form.age) {
            setError("Please enter your age.");
            return;
        }

        if (!form.gender) {
            setError("Please select your gender.");
            return;
        }

        if (!form.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!form.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!form.email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!form.access_code.trim()) {
            setError("Please create an access code.");
            return;
        }


        try {

            setLoading(true);


            // ------------------------------------------------
            // CREATE PATIENT
            // ------------------------------------------------

            await axios.post(
                "http://127.0.0.1:8000/api/patients",
                {
                    patient_id: form.patient_id.trim(),

                    name: form.name.trim(),

                    age: Number(form.age),

                    gender: form.gender,

                    phone: form.phone.trim(),

                    email: form.email.trim(),

                    access_code: form.access_code.trim()
                }
            );


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setSuccess(
                "Registration successful. Redirecting..."
            );


            // Save patient session locally
            localStorage.setItem(
                "patient_id",
                form.patient_id.trim()
            );


            localStorage.setItem(
                "patient_name",
                form.name.trim()
            );


            setTimeout(() => {

                navigate("/patient");

            }, 1200);


        } catch (error) {

            console.error(
                "Patient registration error:",
                error
            );


            setError(

                error.response?.data?.detail ||

                "Unable to register patient. Please try again."

            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="registration-page">

            <img
                className="registration-hero-image"
                src={patientImage}
                alt=""
            />

            <div className="registration-visual" aria-hidden="true">

                <div className="visual-topline">
                    <span className="visual-mark">+</span>
                    DiagaNova care platform
                </div>

                <div className="visual-copy">
                    <p className="visual-eyebrow">Personal health, made clearer</p>
                    <h2>Smarter care<br />starts with you.</h2>
                    <p>
                        Create your secure patient profile and keep your screening journey in one calm, connected space.
                    </p>
                </div>

                <div className="visual-insight">
                    <section className="steps-language-section">
                        <span>How to use DiagaNova</span>
                        <strong>Patient Steps</strong>
                        <ol className="patient-steps">
                            <li><b>Get Patient ID</b> - Get your ID from the hospital, authority, or device provider.</li>
                            <li><b>Enter Patient ID</b> - Enter your assigned ID.</li>
                            <li><b>Fill Details</b> - Enter your basic and health information.</li>
                            <li><b>Add Health Data</b> - Enter BP, sugar, temperature, heart rate, etc.</li>
                            <li><b>Upload MRI</b> - Upload a brain MRI if required.</li>
                            <li><b>Start Analysis</b> - Click <b>Analyze</b>.</li>
                            <li><b>View Results</b> - Check disease prediction and confidence percentage.</li>
                            <li><b>Save Results</b> - Your results are stored with your Patient ID.</li>
                            <li><b>Doctor Review</b> - Show the report to a healthcare professional.</li>
                            <li><b>Generate & Email Report</b> — For serious or high-risk cases, a PDF medical report is generated, reviewed by the doctor, and sent to the registered email address.</li>
                        </ol>
                    </section>

                    <section className="steps-language-section bengali-steps">
                        <span>DiagaNova ব্যবহারের নিয়ম</span>
                        <strong>রোগীর ধাপসমূহ</strong>
                        <ol className="patient-steps">
                        <li><b>Patient ID সংগ্রহ করুন</b> - হাসপাতাল, কর্তৃপক্ষ বা ডিভাইস প্রদানকারীর কাছ থেকে আপনার Patient ID নিন।</li>
                        <li><b>Patient ID দিন</b> - আপনার নির্ধারিত Patient ID প্রবেশ করান।</li>
                        <li><b>তথ্য পূরণ করুন</b> - আপনার সাধারণ ও স্বাস্থ্য সংক্রান্ত তথ্য দিন।</li>
                        <li><b>স্বাস্থ্য তথ্য দিন</b> - BP, Sugar, Temperature, Heart Rate ইত্যাদি তথ্য দিন।</li>
                        <li><b>MRI আপলোড করুন</b> - প্রয়োজন হলে Brain MRI আপলোড করুন।</li>
                        <li><b>Analysis শুরু করুন</b> - <b>Analyze</b> বাটনে ক্লিক করুন।</li>
                        <li><b>ফলাফল দেখুন</b> - রোগের পূর্বাভাস ও Confidence Percentage দেখুন।</li>
                        <li><b>ফলাফল সংরক্ষণ করুন</b> - আপনার Patient ID-এর সাথে ফলাফল সংরক্ষিত হবে।</li>
                        <li><b>ডাক্তারের পরামর্শ নিন</b> - রিপোর্টটি একজন চিকিৎসককে দেখান।</li>
                        <li><b>রিপোর্ট তৈরি ও ইমেইল করুন</b> — গুরুতর বা উচ্চ ঝুঁকিপূর্ণ ক্ষেত্রে, একটি PDF মেডিকেল রিপোর্ট তৈরি করা হয়, ডাক্তার দ্বারা পর্যালোচনা করা হয় এবং নিবন্ধিত ইমেইল ঠিকানায় পাঠানো হয়।</li>
                        </ol>
                    </section>
                </div>

            </div>

            <div className="registration-card">


                {/* ------------------------------------------------
                    HEADER
                ------------------------------------------------ */}

                <div className="registration-header">

                    <div className="registration-logo">
                        DiagaNova
                    </div>

                    <h1>
                        Patient Registration
                    </h1>

                    <p>
                        Create your DiagaNova patient profile
                    </p>

                </div>


                {/* ------------------------------------------------
                    FORM
                ------------------------------------------------ */}

                <form
                    onSubmit={registerPatient}
                    className="registration-form"
                >


                    {/* PATIENT ID */}

                    <div className="form-group">

                        <label>
                            Patient ID
                        </label>

                        <input
                            type="text"
                            name="patient_id"
                            value={form.patient_id}
                            onChange={handleChange}
                            placeholder="Enter Patient ID"
                        />

                        <small>
                            Use the same Patient ID that is
                            used in the DiagaNova system.
                        </small>

                    </div>


                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />

                    </div>


                    {/* AGE + GENDER */}

                    <div className="form-row">


                        <div className="form-group">

                            <label>
                                Age
                            </label>

                            <input
                                type="number"
                                name="age"
                                min="1"
                                max="120"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="Age"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                        />

                        <small>
                            Your medical report will be sent
                            to this email address.
                        </small>

                    </div>


                    {/* ACCESS CODE */}

                    <div className="form-group">

                        <label>
                            Patient Access Code
                        </label>

                        <input
                            type="password"
                            name="access_code"
                            value={form.access_code}
                            onChange={handleChange}
                            placeholder="Create an access code"
                        />

                        <small>
                            Keep this code private.
                        </small>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="registration-error">

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="registration-success">

                            {success}

                        </div>

                    )}


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Profile..."
                            : "Create Patient Profile"
                        }

                    </button>


                </form>


                {/* FOOTER */}

                <div className="registration-footer">

                    <span>
                        Already registered?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/patient")
                        }
                    >
                        Go to Patient Dashboard
                    </button>

                </div>


            </div>
        </div>

    );
}

export default PatientRegistration;