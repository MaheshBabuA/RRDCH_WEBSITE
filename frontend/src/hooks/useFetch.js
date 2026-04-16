import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Generic hook for fetching data from a URL.
 * Handles loading, errors, and race conditions.
 * 
 * @param {string} url - The endpoint to fetch data from.
 * @param {Array} dependencies - Additional dependencies to trigger a re-fetch.
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isActive) => {
    setLoading(true);
    try {
      const result = await api.get(url);
      if (isActive) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (isActive) {
        setError(err);
        setData(null);
      }
    } finally {
      if (isActive) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    let isActive = true;
    fetchData(isActive);

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: () => fetchData(true) };
};

export default useFetch;
