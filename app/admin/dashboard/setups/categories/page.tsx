'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SetupCategoriesPage() {
  const { data: session } = useSession();
  const token = session?.accessToken || '';

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/setup-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    try {
      const url = editId
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/setup-categories/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/setup-categories`;

      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, slug })
      });

      const data = await res.json();

      if (res.ok && data.status) {
        setFeedback({ type: 'success', text: `Category ${editId ? 'updated' : 'created'} successfully!` });
        setName('');
        setSlug('');
        setEditId(null);
        fetchCategories();
      } else {
        setFeedback({ type: 'error', text: data.message || 'Error saving category' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error saving category' });
    }
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/setup-categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFeedback({ type: 'success', text: 'Category deleted successfully' });
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log(categories);
  return (
    <div className="min-h-screen bg-[#0d131a] text-[#d9e3f4] p-6 lg:p-10 font-sans pb-24">
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/admin/dashboard/setups"
          className="inline-flex items-center gap-2 text-sm text-[#788ca5] hover:text-primaryColor transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Setups</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primaryColor/10 border border-primaryColor/20 text-primaryColor">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Setup Categories
            </h1>
            <p className="text-xs lg:text-sm text-[#788ca5]">
              Manage categories for your setup bundles.
            </p>
          </div>
        </div>

        {feedback && (
          <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{feedback.text}</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1">
          <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {editId ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Ultra Light Setup"
                  className="w-full px-4 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor transition-all"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primaryColor text-slate-950 font-bold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {editId ? 'Update' : 'Add'}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setName('');
                      setSlug('');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-greyColor/30 text-white text-sm hover:bg-greyColor/20 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-[#788ca5]">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-greyColor/20 rounded-xl text-[#788ca5]">
              No categories found. Create one to get started.
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="p-4 rounded-xl bg-[#121922] border border-greyColor/20 flex items-center justify-between hover:border-greyColor/40 transition-all">
                <div>
                  <div className="font-bold text-white text-sm">{cat.name}</div>
                  <div className="text-xs text-[#788ca5] font-mono mt-0.5">{cat.slug}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 rounded-lg hover:bg-greyColor/20 text-[#788ca5] hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/20 text-[#788ca5] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
