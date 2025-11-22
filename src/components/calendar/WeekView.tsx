import { type Turn } from "../TurnCard";

interface WeekViewProps {
    currentDate: Date;
    turns: Turn[];
    onTimeSlotClick: (date: Date, hour: number) => void;
    onTurnClick: (turn: Turn) => void;
}

export const WeekView = ({ currentDate, turns, onTimeSlotClick, onTurnClick }: WeekViewProps) => {
    const getWeekDays = () => {
        const week: Date[] = [];
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day; // Adjust to Sunday
        startOfWeek.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            week.push(date);
        }

        return week;
    };

    const getTurnsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return turns.filter(turn => turn.date === dateStr);
    };

    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00
    const weekDays = getWeekDays();
    const today = new Date().toDateString();

    return (
        <div className="bg-card rounded-lg shadow-card overflow-hidden">
            {/* Header with days */}
            <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
                <div className="p-3 border-r border-border">
                    <span className="text-sm font-semibold text-muted-foreground">Hora</span>
                </div>
                {weekDays.map((date, index) => {
                    const isToday = date.toDateString() === today;
                    return (
                        <div
                            key={index}
                            className={`p-3 text-center border-r border-border last:border-r-0 ${isToday ? "bg-primary/10" : ""
                                }`}
                        >
                            <div className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                                {date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()}
                            </div>
                            <div className={`text-lg font-bold mt-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time slots */}
            <div className="overflow-y-auto max-h-[600px]">
                {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b border-border min-h-20">
                        <div className="p-3 border-r border-border bg-muted/30">
                            <span className="text-sm font-medium text-muted-foreground">
                                {hour.toString().padStart(2, "0")}:00
                            </span>
                        </div>
                        {weekDays.map((date, dayIndex) => {
                            const dayTurns = getTurnsForDate(date).filter(turn => {
                                const turnHour = parseInt(turn.time.split(":")[0]);
                                return turnHour === hour;
                            });

                            return (
                                <div
                                    key={dayIndex}
                                    className="p-2 border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => onTimeSlotClick(date, hour)}
                                >
                                    <div className="space-y-1">
                                        {dayTurns.map((turn) => (
                                            <div
                                                key={turn.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTurnClick(turn);
                                                }}
                                                className={`text-xs p-2 rounded cursor-pointer transition-all duration-200 hover:scale-105 ${turn.status === "confirmed"
                                                    ? "bg-success text-success-foreground"
                                                    : turn.status === "pending"
                                                        ? "bg-warning text-warning-foreground"
                                                        : "bg-destructive text-destructive-foreground"
                                                    }`}
                                            >
                                                <div className="font-semibold">{turn.time}</div>
                                                <div className="truncate">{turn.clientName}</div>
                                                <div className="truncate text-[10px] opacity-80">{turn.service}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
