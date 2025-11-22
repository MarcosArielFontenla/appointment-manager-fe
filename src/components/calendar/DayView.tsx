import { Card } from "../ui/Card";
import { type Turn } from "../TurnCard";
import { Clock, User, FileText } from "lucide-react";

interface DayViewProps {
    currentDate: Date;
    turns: Turn[];
    onTimeSlotClick: (hour: number) => void;
    onTurnClick: (turn: Turn) => void;
}

export const DayView = ({ currentDate, turns, onTimeSlotClick, onTurnClick }: DayViewProps) => {
    const getTurnsForDate = () => {
        const dateStr = currentDate.toISOString().split('T')[0];
        return turns.filter(turn => turn.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
    };

    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00
    const dayTurns = getTurnsForDate();

    return (
        <div className="bg-card rounded-lg shadow-card p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                    {currentDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </h3>
                <p className="text-muted-foreground">
                    {dayTurns.length} turno{dayTurns.length !== 1 ? "s" : ""} programado{dayTurns.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="space-y-2">
                {hours.map((hour) => {
                    const hourTurns = dayTurns.filter(turn => {
                        const turnHour = parseInt(turn.time.split(":")[0]);
                        return turnHour === hour;
                    });

                    return (
                        <div key={hour} className="flex gap-4">
                            {/* Time column */}
                            <div className="w-20 flex-shrink-0 pt-2">
                                <span className="text-sm font-semibold text-muted-foreground">
                                    {hour.toString().padStart(2, "0")}:00
                                </span>
                            </div>

                            {/* Content column */}
                            <div className="flex-1">
                                {hourTurns.length > 0 ? (
                                    <div className="space-y-2">
                                        {hourTurns.map((turn) => (
                                            <Card
                                                key={turn.id}
                                                onClick={() => onTurnClick(turn)}
                                                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 border-l-4 ${turn.status === "confirmed"
                                                    ? "border-l-success bg-success/5"
                                                    : turn.status === "pending"
                                                        ? "border-l-warning bg-warning/5"
                                                        : "border-l-destructive bg-destructive/5"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-primary" />
                                                            <span className="font-semibold text-lg">{turn.time}</span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${turn.status === "confirmed"
                                                                ? "bg-success text-success-foreground"
                                                                : turn.status === "pending"
                                                                    ? "bg-warning text-warning-foreground"
                                                                    : "bg-destructive text-destructive-foreground"
                                                                }`}>
                                                                {turn.status === "confirmed" ? "Confirmado" : turn.status === "pending" ? "Pendiente" : "Cancelado"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">{turn.clientName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground">{turn.service}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => onTimeSlotClick(hour)}
                                        className="min-h-16 border-2 border-dashed border-muted rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                    >
                                        <span className="text-sm text-muted-foreground">Click para crear turno</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
