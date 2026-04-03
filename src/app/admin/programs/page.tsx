'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { programs as staticPrograms } from '@/lib/programs-data';
import type { ProgramData } from '@/lib/programs-data';
import ImageUpload from '@/components/admin/ImageUpload';
import { HiUpload, HiX, HiPhotograph, HiChevronDown, HiChevronUp, HiPlus, HiTrash, HiCheck } from 'react-icons/hi';
import {
  MdOutlineWifi, MdMemory, MdOutlineTrendingUp,
  MdOutlineCode, MdOutlineMovieFilter,
  MdOutlineAutoAwesome, MdOutlineEngineering, MdOutlineScience,
} from 'react-icons/md';

const iconMap: Record<string, React.ElementType> = {
  'digital-engineering':        MdOutlineWifi,
  'computer-engineering-beng':  MdMemory,
  'digital-business':           MdOutlineTrendingUp,
  'software-engineering':       MdOutlineCode,
  'multimedia':                 MdOutlineMovieFilter,
  'digital-transformation-msc': MdOutlineAutoAwesome,
  'computer-engineering-meng':  MdOutlineEngineering,
  'computer-engineering-phd':   MdOutlineScience,
};

interface GalleryImage { id: string; programId: string; url: string; caption: string; order: number; }

type EditForm = {
  description: string;
  descriptionTH: string;
  fees: string;
  feesPerSemester: string;
  officialUrl: string;
  careers: { en: string; th: string }[];
  curriculumStructure: { label: string; labelTH: string; credits: number }[];
  features: string[];
};

function programToForm(p: ProgramData): EditForm {
  return {
    description: p.description,
    descriptionTH: p.descriptionTH,
    fees: p.fees,
    feesPerSemester: p.feesPerSemester,
    officialUrl: p.officialUrl,
    careers: p.careers.map(c => ({ ...c })),
    curriculumStructure: p.curriculumStructure.map(c => ({ ...c })),
    features: [...p.features],
  };
}

export default function ProgramsAdmin() {
  const { data, updateProgramImage } = useApp();
  const [galleries, setGalleries] = useState<Record<string, GalleryImage[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Programs data from API
  const [programs, setPrograms] = useState<ProgramData[]>([]);

  // Edit accordion open state
  const [expandedEdit, setExpandedEdit] = useState<Record<string, boolean>>({});

  // Per-program form state — pre-seeded from static data so form is never undefined
  const [editForms, setEditForms] = useState<Record<string, EditForm>>(() => {
    const forms: Record<string, EditForm> = {};
    for (const p of staticPrograms) forms[p.id] = programToForm(p);
    return forms;
  });

  // Save feedback
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});

  // Load galleries and programs on mount
  useEffect(() => {
    // Load galleries
    Promise.all(
      staticPrograms.map(p =>
        fetch(`/api/program-gallery/${p.id}`)
          .then(r => r.ok ? r.json() : { images: [] })
          .then(d => ({ id: p.id, images: d.images ?? [] }))
      )
    ).then(results => {
      const map: Record<string, GalleryImage[]> = {};
      results.forEach(r => { map[r.id] = r.images; });
      setGalleries(map);
    });

    // Load program details
    fetch('/api/programs')
      .then(r => r.ok ? r.json() : { programs: [] })
      .then(d => {
        const progs: ProgramData[] = d.programs ?? [];
        if (progs.length > 0) {
          setPrograms(progs);
          setEditForms(prev => {
            const forms = { ...prev };
            for (const p of progs) forms[p.id] = programToForm(p);
            return forms;
          });
        }
      });
  }, []);

  const handleUpload = async (programId: string, files: FileList) => {
    setUploading(prev => ({ ...prev, [programId]: true }));
    setUploadError(prev => ({ ...prev, [programId]: '' }));
    const uploaded: GalleryImage[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`/api/program-gallery/${programId}`, { method: 'POST', body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
        if (json.image) uploaded.push(json.image);
      }
      setGalleries(prev => ({ ...prev, [programId]: [...(prev[programId] ?? []), ...uploaded] }));
    } catch (e) {
      setUploadError(prev => ({ ...prev, [programId]: String(e) }));
    } finally {
      setUploading(prev => ({ ...prev, [programId]: false }));
    }
  };

  const handleDelete = async (programId: string, imageId: string) => {
    await fetch(`/api/program-gallery/${programId}/${imageId}`, { method: 'DELETE' });
    setGalleries(prev => ({ ...prev, [programId]: prev[programId].filter(img => img.id !== imageId) }));
  };

  const toggleEdit = (programId: string) => {
    setExpandedEdit(prev => ({ ...prev, [programId]: !prev[programId] }));
  };

  // Form helpers
  const updateForm = (programId: string, patch: Partial<EditForm>) => {
    setEditForms(prev => ({ ...prev, [programId]: { ...prev[programId], ...patch } }));
  };

  const updateCareer = (programId: string, idx: number, field: 'en' | 'th', value: string) => {
    setEditForms(prev => {
      const careers = [...prev[programId].careers];
      careers[idx] = { ...careers[idx], [field]: value };
      return { ...prev, [programId]: { ...prev[programId], careers } };
    });
  };

  const addCareer = (programId: string) => {
    setEditForms(prev => ({
      ...prev,
      [programId]: { ...prev[programId], careers: [...prev[programId].careers, { en: '', th: '' }] },
    }));
  };

  const removeCareer = (programId: string, idx: number) => {
    setEditForms(prev => {
      const careers = prev[programId].careers.filter((_, i) => i !== idx);
      return { ...prev, [programId]: { ...prev[programId], careers } };
    });
  };

  const updateCurriculumItem = (programId: string, idx: number, field: 'label' | 'labelTH' | 'credits', value: string | number) => {
    setEditForms(prev => {
      const curriculumStructure = [...prev[programId].curriculumStructure];
      curriculumStructure[idx] = { ...curriculumStructure[idx], [field]: value };
      return { ...prev, [programId]: { ...prev[programId], curriculumStructure } };
    });
  };

  const addCurriculumItem = (programId: string) => {
    setEditForms(prev => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        curriculumStructure: [...prev[programId].curriculumStructure, { label: '', labelTH: '', credits: 0 }],
      },
    }));
  };

  const removeCurriculumItem = (programId: string, idx: number) => {
    setEditForms(prev => {
      const curriculumStructure = prev[programId].curriculumStructure.filter((_, i) => i !== idx);
      return { ...prev, [programId]: { ...prev[programId], curriculumStructure } };
    });
  };

  const updateFeature = (programId: string, idx: number, value: string) => {
    setEditForms(prev => {
      const features = [...prev[programId].features];
      features[idx] = value;
      return { ...prev, [programId]: { ...prev[programId], features } };
    });
  };

  const addFeature = (programId: string) => {
    setEditForms(prev => ({
      ...prev,
      [programId]: { ...prev[programId], features: [...prev[programId].features, ''] },
    }));
  };

  const removeFeature = (programId: string, idx: number) => {
    setEditForms(prev => {
      const features = prev[programId].features.filter((_, i) => i !== idx);
      return { ...prev, [programId]: { ...prev[programId], features } };
    });
  };

  const handleSave = async (programId: string) => {
    setSaving(prev => ({ ...prev, [programId]: true }));
    setSaveStatus(prev => ({ ...prev, [programId]: null }));
    try {
      const form = editForms[programId];
      const res = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description,
          descriptionTH: form.descriptionTH,
          fees: form.fees,
          feesPerSemester: form.feesPerSemester,
          officialUrl: form.officialUrl,
          careers: form.careers,
          curriculumStructure: form.curriculumStructure,
          features: form.features,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { program: updated } = await res.json();
      setPrograms(prev => prev.map(p => p.id === programId ? updated : p));
      setEditForms(prev => ({ ...prev, [programId]: programToForm(updated) }));
      setSaveStatus(prev => ({ ...prev, [programId]: 'success' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [programId]: null })), 3000);
    } catch {
      setSaveStatus(prev => ({ ...prev, [programId]: 'error' }));
    } finally {
      setSaving(prev => ({ ...prev, [programId]: false }));
    }
  };

  // Use API programs if loaded, fall back to static for gallery cards
  const displayPrograms = programs.length > 0 ? programs : staticPrograms;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl text-ink-primary">Programs</h1>
        <p className="text-ink-secondary text-sm mt-1">
          Manage cover images, photo galleries, and program details for each degree program.
        </p>
      </div>

      <div className="space-y-8">
        {displayPrograms.map(prog => {
          const Icon = iconMap[prog.id] ?? MdOutlineWifi;
          const imgUrl = data.programImages?.[prog.id] || '';
          const images = galleries[prog.id] ?? [];
          const form = editForms[prog.id];
          const isEditOpen = expandedEdit[prog.id] ?? false;

          return (
            <div key={prog.id} className="glass-card rounded-2xl p-6 gradient-border">
              {/* Program header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${prog.color}18`, color: prog.color }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: prog.color }}
                  >
                    {prog.degree}
                  </span>
                  <p className="font-syne font-semibold text-sm text-ink-primary leading-tight">
                    {prog.name}
                  </p>
                  <p className="text-ink-muted text-[10px]">{prog.nameTH}</p>
                </div>
              </div>

              {/* Cover image */}
              <div className="mb-6">
                <p className="text-ink-secondary text-xs font-medium mb-2 uppercase tracking-widest">Cover Image</p>
                <ImageUpload
                  value={imgUrl}
                  onChange={url => updateProgramImage(prog.id, url)}
                  folder={`programs/${prog.id}`}
                  label="Cover Image"
                  aspectRatio="aspect-video"
                />
              </div>

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-ink-secondary text-xs font-medium uppercase tracking-widest">
                      Photo Gallery
                      <span className="ml-2 text-ink-muted">({images.length} photos)</span>
                    </p>
                    {uploadError[prog.id] && (
                      <p className="text-red-400 text-xs mt-1">{uploadError[prog.id]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      ref={el => { fileRefs.current[prog.id] = el; }}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => e.target.files && handleUpload(prog.id, e.target.files)}
                    />
                    <button
                      onClick={() => fileRefs.current[prog.id]?.click()}
                      disabled={uploading[prog.id]}
                      className="admin-btn-primary flex items-center gap-2 text-xs"
                    >
                      <HiUpload size={13} />
                      {uploading[prog.id] ? 'Uploading...' : 'Upload Photos'}
                    </button>
                  </div>
                </div>

                {images.length === 0 ? (
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-teal/40 transition-colors"
                    onClick={() => fileRefs.current[prog.id]?.click()}
                  >
                    <HiPhotograph className="mx-auto text-ink-muted mb-2" size={28} />
                    <p className="text-ink-muted text-xs">Click to upload photos for this program</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
                    {images.map(img => (
                      <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-surface">
                        <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                        <button
                          onClick={() => handleDelete(prog.id, img.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-void/80 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiX size={10} />
                        </button>
                      </div>
                    ))}
                    <div
                      className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-teal/40 transition-colors"
                      onClick={() => fileRefs.current[prog.id]?.click()}
                    >
                      <HiUpload className="text-ink-muted" size={18} />
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Details accordion */}
              <div className="mt-6 border-t border-border pt-5">
                <button
                  onClick={() => toggleEdit(prog.id)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <span className="text-ink-secondary text-xs font-medium uppercase tracking-widest group-hover:text-teal transition-colors">
                    Edit Program Details
                  </span>
                  {isEditOpen
                    ? <HiChevronUp className="text-ink-muted" size={16} />
                    : <HiChevronDown className="text-ink-muted" size={16} />
                  }
                </button>

                {isEditOpen && form && (
                  <div className="mt-5 space-y-6">

                    {/* Basic fields */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">Description (EN)</label>
                        <textarea
                          rows={4}
                          className="admin-input w-full resize-y"
                          value={form.description}
                          onChange={e => updateForm(prog.id, { description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Description (TH)</label>
                        <textarea
                          rows={4}
                          className="admin-input w-full resize-y"
                          value={form.descriptionTH}
                          onChange={e => updateForm(prog.id, { descriptionTH: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="admin-label">Fees per Semester</label>
                        <input
                          type="text"
                          className="admin-input w-full"
                          value={form.feesPerSemester}
                          onChange={e => updateForm(prog.id, { feesPerSemester: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Total Fees</label>
                        <input
                          type="text"
                          className="admin-input w-full"
                          value={form.fees}
                          onChange={e => updateForm(prog.id, { fees: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Official URL</label>
                        <input
                          type="text"
                          className="admin-input w-full"
                          value={form.officialUrl}
                          onChange={e => updateForm(prog.id, { officialUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Careers */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="admin-label mb-0">Career Outcomes</label>
                        <button
                          type="button"
                          onClick={() => addCareer(prog.id)}
                          className="admin-btn-secondary flex items-center gap-1 text-xs"
                        >
                          <HiPlus size={12} /> Add Career
                        </button>
                      </div>
                      <div className="space-y-2">
                        {form.careers.map((career, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <div className="flex-1 grid sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="English"
                                className="admin-input w-full"
                                value={career.en}
                                onChange={e => updateCareer(prog.id, idx, 'en', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="ภาษาไทย"
                                className="admin-input w-full"
                                value={career.th}
                                onChange={e => updateCareer(prog.id, idx, 'th', e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCareer(prog.id, idx)}
                              className="admin-btn-danger flex items-center justify-center w-8 h-8 shrink-0 mt-0.5"
                            >
                              <HiTrash size={13} />
                            </button>
                          </div>
                        ))}
                        {form.careers.length === 0 && (
                          <p className="text-ink-muted text-xs italic">No career outcomes. Add one above.</p>
                        )}
                      </div>
                    </div>

                    {/* Curriculum Structure */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="admin-label mb-0">Curriculum Structure</label>
                        <button
                          type="button"
                          onClick={() => addCurriculumItem(prog.id)}
                          className="admin-btn-secondary flex items-center gap-1 text-xs"
                        >
                          <HiPlus size={12} /> Add Item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {form.curriculumStructure.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <div className="flex-1 grid sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Label (EN)"
                                className="admin-input w-full"
                                value={item.label}
                                onChange={e => updateCurriculumItem(prog.id, idx, 'label', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Label (TH)"
                                className="admin-input w-full"
                                value={item.labelTH}
                                onChange={e => updateCurriculumItem(prog.id, idx, 'labelTH', e.target.value)}
                              />
                              <input
                                type="number"
                                placeholder="Credits"
                                className="admin-input w-full"
                                value={item.credits}
                                onChange={e => updateCurriculumItem(prog.id, idx, 'credits', Number(e.target.value))}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCurriculumItem(prog.id, idx)}
                              className="admin-btn-danger flex items-center justify-center w-8 h-8 shrink-0 mt-0.5"
                            >
                              <HiTrash size={13} />
                            </button>
                          </div>
                        ))}
                        {form.curriculumStructure.length === 0 && (
                          <p className="text-ink-muted text-xs italic">No curriculum items. Add one above.</p>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="admin-label mb-0">Program Highlights (EN)</label>
                        <button
                          type="button"
                          onClick={() => addFeature(prog.id)}
                          className="admin-btn-secondary flex items-center gap-1 text-xs"
                        >
                          <HiPlus size={12} /> Add Feature
                        </button>
                      </div>
                      <div className="space-y-2">
                        {form.features.map((feature, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <input
                              type="text"
                              className="admin-input flex-1"
                              value={feature}
                              onChange={e => updateFeature(prog.id, idx, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeFeature(prog.id, idx)}
                              className="admin-btn-danger flex items-center justify-center w-8 h-8 shrink-0 mt-0.5"
                            >
                              <HiTrash size={13} />
                            </button>
                          </div>
                        ))}
                        {form.features.length === 0 && (
                          <p className="text-ink-muted text-xs italic">No highlights. Add one above.</p>
                        )}
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSave(prog.id)}
                        disabled={saving[prog.id]}
                        className="admin-btn-primary flex items-center gap-2"
                      >
                        {saving[prog.id] ? (
                          <>
                            <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <HiCheck size={15} />
                            Save Changes
                          </>
                        )}
                      </button>
                      {saveStatus[prog.id] === 'success' && (
                        <span className="text-xs text-green-400">Changes saved successfully.</span>
                      )}
                      {saveStatus[prog.id] === 'error' && (
                        <span className="text-xs text-red-400">Failed to save. Please try again.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
