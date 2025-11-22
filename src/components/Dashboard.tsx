import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { TurnCard, type Turn } from "../components/TurnCard";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  CalendarCheck,
  AlertCircle
} from "lucide-react";

interface DashboardProps {
  turns: Turn[];
  onEditTurn?: (turn: Turn) => void;
  onCancelTurn?: (id: string) => void;
  onConfirmTurn?: (id: string) => void;
  onNewTurn?: () => void;
}

export const Dashboard = ({
  turns,
  onEditTurn,
  onCancelTurn,
  onConfirmTurn,
  onNewTurn
}: DashboardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayTurns = turns.filter(turn => turn.date === today);
  const upcomingTurns = turns.filter(turn => turn.date > today).slice(0, 3);

  const todayStats = {
    total: todayTurns.length,
    confirmed: todayTurns.filter(turn => turn.status === "confirmed").length,
    pending: todayTurns.filter(turn => turn.status === "pending").length,
    cancelled: todayTurns.filter(turn => turn.status === "cancelled").length,
  };

  const nextTurn = todayTurns
    .filter(turn => turn.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time))
    .find(turn => {
      const currentTime = new Date().toTimeString().slice(0, 5);
      return turn.time >= currentTime;
    });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTodayTurnsMsg = () => {
    if (todayStats.total === 0) return "No hay turnos programados para hoy";
    return `${todayStats.total} turno${todayStats.total > 1 ? 's' : ''} programado${todayStats.total > 1 ? 's' : ''} para hoy`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-primary mb-4">
          Bienvenido al Dashboard
        </h2>
        <p className="text-xl text-muted-foreground mb-6">
          {formatDate(today)}
        </p>
        <p className="text-lg text-muted-foreground">
          {getTodayTurnsMsg()}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hoy</p>
                <p className="text-3xl font-bold text-primary">{todayStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmados</p>
                <p className="text-3xl font-bold text-success">{todayStats.confirmed}</p>
              </div>
              <CalendarCheck className="h-8 w-8 text-success opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-3xl font-bold text-warning">{todayStats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total General</p>
                <p className="text-3xl font-bold text-primary">{turns.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Appointment Alert */}
      {nextTurn && (
        <Card className="bg-gradient-primary shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximo Turno
            </CardTitle>
          </CardHeader>
          <CardContent className="text-primary-foreground">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{nextTurn.clientName}</p>
                <p className="opacity-90">{nextTurn.service}</p>
                <p className="opacity-75 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {nextTurn.time}
                </p>
              </div>
              <Badge className="bg-white/20 text-primary-foreground hover:bg-white/30">
                {nextTurn.status === "confirmed" ? "Confirmado" : "Pendiente"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-primary">
                  <Calendar className="h-5 w-5" />
                  Turnos de Hoy
                </span>
                {onNewTurn && (
                  <Button
                    onClick={onNewTurn}
                    size="sm"
                    className="bg-gradient-primary shadow-button hover:shadow-elegant hover:scale-105 transition-all duration-300"
                  >
                    Nuevo Turno
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayTurns.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay turnos para hoy</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {todayTurns
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((turn) => (
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
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Próximos Turnos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTurns.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay turnos próximos</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {upcomingTurns.map((turn) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};