import { useState } from "react";
import { TurnCard, type Turn } from "./TurnCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/Select";
import { Search, Filter, Calendar } from "lucide-react";

interface TurnsListProps {
  turns: Turn[];
  onEditTurn?: (turn: Turn) => void;
  onCancelTurn?: (id: string) => void;
  onConfirmTurn?: (id: string) => void;
}

export const TurnsList = ({ turns, onEditTurn, onCancelTurn, onConfirmTurn }: TurnsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");

  const getFilteredTurns = () => {
    let filtered = turns;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(turn =>
        turn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turn.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turn.clientPhone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(turn => turn.status === statusFilter);
    }

    // Filter by date
    const today = new Date().toISOString().split('T')[0];
    if (dateFilter === "today") {
      filtered = filtered.filter(turn => turn.date === today);
    } else if (dateFilter === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      filtered = filtered.filter(turn => turn.date === tomorrowStr);
    } else if (dateFilter === "week") {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      filtered = filtered.filter(turn => {
        const turnDate = new Date(turn.date);
        return turnDate >= new Date(today) && turnDate <= weekFromNow;
      });
    }

    return filtered.sort((a, b) => {
      // Sort by date first, then by time
      if (a.date !== b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return a.time.localeCompare(b.time);
    });
  };

  const filteredTurns = getFilteredTurns();

  const getStatusCount = (status: string) => {
    return turns.filter(turn => turn.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{turns.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmados</p>
                <p className="text-2xl font-bold text-success">{getStatusCount("confirmed")}</p>
              </div>
              <Badge className="bg-success text-success-foreground">✓</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-warning">{getStatusCount("pending")}</p>
              </div>
              <Badge className="bg-warning text-warning-foreground">⏳</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelados</p>
                <p className="text-2xl font-bold text-destructive">{getStatusCount("cancelled")}</p>
              </div>
              <Badge className="bg-destructive text-destructive-foreground">✕</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, servicio o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Turns List */}
      <div className="space-y-4">
        {filteredTurns.length === 0 ? (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No hay turnos
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "No se encontraron turnos con los filtros aplicados."
                  : "Aún no hay turnos programados."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTurns.map((turn) => (
              <TurnCard
                key={turn.id}
                turn={turn}
                onEdit={onEditTurn}
                onCancel={onCancelTurn}
                onConfirm={onConfirmTurn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};