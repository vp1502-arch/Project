import sqlite3
from pathlib import Path
from typing import Any


SEED_PATIENTS = [
    {
        "full_name": "Aarav Sharma",
        "age": 31,
        "gender": "Male",
        "treatments": "Appendectomy (2023)",
        "allergies": "Penicillin",
        "medications": "Ibuprofen 200mg (as needed)",
        "symptoms": "Mild abdominal pain follow-up",
        "phone": "+91-981000001",
        "last_visit": "2026-09-10",
    },
    {
        "full_name": "Meera Iyer",
        "age": 27,
        "gender": "Female",
        "treatments": "Asthma management plan",
        "allergies": "Dust mites",
        "medications": "Salbutamol inhaler",
        "symptoms": "Occasional wheezing",
        "phone": "+91-981000002",
        "last_visit": "2026-10-02",
    },
    {
        "full_name": "Rohan Verma",
        "age": 45,
        "gender": "Male",
        "treatments": "Type 2 diabetes monitoring",
        "allergies": "None",
        "medications": "Metformin 500mg",
        "symptoms": "Fatigue",
        "phone": "+91-981000003",
        "last_visit": "2026-08-22",
    },
    {
        "full_name": "Sana Khan",
        "age": 36,
        "gender": "Female",
        "treatments": "Hypertension management",
        "allergies": "Sulfa drugs",
        "medications": "Amlodipine 5mg",
        "symptoms": "Headache, dizziness",
        "phone": "+91-981000004",
        "last_visit": "2026-09-29",
    },
    {
        "full_name": "Kabir Singh",
        "age": 52,
        "gender": "Male",
        "treatments": "Cardiac stent follow-up",
        "allergies": "Shellfish",
        "medications": "Aspirin 75mg, Atorvastatin 20mg",
        "symptoms": "Chest tightness (improving)",
        "phone": "+91-981000005",
        "last_visit": "2026-10-11",
    },
    {
        "full_name": "Ananya Patel",
        "age": 19,
        "gender": "Female",
        "treatments": "Migraine treatment",
        "allergies": "None",
        "medications": "Sumatriptan 50mg",
        "symptoms": "Severe headaches",
        "phone": "+91-981000006",
        "last_visit": "2026-10-15",
    },
    {
        "full_name": "Vikram Nair",
        "age": 40,
        "gender": "Male",
        "treatments": "Physiotherapy for knee pain",
        "allergies": "Latex",
        "medications": "Diclofenac gel",
        "symptoms": "Joint stiffness",
        "phone": "+91-981000007",
        "last_visit": "2026-08-30",
    },
    {
        "full_name": "Priya Desai",
        "age": 33,
        "gender": "Female",
        "treatments": "Thyroid disorder review",
        "allergies": "None",
        "medications": "Levothyroxine 75mcg",
        "symptoms": "Weight changes, tiredness",
        "phone": "+91-981000008",
        "last_visit": "2026-09-17",
    },
    {
        "full_name": "Neha Kapoor",
        "age": 29,
        "gender": "Female",
        "treatments": "Dermatitis care",
        "allergies": "Fragrances",
        "medications": "Hydrocortisone cream",
        "symptoms": "Skin irritation",
        "phone": "+91-981000009",
        "last_visit": "2026-10-19",
    },
    {
        "full_name": "Arjun Rao",
        "age": 58,
        "gender": "Male",
        "treatments": "COPD management",
        "allergies": "Smoke",
        "medications": "Tiotropium inhaler",
        "symptoms": "Breathlessness",
        "phone": "+91-981000010",
        "last_visit": "2026-07-28",
    },
    {
        "full_name": "Isha Menon",
        "age": 22,
        "gender": "Female",
        "treatments": "Anemia treatment",
        "allergies": "None",
        "medications": "Ferrous sulfate",
        "symptoms": "Low energy",
        "phone": "+91-981000011",
        "last_visit": "2026-09-04",
    },
    {
        "full_name": "Dev Malhotra",
        "age": 47,
        "gender": "Male",
        "treatments": "Liver function monitoring",
        "allergies": "Alcohol-based syrups",
        "medications": "Ursodeoxycholic acid",
        "symptoms": "Upper abdominal discomfort",
        "phone": "+91-981000012",
        "last_visit": "2026-10-06",
    },
    {
        "full_name": "Tanya Bhatia",
        "age": 34,
        "gender": "Female",
        "treatments": "Postnatal care",
        "allergies": "None",
        "medications": "Calcium + Vitamin D",
        "symptoms": "Back pain",
        "phone": "+91-981000013",
        "last_visit": "2026-10-21",
    },
    {
        "full_name": "Sahil Joshi",
        "age": 61,
        "gender": "Male",
        "treatments": "Chronic kidney disease Stage 2",
        "allergies": "NSAIDs",
        "medications": "Losartan 50mg",
        "symptoms": "Swelling in ankles",
        "phone": "+91-981000014",
        "last_visit": "2026-08-14",
    },
    {
        "full_name": "Riya Gupta",
        "age": 25,
        "gender": "Female",
        "treatments": "Seasonal flu treatment",
        "allergies": "Pollen",
        "medications": "Paracetamol 650mg",
        "symptoms": "Fever, sore throat",
        "phone": "+91-981000015",
        "last_visit": "2026-10-24",
    },
]


class ClinicDatabase:
    def __init__(self, db_path: str = "clinic_records.db") -> None:
        self.db_path = db_path
        self._ensure_parent_dir()
        self._initialize()

    def _ensure_parent_dir(self) -> None:
        parent_dir = Path(self.db_path).parent
        parent_dir.mkdir(parents=True, exist_ok=True)

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _initialize(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS patients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    age INTEGER NOT NULL,
                    gender TEXT NOT NULL,
                    treatments TEXT NOT NULL,
                    allergies TEXT NOT NULL,
                    medications TEXT NOT NULL,
                    symptoms TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    last_visit TEXT NOT NULL
                )
                """
            )
            existing_count = conn.execute("SELECT COUNT(*) FROM patients").fetchone()[0]
            if existing_count == 0:
                self._seed_patients(conn)

    def _seed_patients(self, conn: sqlite3.Connection) -> None:
        conn.executemany(
            """
            INSERT INTO patients (
                full_name, age, gender, treatments, allergies, medications, symptoms, phone, last_visit
            )
            VALUES (
                :full_name, :age, :gender, :treatments, :allergies, :medications, :symptoms, :phone, :last_visit
            )
            """,
            SEED_PATIENTS,
        )
        conn.commit()

    def get_patients(self, query: str = "") -> list[dict[str, Any]]:
        normalized_query = f"%{query.strip().lower()}%"
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT id, full_name, age, gender, last_visit
                FROM patients
                WHERE lower(full_name) LIKE ?
                   OR lower(gender) LIKE ?
                   OR lower(symptoms) LIKE ?
                   OR lower(treatments) LIKE ?
                   OR lower(medications) LIKE ?
                   OR lower(allergies) LIKE ?
                ORDER BY full_name ASC
                """,
                (
                    normalized_query,
                    normalized_query,
                    normalized_query,
                    normalized_query,
                    normalized_query,
                    normalized_query,
                ),
            ).fetchall()
        return [dict(row) for row in rows]

    def get_patient_by_id(self, patient_id: int) -> dict[str, Any] | None:
        with self._connect() as conn:
            row = conn.execute(
                """
                SELECT id, full_name, age, gender, treatments, allergies, medications, symptoms, phone, last_visit
                FROM patients
                WHERE id = ?
                """,
                (patient_id,),
            ).fetchone()
        return dict(row) if row else None
