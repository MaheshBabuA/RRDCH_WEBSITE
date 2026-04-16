import { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';

/**
 * Hook to fetch all upcoming events.
 */
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (isActive) => {
    setLoading(true);
    try {
      const data = await apiService.events.getAll();
      if (isActive) {
        setEvents(data || []);
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
    fetchEvents(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchEvents]);

  return useMemo(() => ({ events, loading, error }), [events, loading, error]);
};

/**
 * Hook to fetch events filtered by month.
 * @param {string|number} month - The month to filter by.
 */
export const useEventsByMonth = (month) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (isActive) => {
    if (!month) return;
    setLoading(true);
    try {
      const data = await apiService.events.getByMonth(month);
      if (isActive) {
        setEvents(data || []);
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
  }, [month]);

  useEffect(() => {
    let isActive = true;
    fetchEvents(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchEvents]);

  return useMemo(() => ({ events, loading, error }), [events, loading, error]);
};
