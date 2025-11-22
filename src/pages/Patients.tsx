import { useState } from "react";
import { PatientList } from "../components/PatientList";
import { PatientForm } from "../components/PatientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/Dialog";
import { usePatients } from "../hooks/usePatients";
import { useSupabaseTurns } from "../hooks/useSupabaseTurns";
import { TurnCard } from "../components/TurnCard";
import { type Patient, type PatientInsert } from "../types/database.types";
import { Card } from "../components/ui/Card";

export const Patients = () => {
    const { patients, loading, createPatient, updatePatient } = usePatients();
    const { getTurnsByPatient } = useSupabaseTurns();

    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [selectedPatientHistory, setSelectedPatientHistory] = useState<Patient | null>(null);
    const [patientTurns, setPatientTurns] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const handleNewPatient = () => {
        setEditingPatient(null);
        setShowForm(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setEditingPatient(patient);
        setShowForm(true);
    };

    const handleSubmitPatient = async (data: PatientInsert) => {
        if (editingPatient) {
            const success = await updatePatient(editingPatient.id, data);
            if (success) {
                setShowForm(false);
                setEditingPatient(null);
            }
        } else {
            const newPatient = await createPatient(data);
            if (newPatient) {
                setShowForm(false);
            }
        }
    };

    const handleViewHistory = async (patient: Patient) => {
        setSelectedPatientHistory(patient);
        setLoadingHistory(true);
        const turns = await getTurnsByPatient(patient.id);
        setPatientTurns(turns);
        setLoadingHistory(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Pacientes</h1>
                <p className="text-muted-foreground">Administra la información de tus pacientes</p>
            </div>

            {showForm ? (
                <PatientForm
                    onSubmit={handleSubmitPatient}
                    initialData={editingPatient || undefined}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingPatient(null);
                    }}
                />
            ) : (
                <PatientList
                    patients={patients}
                    loading={loading}
                    onEdit={handleEditPatient}
                    onViewHistory={handleViewHistory}
                    onNewPatient={handleNewPatient}
                />
            )}

            {/* Patient History Dialog */}
            <Dialog
                open={selectedPatientHistory !== null}
                onOpenChange={() => {
                    setSelectedPatientHistory(null);
                    setPatientTurns([]);
                }}
            >
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Historial de {selectedPatientHistory?.first_name} {selectedPatientHistory?.last_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        {loadingHistory ? (
                            <p className="text-muted-foreground text-center py-8">Cargando historial...</p>
                        ) : patientTurns.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-muted-foreground">Este paciente aún no tiene turnos registrados</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Total de turnos: {patientTurns.length}
                                </p>
                                <div className="grid grid-cols-1 gap-4">
                                    {patientTurns.map((turn) => (
                                        <TurnCard
                                            key={turn.id}
                                            turn={{
                                                ...turn,
                                                clientName: `${selectedPatientHistory?.first_name} ${selectedPatientHistory?.last_name}`,
                                                clientPhone: selectedPatientHistory?.phone || '',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
