# MediTrack Clinic - Simple Hospital Patient Records Mobile App

This project is a beginner-friendly mobile app for a school computer project.
It stores and fetches patient records using SQL (SQLite) and shows them in a
clean, mobile-style interface.

## What this app does

- Shows a list of patient records.
- Supports search by:
  - patient name
  - gender
  - symptoms
- Opens a detailed screen with:
  - age
  - gender
  - past treatments
  - allergies
  - medications
  - symptoms
  - phone
  - last visit date

## Technology used (easy to explain)

- **Python**: main programming language.
- **Kivy**: used to create the mobile app UI.
- **SQLite (SQL database)**: stores and fetches patient records.
- **Buildozer**: packages the app into an Android APK.

## SQL table design

The app uses one SQL table called `patients`:

```sql
CREATE TABLE patients (
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
);
```

## Sample database

The app auto-creates and auto-seeds the database (`clinic_records.db`) with
**15 sample patients** the first time it runs.

The seed data is in:

- `clinic_db.py` (`SEED_PATIENTS`)

## Project files

- `main.py` - Kivy app UI + navigation.
- `clinic_db.py` - SQL database logic and seed data.
- `tests/test_clinic_db.py` - basic tests for database behavior.
- `buildozer.spec` - Android APK packaging config.

## Run locally (desktop test)

```bash
python3 -m pip install -r requirements.txt
python3 main.py
```

## Run tests

```bash
python3 -m unittest discover -s tests -p "test_*.py" -v
```

## Build Android APK

### 1) Install system dependencies

```bash
sudo apt-get update
sudo apt-get install -y \
  git zip unzip openjdk-17-jdk python3-pip autoconf libtool pkg-config \
  zlib1g-dev libncurses5-dev libncursesw5-dev libtinfo6 cmake libffi-dev \
  libssl-dev
```

### 2) Install Buildozer

```bash
python3 -m pip install --user buildozer cython
```

### 3) Build debug APK

```bash
~/.local/bin/buildozer android debug
```

After build completes, APK will be available in:

- `bin/meditrackclinic-1.0-arm64-v8a-debug.apk` (name may include ABI based on build tool version)

## How to install the APK on your phone

1. Copy the APK file to your Android phone.
2. Enable "Install unknown apps" for your file manager/browser.
3. Tap the APK and install.
4. Open **MediTrack Clinic**.

## Suggested explanation for your viva/project demo

You can explain this project in 5 simple layers:

1. **Database layer**: SQLite stores patient records in a `patients` table.
2. **Data access layer**: `ClinicDatabase` class runs SQL queries (`SELECT`, `INSERT`).
3. **Search logic**: SQL `LIKE` query filters patients by name/gender/symptoms.
4. **UI layer**: Kivy screens show patient list and detail view.
5. **Packaging**: Buildozer converts Python app into Android APK.
