import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { type Turn, type TurnInsert, type TurnUpdate, type TurnWithPatient } from '../types/database.types';
import { useToast } from './useToast';

export const useSupabaseTurns = () => {
    const [turns, setTurns] = useState<TurnWithPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch all turns with patient data
    const fetchTurns = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('turns')
                .select(`
          *,
          patient:patients(*)
        `)
                .order('date', { ascending: true })
                .order('time', { ascending: true });

            if (fetchError) throw fetchError;

            // Transform to TurnWithPatient type
            const turnsWithPatient = data?.map(turn => ({
                ...turn,
                patient: turn.patient as any, // Supabase returns as single object
            })) as TurnWithPatient[];

            setTurns(turnsWithPatient || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error fetching turns';
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

    // Create turn
    const createTurn = async (turnData: TurnInsert): Promise<TurnWithPatient | null> => {
        try {
            const { data, error: insertError } = await supabase
                .from('turns')
                .insert([turnData])
                .select(`
          *,
          patient:patients(*)
        `)
                .single();

            if (insertError) throw insertError;

            const turnWithPatient: TurnWithPatient = {
                ...data,
                patient: data.patient as any,
            };

            setTurns(prev => [...prev, turnWithPatient]);

            toast({
                title: 'Turno creado',
                description: `Turno creado para ${turnWithPatient.patient.first_name} ${turnWithPatient.patient.last_name}`,
            });

            return turnWithPatient;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error creating turn';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return null;
        }
    };

    // Update turn
    const updateTurn = async (id: string, updates: TurnUpdate): Promise<boolean> => {
        try {
            const { data, error: updateError } = await supabase
                .from('turns')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select(`
          *,
          patient:patients(*)
        `)
                .single();

            if (updateError) throw updateError;

            const turnWithPatient: TurnWithPatient = {
                ...data,
                patient: data.patient as any,
            };

            setTurns(prev => prev.map(t => t.id === id ? turnWithPatient : t));

            toast({
                title: 'Turno actualizado',
                description: 'El turno se actualizó correctamente',
            });

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error updating turn';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return false;
        }
    };

    // Delete turn
    const deleteTurn = async (id: string): Promise<boolean> => {
        try {
            const { error: deleteError } = await supabase
                .from('turns')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setTurns(prev => prev.filter(t => t.id !== id));

            toast({
                title: 'Turno eliminado',
                description: 'El turno fue eliminado correctamente',
            });

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error deleting turn';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            return false;
        }
    };

    // Update turn status
    const updateTurnStatus = async (id: string, status: Turn['status']): Promise<boolean> => {
        return updateTurn(id, { status });
    };

    // Get turns by patient
    const getTurnsByPatient = async (patientId: string): Promise<TurnWithPatient[]> => {
        try {
            const { data, error: fetchError } = await supabase
                .from('turns')
                .select(`
          *,
          patient:patients(*)
        `)
                .eq('patient_id', patientId)
                .order('date', { ascending: false });

            if (fetchError) throw fetchError;

            return data?.map(turn => ({
                ...turn,
                patient: turn.patient as any,
            })) as TurnWithPatient[] || [];
        } catch (err) {
            return [];
        }
    };

    useEffect(() => {
        fetchTurns();
    }, []);

    return {
        turns,
        loading,
        error,
        createTurn,
        updateTurn,
        deleteTurn,
        updateTurnStatus,
        getTurnsByPatient,
        refreshTurns: fetchTurns,
    };
};
