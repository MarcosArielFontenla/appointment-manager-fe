import { useState } from "react";
import { CalendarNavigation, type CalendarViewType } from "./calendar/CalendarNavigation";
import { MonthView } from "./calendar/MonthView";
import { WeekView } from "./calendar/WeekView";
import { DayView } from "./calendar/DayView";
import { type Turn } from "./TurnCard";

interface CalendarViewProps {
    turns: Turn[];
    onTurnClick: (turn: Turn) => void;
    onCreateTurn: (date: Date, hour?: number) => void;
}

export const CalendarView = ({ turns, onTurnClick, onCreateTurn }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarViewType>("month");

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (view === "month") {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (view === "week") {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (view === "month") {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === "week") {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setView("day");
    };

    const handleTimeSlotClick = (date: Date, hour: number) => {
        onCreateTurn(date, hour);
    };

    const handleDayTimeSlotClick = (hour: number) => {
        onCreateTurn(currentDate, hour);
    };

    return (
        <div className="space-y-6">
            <CalendarNavigation
                currentDate={currentDate}
                view={view}
                onViewChange={setView}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToday={handleToday}
            />

            {view === "month" && (
                <MonthView
                    currentDate={currentDate}
                    turns={turns}
                    onDayClick={handleDayClick}
                    onTurnClick={onTurnClick}
                />
            )}

            {view === "week" && (
                <WeekView
                    currentDate={currentDate}
                    turns={turns}
                    onTimeSlotClick={handleTimeSlotClick}
                    onTurnClick={onTurnClick}
                />
            )}

            {view === "day" && (
                <DayView
                    currentDate={currentDate}
                    turns={turns}
                    onTimeSlotClick={handleDayTimeSlotClick}
                    onTurnClick={onTurnClick}
                />
            )}
        </div>
    );
};
