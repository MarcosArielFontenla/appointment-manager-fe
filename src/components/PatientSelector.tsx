import { useState, useEffect, useRef } from "react";
import { type Patient } from "../types/database.types";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { User, Search, Plus, Phone, CreditCard } from "lucide-react";

interface PatientSelectorProps {
    value?: Patient | null;
    onChange: (patient: Patient | null) => void;
    onCreateNew?: () => void;
    patients: Patient[];
}

export const PatientSelector = ({ value, onChange, onCreateNew, patients }: PatientSelectorProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = patients.filter(p =>
                `${p.first_name} ${p.last_name} ${p.dni}`.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPatients(filtered);
            setShowDropdown(true);
        } else {
            setFilteredPatients([]);
            setShowDropdown(false);
        }
    }, [searchQuery, patients]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPatient = (patient: Patient) => {
        onChange(patient);
        setSearchQuery("");
        setShowDropdown(false);
    };

    const handleClearSelection = () => {
        onChange(null);
        setSearchQuery("");
    };

    if (value) {
        return (
            <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                                {value.first_name} {value.last_name}
                            </h4>
                            <div className="space-y-1 mt-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CreditCard className="h-3 w-3" />
                                    <span>DNI: {value.dni}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{value.phone}</span>
                                </div>
                                {value.health_insurance && (
                                    <div className="text-sm text-muted-foreground">
                                        Obra Social: {value.health_insurance}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSelection}
                    >
                        Cambiar
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Buscar paciente por nombre o DNI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                    className="pl-10"
                />
            </div>

            {showDropdown && (
                <Card className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto shadow-lg">
                    {filteredPatients.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                No se encontraron pacientes
                            </p>
                            {onCreateNew && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        onCreateNew();
                                        setShowDropdown(false);
                                    }}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear nuevo paciente
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="py-2">
                            {filteredPatients.map((patient) => (
                                <button
                                    key={patient.id}
                                    type="button"
                                    onClick={() => handleSelectPatient(patient)}
                                    className="w-full px-4 py-3 hover:bg-accent transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {patient.first_name} {patient.last_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                DNI: {patient.dni} • {patient.phone}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {onCreateNew && (
                                <div className="border-t mt-2 pt-2 px-4 pb-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onCreateNew();
                                            setShowDropdown(false);
                                        }}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Crear nuevo paciente
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};
