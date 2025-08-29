import React, { useMemo, useState } from 'react';
import { corporateTemplates, CORPORATE_CATEGORIES } from '../templates/corporateTemplates';

function TemplateGallery({ onSelectTemplate, selectedTemplateId }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return corporateTemplates.filter((t) => {
      const matchesSearch = !s || t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s);
      const matchesCategory = category === 'All' || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
  };

  return (
    <div className="w-full mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center text-white text-lg font-semibold">
          <span className="mr-2">🎯</span> Select Email Purpose
        </label>
        <div className="flex gap-2">
          <select
            className="shadow border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All" className="bg-gray-800">All Categories</option>
            {CORPORATE_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-gray-800">{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search purposes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg py-2 px-3 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 border rounded-lg backdrop-filter backdrop-blur-sm transition duration-200 cursor-pointer ${
              selectedTemplateId === t.id
                ? 'border-blue-400 bg-blue-900 bg-opacity-30 shadow-lg transform scale-105'
                : 'border-white border-opacity-20 bg-black bg-opacity-25 hover:bg-opacity-35 hover:border-opacity-40'
            }`}
            onClick={() => handleSelectTemplate(t)}
          >
            <div className="text-white font-medium mb-1">{t.title}</div>
            <div className="text-xs text-white text-opacity-80 mb-2">{t.category}</div>
            <div className="text-sm text-white text-opacity-80 mb-3">{t.description}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white text-opacity-60">
                {selectedTemplateId === t.id ? '✓ Selected' : 'Click to select'}
              </div>
              {selectedTemplateId === t.id && (
                <div className="text-blue-400 text-sm">Active</div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-white text-opacity-70 text-sm">No templates match your search.</div>
        )}
      </div>
    </div>
  );
}

export default TemplateGallery;
