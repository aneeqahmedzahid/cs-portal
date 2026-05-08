import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { uploadToCloudinary } from '../lib/cloudinary';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (formData) => {
    setSaving(true);
    try {
      await api.createEvent(formData);
      await fetchEvents();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateEvent = async (id, formData) => {
    setSaving(true);
    try {
      await api.updateEvent(id, formData);
      await fetchEvents();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.deleteEvent(id);
      await fetchEvents();
    } catch (err) {
      throw err;
    }
  };

  return {
    events,
    loading,
    saving,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
