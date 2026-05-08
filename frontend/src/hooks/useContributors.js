import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useContributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getContributors();
      setContributors(data || []);
    } catch (err) {
      console.error('Failed to fetch contributors:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createContributor = async (data) => {
    setSaving(true);
    try {
      await api.createContributor(data);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const updateContributor = async (id, data) => {
    setSaving(true);
    try {
      await api.updateContributor(id, data);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const deleteContributor = async (id) => {
    try {
      await api.deleteContributor(id);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  return { contributors, loading, saving, createContributor, updateContributor, deleteContributor, refresh: fetchData };
}
