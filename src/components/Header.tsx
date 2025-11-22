import { Button } from "../components/ui/Button";
import { Calendar, Plus, List, User } from "lucide-react";

interface HeaderProps {
  currentView: "dashboard" | "list" | "form" | "calendar" | "patients";
  onViewChange: (view: "dashboard" | "list" | "form" | "calendar" | "patients") => void;
  businessName?: string;
}

export const Header = ({ currentView, onViewChange, businessName = "Mi Negocio" }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary shadow-elegant border-0 mb-8">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">
              Gestor de Turnos
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              {businessName}
            </p>
          </div>

          <nav className="flex gap-2 flex-wrap">
            <Button
              variant={currentView === "dashboard" ? "secondary" : "ghost"}
              onClick={() => onViewChange("dashboard")}
              className={`transition-all duration-300 hover:scale-105 ${currentView === "dashboard"
                  ? "shadow-button"
                  : "text-primary-foreground hover:bg-white/20 hover:text-white"
                }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Dashboard
            </Button>

            <Button
              variant={currentView === "calendar" ? "secondary" : "ghost"}
              onClick={() => onViewChange("calendar")}
              className={`transition-all duration-300 hover:scale-105 ${currentView === "calendar"
                  ? "shadow-button"
                  : "text-primary-foreground hover:bg-white/20 hover:text-white"
                }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendario
            </Button>

            <Button
              variant={currentView === "patients" ? "secondary" : "ghost"}
              onClick={() => onViewChange("patients")}
              className={`transition-all duration-300 hover:scale-105 ${currentView === "patients"
                  ? "shadow-button"
                  : "text-primary-foreground hover:bg-white/20 hover:text-white"
                }`}
            >
              <User className="h-4 w-4 mr-2" />
              Pacientes
            </Button>

            <Button
              variant={currentView === "list" ? "secondary" : "ghost"}
              onClick={() => onViewChange("list")}
              className={`transition-all duration-300 hover:scale-105 ${currentView === "list"
                  ? "shadow-button"
                  : "text-primary-foreground hover:bg-white/20 hover:text-white"
                }`}
            >
              <List className="h-4 w-4 mr-2" />
              Lista de Turnos
            </Button>

            <Button
              variant={currentView === "form" ? "secondary" : "ghost"}
              onClick={() => onViewChange("form")}
              className={`transition-all duration-300 hover:scale-105 ${currentView === "form"
                  ? "shadow-button"
                  : "text-primary-foreground hover:bg-white/20 hover:text-white"
                }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Turno
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};