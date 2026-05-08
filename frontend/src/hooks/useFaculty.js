import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { uploadToCloudinary } from '../lib/cloudinary';

export const useFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFaculty();
      setFaculty(data || []);
    } catch (err) {
      console.error("Error fetching faculty:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const createFaculty = async (formData) => {
    setSaving(true);
    try {
      await api.createFaculty(formData);
      await fetchFaculty();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateFaculty = async (id, formData) => {
    setSaving(true);
    try {
      await api.updateFaculty(id, formData);
      await fetchFaculty();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await api.deleteFaculty(id);
      await fetchFaculty();
    } catch (err) {
      throw err;
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      return url;
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    faculty,
    loading,
    saving,
    uploading,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    uploadImage
  };
};
