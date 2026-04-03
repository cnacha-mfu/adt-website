'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppData, StaffMember, Highlight, NewsItem, Language } from '@/lib/types';

interface AppContextValue {
  data: AppData;
  language: Language;
  loading: boolean;
  setLanguage: (lang: Language) => void;
  // Staff
  addStaff: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
  updateStaff: (id: string, staff: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  // Highlights
  addHighlight: (h: Omit<Highlight, 'id'>) => Promise<void>;
  updateHighlight: (id: string, h: Partial<Highlight>) => Promise<void>;
  deleteHighlight: (id: string) => Promise<void>;
  // News
  addNews: (n: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNews: (id: string, n: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  // Program images
  updateProgramImage: (programId: string, url: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_DATA: AppData = {
  staff: [],
  highlights: [],
  news: [],
  programImages: {},
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  // ── Initial fetch ──────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    try {
      const [staffRes, highlightsRes, newsRes, imagesRes] = await Promise.all([
        fetch('/api/staff'),
        fetch('/api/highlights'),
        fetch('/api/news'),
        fetch('/api/program-images'),
      ]);

      const [staffJson, highlightsJson, newsJson, imagesJson] = await Promise.all([
        staffRes.json(),
        highlightsRes.json(),
        newsRes.json(),
        imagesRes.json(),
      ]);

      setData({
        staff: staffJson.staff ?? [],
        highlights: highlightsJson.highlights ?? [],
        news: newsJson.news ?? [],
        programImages: imagesJson.images ?? {},
      });
    } catch (err) {
      console.error('[AppContext] Failed to load initial data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Staff mutations ────────────────────────────────────────────────────────

  const addStaff = useCallback(async (staff: Omit<StaffMember, 'id'>) => {
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    });
    const { staff: created } = await res.json();
    setData(prev => ({ ...prev, staff: [...prev.staff, created] }));
  }, []);

  const updateStaff = useCallback(async (id: string, updates: Partial<StaffMember>) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const { staff: updated } = await res.json();
    setData(prev => ({
      ...prev,
      staff: prev.staff.map(s => s.id === id ? updated : s),
    }));
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    setData(prev => ({ ...prev, staff: prev.staff.filter(s => s.id !== id) }));
  }, []);

  // ── Highlight mutations ────────────────────────────────────────────────────

  const addHighlight = useCallback(async (h: Omit<Highlight, 'id'>) => {
    const res = await fetch('/api/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(h),
    });
    const { highlight: created } = await res.json();
    setData(prev => ({ ...prev, highlights: [...prev.highlights, created] }));
  }, []);

  const updateHighlight = useCallback(async (id: string, updates: Partial<Highlight>) => {
    const res = await fetch(`/api/highlights/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const { highlight: updated } = await res.json();
    setData(prev => ({
      ...prev,
      highlights: prev.highlights.map(h => h.id === id ? updated : h),
    }));
  }, []);

  const deleteHighlight = useCallback(async (id: string) => {
    await fetch(`/api/highlights/${id}`, { method: 'DELETE' });
    setData(prev => ({ ...prev, highlights: prev.highlights.filter(h => h.id !== id) }));
  }, []);

  // ── News mutations ─────────────────────────────────────────────────────────

  const addNews = useCallback(async (n: Omit<NewsItem, 'id'>) => {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n),
    });
    const { news: created } = await res.json();
    setData(prev => ({ ...prev, news: [created, ...prev.news] }));
  }, []);

  const updateNews = useCallback(async (id: string, updates: Partial<NewsItem>) => {
    const res = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const { news: updated } = await res.json();
    setData(prev => ({
      ...prev,
      news: prev.news.map(n => n.id === id ? updated : n),
    }));
  }, []);

  const deleteNews = useCallback(async (id: string) => {
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    setData(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }));
  }, []);

  // ── Program images ─────────────────────────────────────────────────────────

  const updateProgramImage = useCallback(async (programId: string, url: string) => {
    await fetch('/api/program-images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId, url }),
    });
    setData(prev => ({
      ...prev,
      programImages: { ...prev.programImages, [programId]: url },
    }));
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────────

  const resetToDefaults = useCallback(async () => {
    await fetch('/api/reset', { method: 'POST' });
    setLoading(true);
    await fetchAll();
  }, [fetchAll]);

  return (
    <AppContext.Provider value={{
      data,
      language,
      loading,
      setLanguage,
      addStaff,
      updateStaff,
      deleteStaff,
      addHighlight,
      updateHighlight,
      deleteHighlight,
      addNews,
      updateNews,
      deleteNews,
      updateProgramImage,
      resetToDefaults,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
