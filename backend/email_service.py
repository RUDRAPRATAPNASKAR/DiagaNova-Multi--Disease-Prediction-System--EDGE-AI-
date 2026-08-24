import os
import smtplib

from email.message import EmailMessage

from dotenv import load_dotenv


load_dotenv()


EMAIL_ADDRESS = os.getenv(
    "EMAIL_ADDRESS"
)

EMAIL_APP_PASSWORD = os.getenv(
    "EMAIL_APP_PASSWORD"
)


def send_patient_report(
    patient_email,
    patient_name,
    patient_id,
    pdf_path
):

    if not EMAIL_ADDRESS:

        raise ValueError(
            "EMAIL_ADDRESS is missing from .env"
        )


    if not EMAIL_APP_PASSWORD:

        raise ValueError(
            "EMAIL_APP_PASSWORD is missing from .env"
        )


    if not os.path.exists(pdf_path):

        raise FileNotFoundError(
            f"PDF report not found: {pdf_path}"
        )


    message = EmailMessage()


    message["From"] = EMAIL_ADDRESS

    message["To"] = patient_email

    message["Subject"] = (
        f"DiagaNova Patient Report - Patient {patient_id}"
    )


    message.set_content(

        f"""Dear {patient_name},

Please find attached your DiagaNova health screening report.

Patient ID: {patient_id}

The attached PDF contains the AI-assisted screening results
and the doctor's clinical assessment and recommendation.


Regards,

DiagaNova Team
AI-Assisted Health Screening System

Clinical Disclaimer:

This report is intended for AI-assisted screening and
decision-support purposes. It is not a substitute for
professional medical diagnosis or clinical examination. 
The pdf Generated is reviewed by your registered doctor. 
"""
    )


    with open(
        pdf_path,
        "rb"
    ) as pdf_file:

        pdf_data = pdf_file.read()


    message.add_attachment(

        pdf_data,

        maintype="application",

        subtype="pdf",

        filename=os.path.basename(
            pdf_path
        )

    )


    with smtplib.SMTP(
        "smtp.gmail.com",
        587
    ) as smtp:

        smtp.ehlo()

        smtp.starttls()

        smtp.ehlo()

        smtp.login(
            EMAIL_ADDRESS,
            EMAIL_APP_PASSWORD
        )

        smtp.send_message(
            message
        )


    return True