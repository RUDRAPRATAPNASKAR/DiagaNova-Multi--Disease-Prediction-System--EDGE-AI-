from fastapi import FastAPI, HTTPException
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt

import hashlib
import secrets
import os

from fastapi.responses import FileResponse

from report_generator import generate_patient_report
from email_service import send_patient_report

from database import (
    SessionLocal,
    Patient,
    Doctor,
    DoctorAssessment
)

from thingspeak import (
    get_latest_record,
    get_all_records
)


# ============================================================
# AUTHENTICATION CONFIGURATION
# ============================================================

SECRET_KEY = "MEDI_AI_CHANGE_THIS_SECRET_KEY_2026"

ALGORITHM = "HS256"


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="MEDI-AI Backend",
    description="Multi Disease Prediction System",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://diaganova-frontend.onrender.com"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)
# ============================================================
# PASSWORD HASHING
# ============================================================

def hash_password(password: str) -> str:

    salt = secrets.token_hex(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    ).hex()

    return f"{salt}:{password_hash}"


def verify_password(
    password: str,
    stored_hash: str
) -> bool:

    try:

        salt, original_hash = stored_hash.split(":")

        password_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        ).hex()

        return secrets.compare_digest(
            password_hash,
            original_hash
        )

    except Exception:

        return False


# ============================================================
# PATIENT REGISTRATION MODEL
# ============================================================

class PatientCreate(BaseModel):

    patient_id: str

    name: str

    age: int | None = None

    gender: str | None = None

    phone: str | None = None

    email: str

    access_code: str


# ============================================================
# DOCTOR LOGIN MODEL
# ============================================================

class DoctorLogin(BaseModel):

    doctor_id: str

    password: str


# ============================================================
# DOCTOR ASSESSMENT MODEL
# ============================================================

class DoctorAssessmentRequest(BaseModel):

    patient_id: str

    doctor_id: str

    clinical_assessment: str

    recommendation: str


# ============================================================
# EMAIL REQUEST MODEL
# ============================================================

class SendReportEmailRequest(BaseModel):

    patient_email: str | None = None


# ============================================================
# CREATE JWT TOKEN
# ============================================================

def create_access_token(
    doctor_id: str
):

    payload = {
        "doctor_id": doctor_id
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "MEDI-AI Backend is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    return {
        "status": "online"
    }


# ============================================================
# LATEST THINGSPEAK RECORD
# ============================================================

@app.get("/api/predictions/latest")
def latest_prediction():

    try:

        data = get_latest_record()

        return {

            "patient_id":
                data.get("field1"),

            "heart_disease":
                data.get("field2"),

            "diabetes":
                data.get("field3"),

            "brain_tumor":
                data.get("field4"),

            "entry_id":
                data.get("entry_id"),

            "created_at":
                data.get("created_at")
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# ALL PREDICTIONS
# ============================================================

@app.get("/api/predictions")
def all_predictions(
    limit: int = 100
):

    try:

        data = get_all_records(limit)

        records = []

        for item in data.get("feeds", []):

            records.append({

                "patient_id":
                    item.get("field1"),

                "heart_disease":
                    item.get("field2"),

                "diabetes":
                    item.get("field3"),

                "brain_tumor":
                    item.get("field4"),

                "entry_id":
                    item.get("entry_id"),

                "created_at":
                    item.get("created_at")
            })

        return {
            "records": records
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# PATIENT SEARCH / HISTORY
# ============================================================

@app.get("/api/patients/{patient_id}")
def patient_history(
    patient_id: str
):

    try:

        data = get_all_records(100)

        records = []

        for item in data.get("feeds", []):

            if str(
                item.get("field1")
            ) == str(patient_id):

                records.append({

                    "patient_id":
                        item.get("field1"),

                    "heart_disease":
                        item.get("field2"),

                    "diabetes":
                        item.get("field3"),

                    "brain_tumor":
                        item.get("field4"),

                    "entry_id":
                        item.get("entry_id"),

                    "created_at":
                        item.get("created_at")
                })

        return {

            "patient_id":
                patient_id,

            "count":
                len(records),

            "records":
                records
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# CREATE PATIENT
# ============================================================

@app.post("/api/patients")
def create_patient(
    patient: PatientCreate
):

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # CLEAN DATA
        # ----------------------------------------------------

        patient_id = patient.patient_id.strip()

        name = patient.name.strip()

        email = patient.email.strip()

        access_code = patient.access_code.strip()

        gender = (
            patient.gender.strip()
            if patient.gender
            else None
        )

        phone = (
            patient.phone.strip()
            if patient.phone
            else None
        )


        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not patient_id:

            raise HTTPException(
                status_code=400,
                detail="Patient ID is required"
            )


        if not name:

            raise HTTPException(
                status_code=400,
                detail="Patient name is required"
            )


        if not email:

            raise HTTPException(
                status_code=400,
                detail="Email address is required"
            )


        if not access_code:

            raise HTTPException(
                status_code=400,
                detail="Access code is required"
            )


        # ----------------------------------------------------
        # CHECK PATIENT ID
        # ----------------------------------------------------

        existing = db.query(
            Patient
        ).filter(
            Patient.patient_id == patient_id
        ).first()


        if existing:

            raise HTTPException(
                status_code=400,
                detail="Patient ID already exists"
            )


        # ----------------------------------------------------
        # CHECK EMAIL
        # ----------------------------------------------------

        existing_email = db.query(
            Patient
        ).filter(
            Patient.email == email
        ).first()


        if existing_email:

            raise HTTPException(
                status_code=400,
                detail="Email address already registered"
            )


        # ----------------------------------------------------
        # CHECK ACCESS CODE
        # ----------------------------------------------------

        existing_code = db.query(
            Patient
        ).filter(
            Patient.access_code == access_code
        ).first()


        if existing_code:

            raise HTTPException(
                status_code=400,
                detail="Access code already exists"
            )


        # ----------------------------------------------------
        # CREATE PATIENT
        # ----------------------------------------------------

        new_patient = Patient(

            patient_id=patient_id,

            name=name,

            age=patient.age,

            gender=gender,

            phone=phone,

            email=email,

            access_code=access_code
        )


        # ----------------------------------------------------
        # SAVE
        # ----------------------------------------------------

        db.add(new_patient)

        db.commit()

        db.refresh(new_patient)


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "message":
                "Patient created successfully",

            "patient_id":
                new_patient.patient_id,

            "name":
                new_patient.name,

            "age":
                new_patient.age,

            "gender":
                new_patient.gender,

            "phone":
                new_patient.phone,

            "email":
                new_patient.email

        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        db.close()


# ============================================================
# GET PATIENT PROFILE
# ============================================================

@app.get("/api/patients/profile/{patient_id}")
def get_patient_profile(
    patient_id: str
):

    db = SessionLocal()

    try:

        patient = db.query(
            Patient
        ).filter(
            Patient.patient_id == patient_id
        ).first()


        if not patient:

            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )


        return {

            "patient_id":
                patient.patient_id,

            "name":
                patient.name,

            "age":
                patient.age,

            "gender":
                patient.gender,

            "phone":
                patient.phone,

            "email":
                patient.email

        }


    finally:

        db.close()


# ============================================================
# DOCTOR LOGIN
# ============================================================

@app.post("/api/doctor/login")
def doctor_login(
    login: DoctorLogin
):

    db = SessionLocal()

    try:

        doctor = db.query(
            Doctor
        ).filter(
            Doctor.doctor_id ==
            login.doctor_id
        ).first()


        if not doctor:

            raise HTTPException(
                status_code=401,
                detail="Invalid Doctor ID or password"
            )


        if not verify_password(
            login.password,
            doctor.password_hash
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid Doctor ID or password"
            )


        token = create_access_token(
            doctor.doctor_id
        )


        return {

            "message":
                "Login successful",

            "doctor_id":
                doctor.doctor_id,

            "doctor_name":
                doctor.name,

            "access_token":
                token

        }


    finally:

        db.close()


# ============================================================
# SAVE DOCTOR ASSESSMENT
# ============================================================

@app.post("/api/doctor/assessment")
def save_doctor_assessment(
    assessment: DoctorAssessmentRequest
):

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # CHECK PATIENT
        # ----------------------------------------------------

        patient = db.query(
            Patient
        ).filter(
            Patient.patient_id ==
            assessment.patient_id
        ).first()


        if not patient:

            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )


        # ----------------------------------------------------
        # CHECK DOCTOR
        # ----------------------------------------------------

        doctor = db.query(
            Doctor
        ).filter(
            Doctor.doctor_id ==
            assessment.doctor_id
        ).first()


        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )


        # ----------------------------------------------------
        # VALIDATE ASSESSMENT
        # ----------------------------------------------------

        if not assessment.clinical_assessment.strip():

            raise HTTPException(
                status_code=400,
                detail="Clinical assessment is required"
            )


        if not assessment.recommendation.strip():

            raise HTTPException(
                status_code=400,
                detail="Doctor recommendation is required"
            )


        # ----------------------------------------------------
        # DATE
        # ----------------------------------------------------

        assessment_date = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )


        # ----------------------------------------------------
        # CREATE ASSESSMENT
        # ----------------------------------------------------

        new_assessment = DoctorAssessment(

            patient_id=
                assessment.patient_id,

            doctor_id=
                assessment.doctor_id,

            clinical_assessment=
                assessment.clinical_assessment.strip(),

            recommendation=
                assessment.recommendation.strip(),

            assessment_date=
                assessment_date
        )


        db.add(
            new_assessment
        )

        db.commit()

        db.refresh(
            new_assessment
        )


        return {

            "message":
                "Doctor assessment saved successfully",

            "assessment_id":
                new_assessment.id,

            "patient_id":
                new_assessment.patient_id,

            "doctor_id":
                new_assessment.doctor_id,

            "doctor_name":
                doctor.name,

            "assessment_date":
                new_assessment.assessment_date

        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        db.close()


# ============================================================
# GENERATE PATIENT PDF REPORT
# ============================================================

@app.get("/api/reports/generate/{patient_id}")
def generate_patient_pdf(
    patient_id: str
):

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # FIND PATIENT
        # ----------------------------------------------------

        patient = db.query(
            Patient
        ).filter(
            Patient.patient_id ==
            patient_id
        ).first()


        if not patient:

            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )


        # ----------------------------------------------------
        # FIND LATEST DOCTOR ASSESSMENT
        # ----------------------------------------------------

        doctor_assessment = db.query(
            DoctorAssessment
        ).filter(
            DoctorAssessment.patient_id ==
            patient_id
        ).order_by(
            DoctorAssessment.id.desc()
        ).first()


        if not doctor_assessment:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Doctor assessment not found. "
                    "Please save the doctor's "
                    "assessment first."
                )
            )


        # ----------------------------------------------------
        # FIND DOCTOR
        # ----------------------------------------------------

        doctor = db.query(
            Doctor
        ).filter(
            Doctor.doctor_id ==
            doctor_assessment.doctor_id
        ).first()


        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )


        # ----------------------------------------------------
        # GET THINGSPEAK DATA
        # ----------------------------------------------------

        data = get_all_records(100)

        patient_records = []


        for item in data.get(
            "feeds",
            []
        ):

            if str(
                item.get("field1")
            ) == str(
                patient_id
            ):

                patient_records.append({

                    "patient_id":
                        item.get("field1"),

                    "heart_disease":
                        item.get("field2"),

                    "diabetes":
                        item.get("field3"),

                    "brain_tumor":
                        item.get("field4"),

                    "entry_id":
                        item.get("entry_id"),

                    "created_at":
                        item.get("created_at")

                })


        if not patient_records:

            raise HTTPException(
                status_code=404,
                detail="No AI prediction found for this patient"
            )


        # ----------------------------------------------------
        # LATEST PREDICTION
        # ----------------------------------------------------

        prediction = patient_records[-1]


        # ----------------------------------------------------
        # REPORT DIRECTORY
        # ----------------------------------------------------

        report_directory = "reports"

        os.makedirs(
            report_directory,
            exist_ok=True
        )


        # ----------------------------------------------------
        # FILE NAME
        # ----------------------------------------------------

        file_name = (
            f"DiagaNova_Patient_"
            f"{patient_id}_Report.pdf"
        )


        file_path = os.path.join(
            report_directory,
            file_name
        )


        # ----------------------------------------------------
        # PATIENT DATA
        # ----------------------------------------------------

        patient_data = {

            "patient_id":
                patient.patient_id,

            "name":
                patient.name,

            "age":
                patient.age,

            "gender":
                patient.gender,

            "phone":
                patient.phone,

            "email":
                patient.email

        }


        # ----------------------------------------------------
        # DOCTOR DATA
        # ----------------------------------------------------

        doctor_data = {

            "doctor_id":
                doctor.doctor_id,

            "name":
                doctor.name

        }


        # ----------------------------------------------------
        # GENERATE PDF
        # ----------------------------------------------------

        generate_patient_report(

            file_path=file_path,

            patient=patient_data,

            prediction=prediction,

            doctor=doctor_data,

            clinical_assessment=
                doctor_assessment.clinical_assessment,

            recommendation=
                doctor_assessment.recommendation
        )


        return FileResponse(

            path=file_path,

            media_type="application/pdf",

            filename=file_name
        )


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        db.close()


# ============================================================
# SEND PATIENT PDF REPORT BY EMAIL
# ============================================================

@app.post("/api/reports/email/{patient_id}")
def email_patient_report(
    patient_id: str,
    request: SendReportEmailRequest
):

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # FIND PATIENT
        # ----------------------------------------------------

        patient = db.query(
            Patient
        ).filter(
            Patient.patient_id ==
            patient_id
        ).first()


        if not patient:

            raise HTTPException(
                status_code=404,
                detail=
                    f"Patient {patient_id} not found"
            )


        # ----------------------------------------------------
        # USE EMAIL SAVED DURING REGISTRATION
        # ----------------------------------------------------

        email = patient.email


        # ----------------------------------------------------
        # BACKUP:
        # IF FRONTEND SENDS EMAIL, USE IT
        # ----------------------------------------------------

        if not email and request.patient_email:

            email = request.patient_email.strip()


        if not email:

            raise HTTPException(
                status_code=400,
                detail=
                    "Patient email is not registered"
            )


        # ----------------------------------------------------
        # FIND LATEST DOCTOR ASSESSMENT
        # ----------------------------------------------------

        doctor_assessment = db.query(
            DoctorAssessment
        ).filter(
            DoctorAssessment.patient_id ==
            patient_id
        ).order_by(
            DoctorAssessment.id.desc()
        ).first()


        if not doctor_assessment:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Doctor assessment not found. "
                    "Save the doctor's assessment first."
                )
            )


        # ----------------------------------------------------
        # FIND DOCTOR
        # ----------------------------------------------------

        doctor = db.query(
            Doctor
        ).filter(
            Doctor.doctor_id ==
            doctor_assessment.doctor_id
        ).first()


        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )


        # ----------------------------------------------------
        # GET THINGSPEAK DATA
        # ----------------------------------------------------

        data = get_all_records(100)

        patient_records = []


        for item in data.get(
            "feeds",
            []
        ):

            if str(
                item.get("field1")
            ) == str(
                patient_id
            ):

                patient_records.append({

                    "patient_id":
                        item.get("field1"),

                    "heart_disease":
                        item.get("field2"),

                    "diabetes":
                        item.get("field3"),

                    "brain_tumor":
                        item.get("field4"),

                    "entry_id":
                        item.get("entry_id"),

                    "created_at":
                        item.get("created_at")

                })


        if not patient_records:

            raise HTTPException(
                status_code=404,
                detail=
                    "No AI prediction found for this patient"
            )


        # ----------------------------------------------------
        # LATEST PREDICTION
        # ----------------------------------------------------

        prediction = patient_records[-1]


        # ----------------------------------------------------
        # REPORT DIRECTORY
        # ----------------------------------------------------

        report_directory = "reports"

        os.makedirs(
            report_directory,
            exist_ok=True
        )


        # ----------------------------------------------------
        # PDF FILE
        # ----------------------------------------------------

        file_name = (
            f"DiagaNova_Patient_"
            f"{patient_id}_Report.pdf"
        )


        file_path = os.path.join(
            report_directory,
            file_name
        )


        # ----------------------------------------------------
        # PATIENT DATA
        # ----------------------------------------------------

        patient_data = {

            "patient_id":
                patient.patient_id,

            "name":
                patient.name,

            "age":
                patient.age,

            "gender":
                patient.gender,

            "phone":
                patient.phone,

            "email":
                patient.email

        }


        # ----------------------------------------------------
        # DOCTOR DATA
        # ----------------------------------------------------

        doctor_data = {

            "doctor_id":
                doctor.doctor_id,

            "name":
                doctor.name

        }


        # ----------------------------------------------------
        # GENERATE PDF
        # ----------------------------------------------------

        generate_patient_report(

            file_path=file_path,

            patient=patient_data,

            prediction=prediction,

            doctor=doctor_data,

            clinical_assessment=
                doctor_assessment.clinical_assessment,

            recommendation=
                doctor_assessment.recommendation
        )


        # ----------------------------------------------------
        # SEND EMAIL
        # ----------------------------------------------------

        send_patient_report(

            patient_email=email,

            patient_name=patient.name,

            patient_id=patient.patient_id,

            pdf_path=file_path
        )


        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        return {

            "message":
                "Patient report emailed successfully",

            "patient_id":
                patient.patient_id,

            "email":
                email,

            "file":
                file_name

        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        db.close()
