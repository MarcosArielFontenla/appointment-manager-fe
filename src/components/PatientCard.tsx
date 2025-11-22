import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { type Patient } from "../types/database.types";
import { User, Phone, Mail, Heart, FileText, Calculator } from "lucide-react";

interface PatientCardProps {
    patient: Patient;
    onEdit?: (patient: Patient) => void;
    onViewHistory?: (patient: Patient) => void;
    onClick?: () => void;
}

export const PatientCard = ({ patient, onEdit, onViewHistory, onClick }: PatientCardProps) => {
    const age = patient.birth_date
        ? Math.floor((new Date().getTime() - new Date(patient.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : null;

    return (
        <Card
            className={`p-4 transition-all duration-300 hover:shadow-elegant ${onClick ? "cursor-pointer hover:scale-105" : ""
                }`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">
                            {patient.first_name} {patient.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">DNI: {patient.dni}</p>
                    </div>
                </div>
                {patient.health_insurance && (
                    <Badge variant="secondary" className="text-xs">
                        {patient.health_insurance}
                    </Badge>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                </div>

                {patient.email && (
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.email}</span>
                    </div>
                )}

                {age !== null && (
                    <div className="flex items-center gap-2 text-sm">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        <span>{age} años</span>
                    </div>
                )}

                {patient.allergies && (
                    <div className="flex items-start gap-2 text-sm">
                        <Heart className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-destructive">Alergias: {patient.allergies}</span>
                    </div>
                )}

                {patient.notes && (
                    <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground truncate">{patient.notes}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-3 border-t">
                {onViewHistory && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewHistory(patient);
                        }}
                        className="flex-1"
                    >
                        Historial
                    </Button>
                )}
                {onEdit && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(patient);
                        }}
                        className="flex-1"
                    >
                        Editar
                    </Button>
                )}
            </div>
        </Card>
    );
};
