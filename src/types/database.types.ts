export interface Patient {
    id: string;
    dni: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string;
    birth_date: string | null;
    health_insurance: string | null;
    allergies: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Turn {
    id: string;
    patient_id: string;
    service: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    status: 'confirmed' | 'pending' | 'cancelled';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// Helper type for inserts (omit auto-generated fields)
export type PatientInsert = Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
export type PatientUpdate = Partial<PatientInsert>;

export type TurnInsert = Omit<Turn, 'id' | 'created_at' | 'updated_at'>;
export type TurnUpdate = Partial<TurnInsert>;

// Turn with populated patient data
export interface TurnWithPatient extends Turn {
    patient: Patient;
}
