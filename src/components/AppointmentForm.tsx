import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { CalendarDays, Clock, Plus } from "lucide-react";
import type { Turn } from "../components/TurnCard";

interface AppointmentFormProps {
  onSubmit: (turn: Omit<Turn, "id">) => void;
  initialData?: Turn;
  services?: string[];
}

const defaultServices = [
  "Consulta General",
  "Consulta Especializada",
  "Control de Rutina",
  "Urgencia",
  "Procedimiento",
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export const AppointmentForm = ({ onSubmit, initialData, services = defaultServices }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || "",
    clientPhone: initialData?.clientPhone || "",
    service: initialData?.service || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    status: initialData?.status || "pending" as const,
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Plus className="h-5 w-5" />
          {initialData ? "Editar Turno" : "Nuevo Turno"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre del Cliente</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleChange("clientPhone", e.target.value)}
                placeholder="Ej: +54 9 11 1234-5678"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Servicio</Label>
            <Select
              value={formData.service}
              onValueChange={(value) => handleChange("service", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => handleChange("time", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Información adicional sobre el turno..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary shadow-button hover:shadow-elegant transition-all duration-300"
          >
            {initialData ? "Actualizar Turno" : "Crear Turno"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};