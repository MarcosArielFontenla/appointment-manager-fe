import { Card } from "../ui/Card";
import { type Turn } from "../TurnCard";

interface MonthViewProps {
    currentDate: Date;
    turns: Turn[];
    onDayClick: (date: Date) => void;
    onTurnClick: (turn: Turn) => void;
}

export const MonthView = ({ currentDate, turns, onDayClick, onTurnClick }: MonthViewProps) => {
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getTurnsForDate = (date: Date | null) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return turns.filter(turn => turn.date === dateStr);
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const days = getDaysInMonth();
    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="bg-card rounded-lg shadow-card p-4">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center font-semibold text-muted-foreground text-sm py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    const dayTurns = getTurnsForDate(date);
                    const isCurrentDay = isToday(date);

                    return (
                        <Card
                            key={index}
                            className={`min-h-24 p-2 cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 ${!date ? "bg-muted/30 cursor-default" : ""
                                } ${isCurrentDay ? "border-2 border-primary" : ""}`}
                            onClick={() => date && onDayClick(date)}
                        >
                            {date && (
                                <>
                                    <div className={`text-sm font-semibold mb-1 ${isCurrentDay ? "text-primary" : "text-foreground"
                                        }`}>
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {dayTurns.slice(0, 2).map((turn) => (
                                            <div
                                                key={turn.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTurnClick(turn);
                                                }}
                                                className={`text-xs p-1 rounded truncate transition-all duration-200 hover:scale-105 ${turn.status === "confirmed"
                                                    ? "bg-success/20 text-success"
                                                    : turn.status === "pending"
                                                        ? "bg-warning/20 text-warning"
                                                        : "bg-destructive/20 text-destructive"
                                                    }`}
                                            >
                                                {turn.time} - {turn.clientName}
                                            </div>
                                        ))}
                                        {dayTurns.length > 2 && (
                                            <div className="text-xs text-muted-foreground text-center">
                                                +{dayTurns.length - 2} más
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
