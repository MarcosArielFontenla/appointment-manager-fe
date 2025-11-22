import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Clock, User, Phone, Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";

export interface Turn {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
}

interface TurnCardProps {
  turn: Turn;
  onEdit?: (turn: Turn) => void;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

const statusColors = {
  confirmed: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const statusLabels = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  cancelled: "Cancelado",
};

export const TurnCard = ({ turn, onEdit, onCancel, onConfirm }: TurnCardProps) => {
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 border-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {turn.clientName}
            </CardTitle>
            <Badge className={statusColors[turn.status]}>
              {statusLabels[turn.status]}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(turn)}>
                  Editar
                </DropdownMenuItem>
              )}
              {turn.status === "pending" && onConfirm && (
                <DropdownMenuItem onClick={() => onConfirm(turn.id)}>
                  Confirmar
                </DropdownMenuItem>
              )}
              {turn.status !== "cancelled" && onCancel && (
                <DropdownMenuItem 
                  onClick={() => onCancel(turn.id)}
                  className="text-destructive"
                >
                  Cancelar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{turn.clientPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{turn.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{turn.time}</span>
        </div>
        <div className="bg-accent/50 rounded-lg p-3">
          <p className="font-medium text-accent-foreground">{turn.service}</p>
          {turn.notes && (
            <p className="text-sm text-muted-foreground mt-1">{turn.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};