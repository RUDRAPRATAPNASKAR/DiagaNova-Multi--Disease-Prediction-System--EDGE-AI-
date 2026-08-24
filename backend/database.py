from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text
)

from sqlalchemy.orm import (
    declarative_base,
    sessionmaker
)


# ============================================================
# DATABASE
# ============================================================

DATABASE_URL = "sqlite:///./medi_ai.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


# ============================================================
# PATIENT TABLE
# ============================================================

class Patient(Base):

    __tablename__ = "patients"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    age = Column(
        Integer,
        nullable=True
    )

    gender = Column(
        String,
        nullable=True
    )

    phone = Column(
        String,
        nullable=True
    )

    # --------------------------------------------------------
    # PATIENT EMAIL
    # --------------------------------------------------------

    email = Column(
        String,
        nullable=True
    )

    access_code = Column(
        String,
        unique=True,
        nullable=False
    )


# ============================================================
# DOCTOR TABLE
# ============================================================

class Doctor(Base):

    __tablename__ = "doctors"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    doctor_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )


# ============================================================
# DOCTOR ASSESSMENT TABLE
# ============================================================

class DoctorAssessment(Base):

    __tablename__ = "doctor_assessments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        String,
        index=True,
        nullable=False
    )

    doctor_id = Column(
        String,
        nullable=False
    )

    clinical_assessment = Column(
        Text,
        nullable=False
    )

    recommendation = Column(
        Text,
        nullable=False
    )

    assessment_date = Column(
        String,
        nullable=False
    )


# ============================================================
# CREATE TABLES
# ============================================================

Base.metadata.create_all(
    bind=engine
)