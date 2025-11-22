import { useState } from "react";
import { PatientCard } from "./PatientCard";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { type Patient } from "../types/database.types";
import { Search, Plus, Loader2 } from "lucide-react";

interface PatientListProps {
    patients: Patient[];
    loading?: boolean;
    onEdit?: (patient: Patient) => void;
    onViewHistory?: (patient: Patient) => void;
    onNewPatient?: () => void;
    onSearch?: (query: string) => void;
}

export const PatientList = ({
    patients,
    loading = false,
    onEdit,
    onViewHistory,
    onNewPatient,
    onSearch
}: PatientListProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPatients, setFilteredPatients] = useState(patients);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);

        if (onSearch) {
            onSearch(query);
        } else {
            // Local filtering if no search handler provided
            const filtered = patients.filter(p =>
                `${p.first_name} ${p.last_name} ${p.dni}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    };

    const displayPatients = onSearch ? patients : filteredPatients;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando pacientes...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar por nombre o DNI..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {onNewPatient && (
                    <Button
                        onClick={onNewPatient}
                        className="bg-gradient-primary shadow-button transition-all duration-300 hover:scale-105"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Paciente
                    </Button>
                )}
            </div>

            {/* Patient Grid */}
            {displayPatients.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? "No se encontraron pacientes que coincidan con la búsqueda"
                            : "No hay pacientes registrados"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayPatients.map((patient) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            onEdit={onEdit}
                            onViewHistory={onViewHistory}
                        />
                    ))}
                </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-muted-foreground text-center">
                Mostrando {displayPatients.length} de {patients.length} paciente{patients.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
};
