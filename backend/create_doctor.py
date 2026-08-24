from database import SessionLocal, Doctor
from main import hash_password


# ============================================================
# DOCTOR DETAILS
# ============================================================

doctor_id = "DR-002"

doctor_name = "DR. Koushik Chatterjee"

doctor_password = "123456789"


# ============================================================
# DATABASE CONNECTION
# ============================================================

db = SessionLocal()


try:

    # ========================================================
    # CHECK WHETHER DOCTOR ALREADY EXISTS
    # ========================================================

    existing_doctor = db.query(
        Doctor
    ).filter(
        Doctor.doctor_id == doctor_id
    ).first()


    if existing_doctor:

        print()
        print("================================")
        print("DOCTOR ALREADY EXISTS")
        print("================================")
        print("Doctor ID:", doctor_id)
        print("Doctor Name:", existing_doctor.name)
        print("================================")


    else:

        # ====================================================
        # CREATE NEW DOCTOR
        # ====================================================

        doctor = Doctor(

            doctor_id=doctor_id,

            name=doctor_name,

            password_hash=hash_password(
                doctor_password
            )
        )


        # ====================================================
        # SAVE TO DATABASE
        # ====================================================

        db.add(doctor)

        db.commit()

        db.refresh(doctor)


        print()
        print("================================")
        print("DOCTOR CREATED SUCCESSFULLY")
        print("================================")
        print("Doctor ID:", doctor_id)
        print("Doctor Name:", doctor_name)
        print("Password:", doctor_password)
        print("================================")


finally:

    db.close()