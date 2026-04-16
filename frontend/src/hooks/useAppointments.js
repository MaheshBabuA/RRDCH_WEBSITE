import { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';

/**
 * Hook to fetch and manage all appointments.
 */
export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async (isActive) => {
    setLoading(true);
    try {
      const data = await apiService.appointments.getAll();
      if (isActive) {
        setAppointments(data);
        setError(null);
      }
    } catch (err) {
      if (isActive) {
        setError(err);
      }
    } finally {
      if (isActive) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    fetchAppointments(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchAppointments]);

  return useMemo(() => ({ 
    appointments, 
    loading, 
    error, 
    refetch: () => fetchAppointments(true) 
  }), [appointments, loading, error, fetchAppointments]);
};

/**
 * Hook to fetch single appointment details.
 */
export const useAppointmentDetails = (appointmentId) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async (isActive) => {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const data = await apiService.appointments.getById(appointmentId);
      if (isActive) {
        setAppointment(data);
        setError(null);
      }
    } catch (err) {
      if (isActive) {
        setError(err);
      }
    } finally {
      if (isActive) {
        setLoading(false);
      }
    }
  }, [appointmentId]);

  useEffect(() => {
    let isActive = true;
    fetchDetails(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchDetails]);

  return useMemo(() => ({ appointment, loading, error }), [appointment, loading, error]);
};

/**
 * Hook to handle creation of a new appointment.
 */
export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      const result = await apiService.appointments.create(data);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(() => ({ submit, loading, error, success }), [submit, loading, error, success]);
};
