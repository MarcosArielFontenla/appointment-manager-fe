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
import { PatientSelector } from "./PatientSelector";
import { PatientForm } from "./PatientForm";
import { CalendarDays, Clock, Plus, ArrowLeft } from "lucide-react";
import { type Patient, type PatientInsert, type TurnInsert, type TurnWithPatient } from "../types/database.types";

interface AppointmentFormProps {
  onSubmit: (turn: TurnInsert) => void | Promise<void>;
  onCreatePatient?: (patient: PatientInsert) => Promise<Patient | null>;
  initialData?: TurnWithPatient;
  patients: Patient[];
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

export const AppointmentForm = ({
  onSubmit,
  onCreatePatient,
  initialData,
  patients,
  services = defaultServices
}: AppointmentFormProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    initialData?.patient || null
  );
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);

  const [formData, setFormData] = useState({
    service: initialData?.service || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    status: initialData?.status || "pending" as const,
    notes: initialData?.notes || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Por favor seleccione un paciente");
      return;
    }

    await onSubmit({
      patient_id: selectedPatient.id,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      status: formData.status,
      notes: formData.notes || null,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePatient = async (patientData: PatientInsert) => {
    if (!onCreatePatient) return;

    setCreatingPatient(true);
    const newPatient = await onCreatePatient(patientData);
    setCreatingPatient(false);

    if (newPatient) {
      setSelectedPatient(newPatient);
      setShowPatientForm(false);
    }
  };

  if (showPatientForm) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowPatientForm(false)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al formulario de turno
        </Button>
        <PatientForm
          onSubmit={handleCreatePatient}
          onCancel={() => setShowPatientForm(false)}
        />
      </div>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Plus className="h-5 w-5" />
          {initialData ? "Editar Turno" : "Nuevo Turno"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selector */}
          <div className="space-y-2">
            <Label>Paciente *</Label>
            <PatientSelector
              value={selectedPatient}
              onChange={setSelectedPatient}
              onCreateNew={() => setShowPatientForm(true)}
              patients={patients}
            />
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label htmlFor="service">Servicio *</Label>
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

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Fecha *
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
                Hora *
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

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Información adicional sobre el turno..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!selectedPatient || creatingPatient}
            className="w-full bg-gradient-primary shadow-button hover:shadow-elegant transition-all duration-300"
          >
            {creatingPatient ? "Creando..." : initialData ? "Actualizar Turno" : "Crear Turno"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};