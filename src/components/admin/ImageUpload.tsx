'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { RiUploadCloud2Line, RiDeleteBinLine, RiLinkM } from 'react-icons/ri';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: string; // e.g. 'aspect-square' | 'aspect-video'
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  label = 'Image',
  aspectRatio = 'aspect-video',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      onChange(json.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUrlSave = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const hasImage = !!value && value !== 'https://placehold.co/400x400/0D1830/0CC8D4?text=Photo'
    && value !== 'https://placehold.co/1200x600/0D1830/0CC8D4?text=Highlight'
    && value !== 'https://placehold.co/1200x600/0D1830/0CC8D4?text=News';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="admin-label mb-0">{label}</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`text-[10px] px-2 py-0.5 rounded transition-colors ${mode === 'upload' ? 'bg-teal/15 text-teal' : 'text-ink-muted hover:text-teal'}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`text-[10px] px-2 py-0.5 rounded transition-colors ${mode === 'url' ? 'bg-teal/15 text-teal' : 'text-ink-muted hover:text-teal'}`}
          >
            URL
          </button>
        </div>
      </div>

      {/* Preview */}
      {hasImage && (
        <div className={`relative w-full ${aspectRatio} mb-2 rounded-xl overflow-hidden border border-border group`}>
          <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RiDeleteBinLine size={13} />
          </button>
        </div>
      )}

      {mode === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative border-2 border-dashed border-border hover:border-teal/40 rounded-xl px-4 py-5 cursor-pointer transition-colors text-center"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-teal border-t-transparent animate-spin" />
              <p className="text-ink-muted text-xs">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <RiUploadCloud2Line size={22} className="text-ink-muted" />
              <p className="text-ink-secondary text-xs">
                Drop an image or <span className="text-teal">browse</span>
              </p>
              <p className="text-ink-faint text-[10px]">JPG, PNG, WebP, GIF, SVG</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <RiLinkM className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={14} />
            <input
              className="admin-input pl-8 text-sm"
              placeholder="https://..."
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUrlSave(); } }}
            />
          </div>
          <button
            type="button"
            onClick={handleUrlSave}
            className="admin-btn-primary text-xs px-3"
          >
            Use
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
