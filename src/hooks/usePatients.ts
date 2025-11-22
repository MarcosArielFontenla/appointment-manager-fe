import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { type Patient, type PatientInsert, type PatientUpdate } from '../types/database.types';
import { useToast } from './useToast';

export const usePatients = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch all patients
    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('patients')
                .select('*')
                .order('last_name', { ascending: true });

            if (fetchError) throw fetchError;

            setPatients(data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error fetching patients';
            setError(message);
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Create patient
    const createPatient = async (patientData: PatientInsert): Promise<Patient | null> => {
        try {
            const { data, error: insertError } = await supabase
                .from('patients')
                .insert([patientData])
                .select()
                .single();

            if (insertError) throw insertError;

            setPatients(prev => [...prev, data]);

            toast({
                title: 'Paciente creado',
                description: `${data.first_name} ${data.last_name} agregado correctamente`,
            });

            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error creating patient';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return null;
        }
    };

    // Update patient
    const updatePatient = async (id: string, updates: PatientUpdate): Promise<boolean> => {
        try {
            const { data, error: updateError } = await supabase
                .from('patients')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;

            setPatients(prev => prev.map(p => p.id === id ? data : p));

            toast({
                title: 'Paciente actualizado',
                description: 'Los datos se actualizaron correctamente',
            });

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error updating patient';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return false;
        }
    };

    // Delete patient
    const deletePatient = async (id: string): Promise<boolean> => {
        try {
            const { error: deleteError } = await supabase
                .from('patients')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setPatients(prev => prev.filter(p => p.id !== id));

            toast({
                title: 'Paciente eliminado',
                description: 'El paciente fue eliminado correctamente',
            });

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error deleting patient';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return false;
        }
    };

    // Search patients
    const searchPatients = async (query: string): Promise<Patient[]> => {
        try {
            const { data, error: searchError } = await supabase
                .from('patients')
                .select('*')
                .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,dni.ilike.%${query}%`)
                .order('last_name', { ascending: true });

            if (searchError) throw searchError;

            return data || [];
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error searching patients';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return [];
        }
    };

    // Get patient by ID
    const getPatientById = async (id: string): Promise<Patient | null> => {
        try {
            const { data, error: fetchError } = await supabase
                .from('patients')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            return data;
        } catch (err) {
            return null;
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return {
        patients,
        loading,
        error,
        createPatient,
        updatePatient,
        deletePatient,
        searchPatients,
        getPatientById,
        refreshPatients: fetchPatients,
    };
};
