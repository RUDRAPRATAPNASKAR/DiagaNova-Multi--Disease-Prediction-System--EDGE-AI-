from reportlab.lib.pagesizes import A4

from reportlab.lib import colors

from reportlab.lib.styles import getSampleStyleSheet

from reportlab.lib.styles import ParagraphStyle

from reportlab.lib.enums import TA_CENTER

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib.units import mm


# ============================================================
# GENERATE DIAGANOVA PDF REPORT
# ============================================================

def generate_patient_report(
    file_path,
    patient,
    prediction,
    doctor,
    clinical_assessment,
    recommendation
):

    # --------------------------------------------------------
    # DOCUMENT
    # --------------------------------------------------------

    document = SimpleDocTemplate(

        file_path,

        pagesize=A4,

        rightMargin=18 * mm,

        leftMargin=18 * mm,

        topMargin=18 * mm,

        bottomMargin=18 * mm

    )


    # --------------------------------------------------------
    # STYLES
    # --------------------------------------------------------

    styles = getSampleStyleSheet()


    title_style = ParagraphStyle(

        "TitleStyle",

        parent=styles["Title"],

        fontSize=22,

        leading=26,

        alignment=TA_CENTER,

        spaceAfter=8

    )


    subtitle_style = ParagraphStyle(

        "SubtitleStyle",

        parent=styles["Normal"],

        fontSize=10,

        leading=14,

        alignment=TA_CENTER,

        textColor=colors.grey,

        spaceAfter=20

    )


    heading_style = ParagraphStyle(

        "HeadingStyle",

        parent=styles["Heading2"],

        fontSize=14,

        leading=18,

        spaceBefore=12,

        spaceAfter=8

    )


    body_style = ParagraphStyle(

        "BodyStyle",

        parent=styles["BodyText"],

        fontSize=10,

        leading=15

    )


    # --------------------------------------------------------
    # STORY
    # --------------------------------------------------------

    story = []


    # --------------------------------------------------------
    # HEADER
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "DiagaNova",
            title_style
        )

    )


    story.append(

        Paragraph(

            "DiagaNova AI-Assisted Health Screening Report",

            subtitle_style

        )

    )


    # --------------------------------------------------------
    # PATIENT INFORMATION
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "Patient Information",
            heading_style
        )

    )


    patient_data = [

        [
            "Patient ID",
            str(patient.get("patient_id", "N/A"))
        ],

        [
            "Patient Name",
            str(patient.get("name", "N/A"))
        ],

        [
            "Age",
            str(patient.get("age", "N/A"))
        ],

        [
            "Gender",
            str(patient.get("gender", "N/A"))
        ],

        [
            "Phone",
            str(patient.get("phone", "N/A"))
        ]

    ]


    patient_table = Table(

        patient_data,

        colWidths=[
            45 * mm,
            125 * mm
        ]

    )


    patient_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.lightgrey
            ),

            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP"
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                7
            )

        ])

    )


    story.append(
        patient_table
    )


    story.append(
        Spacer(1, 10)
    )


    # --------------------------------------------------------
    # AI SCREENING RESULTS
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "AI Screening Results",
            heading_style
        )

    )


    heart = prediction.get(
        "heart_disease",
        "N/A"
    )


    diabetes = prediction.get(
        "diabetes",
        "N/A"
    )


    brain_tumor = prediction.get(
        "brain_tumor",
        "N/A"
    )


    result_data = [

        [
            "Condition",
            "AI Screening Result"
        ],

        [
            "Heart Disease",
            prediction_text(heart)
        ],

        [
            "Diabetes",
            prediction_text(diabetes)
        ],

        [
            "Brain Tumor",
            prediction_text(brain_tumor)
        ]

    ]


    result_table = Table(

        result_data,

        colWidths=[
            85 * mm,
            85 * mm
        ]

    )


    result_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.lightgrey
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                7
            )

        ])

    )


    story.append(
        result_table
    )


    # --------------------------------------------------------
    # ASSESSMENT INFORMATION
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "Assessment Information",
            heading_style
        )

    )


    assessment_data = [

        [
            "Assessment ID",
            str(
                prediction.get(
                    "entry_id",
                    "N/A"
                )
            )
        ],

        [
            "Assessment Date",
            str(
                prediction.get(
                    "created_at",
                    "N/A"
                )
            )
        ]

    ]


    assessment_table = Table(

        assessment_data,

        colWidths=[
            45 * mm,
            125 * mm
        ]

    )


    assessment_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.lightgrey
            ),

            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                7
            )

        ])

    )


    story.append(
        assessment_table
    )


    # --------------------------------------------------------
    # DOCTOR INFORMATION
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "Doctor Information",
            heading_style
        )

    )


    doctor_name = doctor.get(
        "name",
        "N/A"
    )


    doctor_id = doctor.get(
        "doctor_id",
        "N/A"
    )


    doctor_data = [

        [
            "Doctor ID",
            str(doctor_id)
        ],

        [
            "Doctor Name",
            str(doctor_name)
        ]

    ]


    doctor_table = Table(

        doctor_data,

        colWidths=[
            45 * mm,
            125 * mm
        ]

    )


    doctor_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.lightgrey
            ),

            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                7
            )

        ])

    )


    story.append(
        doctor_table
    )


    # --------------------------------------------------------
    # CLINICAL ASSESSMENT
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "Doctor's Clinical Assessment",
            heading_style
        )

    )


    story.append(

        Paragraph(

            clinical_assessment,

            body_style

        )

    )


    # --------------------------------------------------------
    # RECOMMENDATION
    # --------------------------------------------------------

    story.append(

        Paragraph(
            "Doctor's Recommendation",
            heading_style
        )

    )


    story.append(

        Paragraph(

            recommendation,

            body_style

        )

    )


    # --------------------------------------------------------
    # DISCLAIMER
    # --------------------------------------------------------

    story.append(
        Spacer(1, 15)
    )


    story.append(

        Paragraph(
            "Clinical Disclaimer",
            heading_style
        )

    )


    disclaimer = (

        "DiagaNova provides AI-assisted screening "
        "results for decision-support purposes. "
        "The results presented in this report "
        "should not be considered a substitute "
        "for professional medical diagnosis, "
        "clinical examination, or treatment. "
        "Final clinical decisions must be made "
        "by a qualified healthcare professional."

    )


    story.append(

        Paragraph(
            disclaimer,
            body_style
        )

    )


    # --------------------------------------------------------
    # BUILD PDF
    # --------------------------------------------------------

    document.build(
        story
    )


# ============================================================
# CONVERT PREDICTION VALUE TO TEXT
# ============================================================

def prediction_text(value):

    value = str(value).strip().lower()


    if value in [
        "1",
        "true",
        "yes",
        "detected",
        "positive"
    ]:

        return "Detected"


    if value in [
        "0",
        "false",
        "no",
        "normal",
        "negative"
    ]:

        return "Normal"


    return str(value)