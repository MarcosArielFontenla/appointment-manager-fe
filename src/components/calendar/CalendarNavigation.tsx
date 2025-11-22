import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export type CalendarViewType = "month" | "week" | "day";

interface CalendarNavigationProps {
    currentDate: Date;
    view: CalendarViewType;
    onViewChange: (view: CalendarViewType) => void;
    onPrevious: () => void;
    onNext: () => void;
    onToday: () => void;
}

export const CalendarNavigation = ({
    currentDate,
    view,
    onViewChange,
    onPrevious,
    onNext,
    onToday,
}: CalendarNavigationProps) => {
    const getDateTitle = () => {
        const options: Intl.DateTimeFormatOptions =
            view === "month"
                ? { month: "long", year: "numeric" }
                : view === "week"
                    ? { month: "long", day: "numeric", year: "numeric" }
                    : { weekday: "long", month: "long", day: "numeric", year: "numeric" };

        return currentDate.toLocaleDateString("es-ES", options);
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToday}
                    className="transition-all duration-300 hover:scale-105"
                >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Hoy
                </Button>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onPrevious}
                        className="transition-all duration-300 hover:scale-105"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onNext}
                        className="transition-all duration-300 hover:scale-105"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <h2 className="text-2xl font-bold text-primary capitalize ml-2">
                    {getDateTitle()}
                </h2>
            </div>

            {/* View Selector */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <Button
                    variant={view === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange("month")}
                    className={`transition-all duration-300 ${view === "month"
                            ? "bg-gradient-primary shadow-button"
                            : "hover:bg-white/20"
                        }`}
                >
                    Mes
                </Button>
                <Button
                    variant={view === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange("week")}
                    className={`transition-all duration-300 ${view === "week"
                            ? "bg-gradient-primary shadow-button"
                            : "hover:bg-white/20"
                        }`}
                >
                    Semana
                </Button>
                <Button
                    variant={view === "day" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange("day")}
                    className={`transition-all duration-300 ${view === "day"
                            ? "bg-gradient-primary shadow-button"
                            : "hover:bg-white/20"
                        }`}
                >
                    Día
                </Button>
            </div>
        </div>
    );
};
