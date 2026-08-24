import { Link } from "react-router-dom";

function Home() {

    return (

        <div className="home">

            <div className="home-content">

                <div className="logo">
                    DiagaNova
                </div>

                <h1>
                    Multi Disease
                    <br />
                    Prediction System
                </h1>

                <p className="home-intro">
                    AI-assisted screening for Heart Disease, Diabetes, and Brain Tumor.
                </p>

                <div className="home-highlights">
                    <div className="home-highlight">
                        <span>01</span>
                        <strong>Edge-of-care solution</strong>
                        <p>Supports early detection and timely intervention.</p>
                    </div>

                    <div className="home-highlight">
                        <span>02</span>
                        <strong>IoT-connected insights</strong>
                        <p>Uses real-time health data for more informed screening.</p>
                    </div>

                    <div className="home-highlight">
                        <span>03</span>
                        <strong>Machine learning support</strong>
                        <p>Transforms health signals into clear prediction results.</p>
                    </div>
                </div>

                <p className="home-credit">
                    Developed by <strong>Rudra Pratap Naskar</strong> and <strong>Sudipta Roy</strong><br />
                    A.K. Choudhury School of Information Technology, University of Calcutta
                </p>


                <div className="home-buttons">

                    <Link
                        to="/patient"
                        className="main-button"
                    >
                        Patient Portal
                    </Link>

                    <Link
                        to="/doctor"
                        className="main-button doctor-button"
                    >
                        Doctor Portal
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Home;