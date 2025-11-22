import { useState } from "react";
import { CalendarView } from "../components/CalendarView";
import { TurnCard, type Turn } from "../components/TurnCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/Dialog";

interface CalendarProps {
    turns: Turn[];
    onEditTurn?: (turn: Turn) => void;
    onCancelTurn?: (id: string) => void;
    onConfirmTurn?: (id: string) => void;
    onNewTurn?: (date?: Date, hour?: number) => void;
}

export const Calendar = ({
    turns,
    onEditTurn,
    onCancelTurn,
    onConfirmTurn,
    onNewTurn,
}: CalendarProps) => {
    const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);

    const handleTurnClick = (turn: Turn) => {
        setSelectedTurn(turn);
    };

    const handleCreateTurn = (date: Date, hour?: number) => {
        if (onNewTurn) {
            onNewTurn(date, hour);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Calendario de Turnos</h1>
                <p className="text-muted-foreground">Visualiza y gestiona todos tus turnos médicos</p>
            </div>

            <CalendarView
                turns={turns}
                onTurnClick={handleTurnClick}
                onCreateTurn={handleCreateTurn}
            />

            {/* Turn Details Dialog */}
            <Dialog open={selectedTurn !== null} onOpenChange={() => setSelectedTurn(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles del Turno</DialogTitle>
                    </DialogHeader>
                    {selectedTurn && (
                        <div className="mt-4">
                            <TurnCard
                                turn={selectedTurn}
                                onEdit={onEditTurn}
                                onCancel={onCancelTurn}
                                onConfirm={onConfirmTurn}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
