import tempfile
import unittest
from pathlib import Path

from clinic_db import ClinicDatabase, SEED_PATIENTS


class ClinicDatabaseTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_clinic_records.db"
        self.database = ClinicDatabase(str(self.db_path))

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_database_is_seeded_with_sample_records(self) -> None:
        patients = self.database.get_patients()
        self.assertEqual(len(patients), len(SEED_PATIENTS))

    def test_search_returns_expected_patient(self) -> None:
        results = self.database.get_patients("migraine")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["full_name"], "Ananya Patel")

    def test_get_patient_by_id_returns_full_record(self) -> None:
        patients = self.database.get_patients("Aarav")
        self.assertEqual(len(patients), 1)
        patient_id = patients[0]["id"]

        patient = self.database.get_patient_by_id(patient_id)
        self.assertIsNotNone(patient)
        self.assertEqual(patient["full_name"], "Aarav Sharma")
        self.assertEqual(patient["allergies"], "Penicillin")


if __name__ == "__main__":
    unittest.main()
