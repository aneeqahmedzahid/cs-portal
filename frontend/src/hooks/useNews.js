import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { uploadToCloudinary } from '../lib/cloudinary';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNews(data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const createNews = async (formData) => {
    setSaving(true);
    try {
      await api.createNews(formData);
      await fetchNews();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateNews = async (id, formData) => {
    setSaving(true);
    try {
      await api.updateNews(id, formData);
      await fetchNews();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (id) => {
    try {
      await api.deleteNews(id);
      await fetchNews();
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
    news,
    loading,
    saving,
    uploading,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    uploadImage
  };
};
