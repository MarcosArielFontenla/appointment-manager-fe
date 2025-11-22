import { useState } from "react";
import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";
import { TurnsList } from "../components/TurnList";
import { AppointmentForm } from "../components/AppointmentForm";
import { Calendar } from "./Calendar";
import { Patients } from "./Patients";
import { useSupabaseTurns } from "../hooks/useSupabaseTurns";
import { usePatients } from "../hooks/usePatients";
import { type TurnInsert } from "../types/database.types";

type ViewType = "dashboard" | "list" | "form" | "calendar" | "patients";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [editingTurnId, setEditingTurnId] = useState<string | null>(null);

  // Supabase hooks
  const { turns, loading: turnsLoading, createTurn, updateTurn, updateTurnStatus } = useSupabaseTurns();
  const { patients, loading: patientsLoading, createPatient } = usePatients();

  const editingTurn = turns.find(t => t.id === editingTurnId) || null;

  const handleCreateTurn = async (turnData: TurnInsert) => {
    const newTurn = await createTurn(turnData);
    if (newTurn) {
      setCurrentView("dashboard");
    }
  };

  const handleEditTurn = (turnId: string) => {
    setEditingTurnId(turnId);
    setCurrentView("form");
  };

  const handleUpdateTurn = async (turnData: TurnInsert) => {
    if (editingTurnId) {
      const success = await updateTurn(editingTurnId, turnData);
      if (success) {
        setCurrentView("dashboard");
        setEditingTurnId(null);
      }
    }
  };

  const handleCancelTurn = async (id: string) => {
    await updateTurnStatus(id, "cancelled");
  };

  const handleConfirmTurn = async (id: string) => {
    await updateTurnStatus(id, "confirmed");
  };

  const handleNewTurn = (_date?: Date, _hour?: number) => {
    setEditingTurnId(null);
    setCurrentView("form");
    // TODO: Pre-fill form with date and hour if provided
  };

  const handleSubmitForm = async (turnData: TurnInsert) => {
    if (editingTurnId) {
      await handleUpdateTurn(turnData);
    } else {
      await handleCreateTurn(turnData);
    }
  };

  // Convert TurnWithPatient to old Turn format for compatibility
  const legacyTurns = turns.map(turn => ({
    id: turn.id,
    clientName: `${turn.patient.first_name} ${turn.patient.last_name}`,
    clientPhone: turn.patient.phone,
    service: turn.service,
    date: turn.date,
    time: turn.time,
    status: turn.status,
    notes: turn.notes || "",
  }));

  const loading = turnsLoading || patientsLoading;

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        businessName="Consultorio Médico Demo"
      />

      <main className="container mx-auto px-6 pb-8">
        {loading && currentView !== "patients" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        )}

        {!loading && currentView === "dashboard" && (
          <Dashboard
            turns={legacyTurns}
            onEditTurn={(turn) => handleEditTurn(turn.id)}
            onCancelTurn={handleCancelTurn}
            onConfirmTurn={handleConfirmTurn}
            onNewTurn={handleNewTurn}
          />
        )}

        {!loading && currentView === "list" && (
          <TurnsList
            turns={legacyTurns}
            onEditTurn={(turn) => handleEditTurn(turn.id)}
            onCancelTurn={handleCancelTurn}
            onConfirmTurn={handleConfirmTurn}
          />
        )}

        {!loading && currentView === "calendar" && (
          <Calendar
            turns={legacyTurns}
            onEditTurn={(turn) => handleEditTurn(turn.id)}
            onCancelTurn={handleCancelTurn}
            onConfirmTurn={handleConfirmTurn}
            onNewTurn={handleNewTurn}
          />
        )}

        {currentView === "patients" && (
          <Patients />
        )}

        {currentView === "form" && (
          <div className="max-w-2xl mx-auto">
            <AppointmentForm
              onSubmit={handleSubmitForm}
              onCreatePatient={createPatient}
              initialData={editingTurn || undefined}
              patients={patients}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;