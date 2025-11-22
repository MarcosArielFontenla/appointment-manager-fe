import { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { type Patient, type PatientInsert } from "../types/database.types";

interface PatientFormProps {
    onSubmit: (data: PatientInsert) => void | Promise<void>;
    initialData?: Patient;
    onCancel?: () => void;
}

export const PatientForm = ({ onSubmit, initialData, onCancel }: PatientFormProps) => {
    const [formData, setFormData] = useState<PatientInsert>({
        dni: initialData?.dni || "",
        first_name: initialData?.first_name || "",
        last_name: initialData?.last_name || "",
        email: initialData?.email || null,
        phone: initialData?.phone || "",
        birth_date: initialData?.birth_date || null,
        health_insurance: initialData?.health_insurance || null,
        allergies: initialData?.allergies || null,
        notes: initialData?.notes || null,
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: keyof PatientInsert, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value === "" ? null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
                {initialData ? "Editar Paciente" : "Nuevo Paciente"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos Personales */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dni">DNI *</Label>
                            <Input
                                id="dni"
                                type="text"
                                value={formData.dni}
                                onChange={(e) => handleChange("dni", e.target.value)}
                                required
                                placeholder="12345678"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Teléfono *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                required
                                placeholder="+54 9 11 1234-5678"
                            />
                        </div>

                        <div>
                            <Label htmlFor="first_name">Nombre *</Label>
                            <Input
                                id="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                required
                                placeholder="Juan"
                            />
                        </div>

                        <div>
                            <Label htmlFor="last_name">Apellido *</Label>
                            <Input
                                id="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                required
                                placeholder="Pérez"
                            />
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="juan.perez@email.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={formData.birth_date || ""}
                                onChange={(e) => handleChange("birth_date", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Datos Médicos */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Datos Médicos</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="health_insurance">Obra Social</Label>
                            <Input
                                id="health_insurance"
                                type="text"
                                value={formData.health_insurance || ""}
                                onChange={(e) => handleChange("health_insurance", e.target.value)}
                                placeholder="OSDE, Swiss Medical, etc."
                            />
                        </div>

                        <div>
                            <Label htmlFor="allergies">Alergias</Label>
                            <Textarea
                                id="allergies"
                                value={formData.allergies || ""}
                                onChange={(e) => handleChange("allergies", e.target.value)}
                                placeholder="Penicilina, polen, etc."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="notes">Notas Adicionales</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes || ""}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                placeholder="Información adicional relevante..."
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-primary"
                    >
                        {submitting ? "Guardando..." : initialData ? "Actualizar" : "Crear Paciente"}
                    </Button>
                </div>
            </form>
        </Card>
    );
};
