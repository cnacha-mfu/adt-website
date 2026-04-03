'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { RiFileCopy2Line, RiCheckLine, RiUploadCloud2Line } from 'react-icons/ri';

interface MediaFile {
  url: string;
  name: string;
  folder: string;
}

export default function MediaAdmin() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');
  const [folder, setFolder] = useState('misc');

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/uploads');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) { await loadFiles(); }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  const FOLDERS = ['misc', 'staff', 'highlights', 'news', 'programs/digital-engineering',
    'programs/computer-engineering-beng', 'programs/digital-business',
    'programs/software-engineering', 'programs/multimedia',
    'programs/digital-transformation-msc', 'programs/computer-engineering-meng',
    'programs/computer-engineering-phd'];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-ink-primary">Media Library</h1>
          <p className="text-ink-secondary text-sm mt-1">All uploaded images. Click to copy URL.</p>
        </div>

        {/* Quick upload */}
        <div className="flex items-center gap-3">
          <select
            value={folder}
            onChange={e => setFolder(e.target.value)}
            className="admin-input text-sm py-2"
          >
            {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <label className="admin-btn-primary cursor-pointer flex items-center gap-2 text-sm">
            <RiUploadCloud2Line size={15} />
            {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 text-ink-muted">
          <RiUploadCloud2Line size={40} className="mx-auto mb-3 opacity-40" />
          <p>No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map(file => (
            <button
              key={file.url}
              onClick={() => copy(file.url)}
              className="group relative rounded-xl overflow-hidden border border-border hover:border-teal/40 transition-all aspect-square bg-surface"
            >
              <Image src={file.url} alt={file.name} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                {copied === file.url ? (
                  <RiCheckLine size={20} className="text-teal" />
                ) : (
                  <RiFileCopy2Line size={20} className="text-white" />
                )}
                <p className="text-white text-[10px] text-center break-all leading-tight">{file.name}</p>
                <p className="text-ink-muted text-[9px]">{file.folder}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
