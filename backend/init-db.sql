-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  phone VARCHAR(20),
  address TEXT,
  avatar VARCHAR(255),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "medicalRecordNumber" VARCHAR(50) NOT NULL UNIQUE,
  "dateOfBirth" DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  "bloodType" VARCHAR(10),
  allergies TEXT,
  "medicalHistory" TEXT,
  insurance VARCHAR(255),
  "emergencyContact" VARCHAR(100),
  "emergencyPhone" VARCHAR(20),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "patientId" UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "doctorId" UUID REFERENCES users(id),
  "visitDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  department VARCHAR(100),
  reason TEXT,
  symptoms TEXT,
  "clinicalExamination" TEXT,
  diagnosis TEXT,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "medicalRecordId" UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  "patientId" UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "medicationName" VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  quantity INTEGER,
  unit VARCHAR(50),
  frequency VARCHAR(100),
  duration VARCHAR(100),
  route VARCHAR(50),
  instructions TEXT,
  "prescribedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiryDate" DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lab_tests table
CREATE TABLE IF NOT EXISTS lab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "medicalRecordId" UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  "patientId" UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "testName" VARCHAR(255) NOT NULL,
  "testCode" VARCHAR(50),
  "orderedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "resultDate" DATE,
  "resultValue" TEXT,
  "normalRange" VARCHAR(100),
  unit VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'abnormal')),
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_patients_userId ON patients("userId");
CREATE INDEX idx_medical_records_patientId ON medical_records("patientId");
CREATE INDEX idx_medical_records_doctorId ON medical_records("doctorId");
CREATE INDEX idx_prescriptions_patientId ON prescriptions("patientId");
CREATE INDEX idx_lab_tests_patientId ON lab_tests("patientId");

-- Insert sample data
-- Insert admin user
INSERT INTO users (email, password, "firstName", "lastName", role) 
VALUES ('admin@qlba.local', '$2a$10$...', 'Admin', 'System', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample doctor
INSERT INTO users (email, password, "firstName", "lastName", role, phone) 
VALUES ('doctor@qlba.local', '$2a$10$...', 'Nguyễn', 'Văn A', 'doctor', '0901234567')
ON CONFLICT DO NOTHING;

-- Insert sample patient
INSERT INTO users (email, password, "firstName", "lastName", role, phone) 
VALUES ('patient@qlba.local', '$2a$10$...', 'Trần', 'Văn B', 'patient', '0987654321')
ON CONFLICT DO NOTHING;
