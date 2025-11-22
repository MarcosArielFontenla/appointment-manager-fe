import { useState } from "react";
import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";
import { TurnsList } from "../components/TurnList";
import { AppointmentForm } from "../components/AppointmentForm";
import { Calendar } from "./Calendar";
import { type Turn } from "../components/TurnCard";
import { useToast } from "../hooks/useToast";

// Sample data for demonstration
const sampleTurns: Turn[] = [
  {
    id: "1",
    clientName: "María González",
    clientPhone: "+54 9 11 1234-5678",
    service: "Consulta General",
    date: new Date().toISOString().split('T')[0], // Today
    time: "10:00",
    status: "confirmed",
    notes: "Primera consulta, traer estudios previos"
  },
  {
    id: "2",
    clientName: "Juan Pérez",
    clientPhone: "+54 9 11 2345-6789",
    service: "Control de Rutina",
    date: new Date().toISOString().split('T')[0], // Today
    time: "11:30",
    status: "pending",
    notes: "Control mensual"
  },
  {
    id: "3",
    clientName: "Ana Rodríguez",
    clientPhone: "+54 9 11 3456-7890",
    service: "Consulta Especializada",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: "09:00",
    status: "confirmed",
    notes: "Seguimiento post-tratamiento"
  },
  {
    id: "4",
    clientName: "Carlos López",
    clientPhone: "+54 9 11 4567-8901",
    service: "Urgencia",
    date: new Date().toISOString().split('T')[0], // Today
    time: "15:00",
    status: "cancelled",
    notes: "Cancelado por el paciente"
  },
  {
    id: "5",
    clientName: "Laura Martínez",
    clientPhone: "+54 9 11 5678-9012",
    service: "Procedimiento",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    time: "14:00",
    status: "confirmed",
    notes: "Procedimiento menor, ayuno de 8 horas"
  }
];

type ViewType = "dashboard" | "list" | "form" | "calendar";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [turns, setTurns] = useState<Turn[]>(sampleTurns);
  const [editingTurn, setEditingTurn] = useState<Turn | null>(null);
  const { toast } = useToast();

  const handleCreateTurn = (newTurnData: Omit<Turn, "id">) => {
    const newTurn: Turn = {
      ...newTurnData,
      id: Date.now().toString(),
    };

    setTurns(prev => [...prev, newTurn]);
    setCurrentView("dashboard");
    setEditingTurn(null);

    toast({
      title: "Turno creado",
      description: `Turno para ${newTurn.clientName} el ${newTurn.date} a las ${newTurn.time}`,
    });
  };

  const handleEditTurn = (turn: Turn) => {
    setEditingTurn(turn);
    setCurrentView("form");
  };

  const handleUpdateTurn = (updatedTurnData: Omit<Turn, "id">) => {
    if (editingTurn) {
      const updatedTurn: Turn = {
        ...updatedTurnData,
        id: editingTurn.id,
      };

      setTurns(prev => prev.map(turn =>
        turn.id === editingTurn.id ? updatedTurn : turn
      ));
      setCurrentView("dashboard");
      setEditingTurn(null);

      toast({
        title: "Turno actualizado",
        description: `Turno de ${updatedTurn.clientName} actualizado correctamente`,
      });
    }
  };

  const handleCancelTurn = (id: string) => {
    setTurns(prev => prev.map(turn =>
      turn.id === id ? { ...turn, status: "cancelled" as const } : turn
    ));

    const cancelledTurn = turns.find(turn => turn.id === id);
    toast({
      title: "Turno cancelado",
      description: `Turno de ${cancelledTurn?.clientName} cancelado`,
      variant: "destructive",
    });
  };

  const handleConfirmTurn = (id: string) => {
    setTurns(prev => prev.map(turn =>
      turn.id === id ? { ...turn, status: "confirmed" as const } : turn
    ));

    const confirmedTurn = turns.find(turn => turn.id === id);
    toast({
      title: "Turno confirmado",
      description: `Turno de ${confirmedTurn?.clientName} confirmado`,
    });
  };

  const handleNewTurn = (_date?: Date, _hour?: number) => {
    setEditingTurn(null);
    setCurrentView("form");
    // TODO: Pre-fill form with date and hour if provided
  };

  const handleSubmitForm = (turnData: Omit<Turn, "id">) => {
    if (editingTurn) {
      handleUpdateTurn(turnData);
    } else {
      handleCreateTurn(turnData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        businessName="Consultorio Médico Demo"
      />

      <main className="container mx-auto px-6 pb-8">
        {currentView === "dashboard" && (
          <Dashboard
            turns={turns}
            onEditTurn={handleEditTurn}
            onCancelTurn={handleCancelTurn}
            onConfirmTurn={handleConfirmTurn}
            onNewTurn={handleNewTurn}
          />
        )}

        {currentView === "list" && (
          <TurnsList
            turns={turns}
            onEditTurn={handleEditTurn}
            onCancelTurn={handleCancelTurn}
            onConfirmTurn={handleConfirmTurn}
          />
        )}

        {currentView === "calendar" && (
          <Calendar
            turns={turns}
            onEditTurn={handleEditTurn}
            onCancelTurn={handleCancelTurn}
            onConfirmTurn={handleConfirmTurn}
            onNewTurn={handleNewTurn}
          />
        )}

        {currentView === "form" && (
          <div className="max-w-2xl mx-auto">
            <AppointmentForm
              onSubmit={handleSubmitForm}
              initialData={editingTurn || undefined}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;