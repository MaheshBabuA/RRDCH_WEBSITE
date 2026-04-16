import { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';

// Module-level cache for departments
let departmentsCache = null;

/**
 * Hook to fetch all departments with simple module-level caching.
 */
export const useDepartments = () => {
  const [departments, setDepartments] = useState(departmentsCache || []);
  const [loading, setLoading] = useState(!departmentsCache);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async (isActive) => {
    // Return cached data if available
    if (departmentsCache) {
      if (isActive) {
        setDepartments(departmentsCache);
        setLoading(false);
        setError(null);
      }
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.departments.getAll();
      departmentsCache = data;
      if (isActive) {
        setDepartments(data);
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
    fetchDepartments(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchDepartments]);

  return useMemo(() => ({ departments, loading, error }), [departments, loading, error]);
};

/**
 * Hook to fetch a single department by ID.
 */
export const useDepartmentById = (id) => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartment = useCallback(async (isActive) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiService.departments.getById(id);
      if (isActive) {
        setDepartment(data);
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
  }, [id]);

  useEffect(() => {
    let isActive = true;
    fetchDepartment(isActive);
    return () => {
      isActive = false;
    };
  }, [fetchDepartment]);

  return useMemo(() => ({ department, loading, error }), [department, loading, error]);
};
