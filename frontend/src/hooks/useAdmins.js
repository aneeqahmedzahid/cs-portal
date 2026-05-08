import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdmins();
      setAdmins(data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const createAdmin = async (formData) => {
    setSaving(true);
    try {
      await api.createAdmin(formData);
      await fetchAdmins();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await api.deleteAdmin(id);
      await fetchAdmins();
    } catch (err) {
      throw err;
    }
  };

  return {
    admins,
    loading,
    saving,
    fetchAdmins,
    createAdmin,
    deleteAdmin
  };
};
