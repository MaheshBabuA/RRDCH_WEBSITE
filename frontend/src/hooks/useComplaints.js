import { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';

/**
 * Hook to manage complaints.
 * Provides fetching, refetching, and a creation trigger.
 */
export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = useCallback(async (isActive) => {
    setLoading(true);
    try {
      const data = await apiService.complaints.getAll();
      if (isActive) {
        setComplaints(data || []);
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

  /**
   * Function to create a new complaint.
   * Optionally triggers a refetch on success.
   */
  const create = useCallback(async (data) => {
    try {
      const result = await apiService.complaints.create(data);
      // Optional: Refetch complaints after successful creation to keep UI in sync
      fetchComplaints(true); 
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchComplaints]);

  useEffect(() => {
    let isActive = true;
    fetchComplaints(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchComplaints]);

  return useMemo(() => ({
    complaints,
    loading,
    error,
    refetch: () => fetchComplaints(true),
    create
  }), [complaints, loading, error, fetchComplaints, create]);
};

export default useComplaints;
