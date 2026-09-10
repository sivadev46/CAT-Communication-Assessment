import React, { useState, useEffect } from 'react';
import { Layers, Lock, Unlock, Plus, Edit3, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal/Modal';
import { catSupabaseService } from '../services/catSupabase';

export default function AdminModules() {
  const [modules, setModules] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    ageRange: '',
    description: '',
    status: 'published',
  });

  const loadModules = async () => {
    const data = await catSupabaseService.getPublishedModules();
    setModules(data);
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleOpenEdit = (mod) => {
    setSelectedModule(mod);
    setFormData({
      name: mod.name,
      subtitle: mod.subtitle || '',
      ageRange: mod.age_range || mod.ageRange || '',
      description: mod.description || '',
      status: mod.status || 'published',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    const newMod = {
      id: selectedModule ? selectedModule.id : `m-${Date.now()}`,
      module_number: selectedModule ? selectedModule.module_number : modules.length + 1,
      name: formData.name,
      subtitle: formData.subtitle,
      age_range: formData.ageRange,
      description: formData.description,
      status: formData.status,
      display_order: selectedModule ? selectedModule.display_order : modules.length + 1,
    };

    if (selectedModule) {
      setModules((prev) => prev.map((m) => (m.id === selectedModule.id ? newMod : m)));
    } else {
      setModules((prev) => [...prev, newMod]);
    }

    setIsAddModalOpen(false);
    setSelectedModule(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-white font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121218] p-6 rounded-2xl border border-[#27273A] shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-[#FFE600]" />
            Manage Assessment Modules
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Create and edit clinical assessment modules. Module names dynamically populate the assessment UI.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedModule(null);
            setFormData({ name: '', subtitle: '', ageRange: '', description: '', status: 'published' });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>+ Add Module</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const isUnlocked = mod.status === 'published';
          return (
            <div
              key={mod.id}
              className="p-5 rounded-2xl border border-[#27273A] bg-[#121218] shadow-xl flex flex-col justify-between space-y-4 hover:border-[#FFE600] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30">
                    MODULE {mod.module_number || mod.moduleNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {isUnlocked ? 'Published' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white leading-snug">
                  {mod.name}
                </h3>
                <p className="text-xs font-bold text-[#FFE600]">
                  Age Range: {mod.age_range || mod.ageRange}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                  {mod.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#27273A] flex items-center justify-end">
                <button
                  onClick={() => handleOpenEdit(mod)}
                  className="px-4 py-2 rounded-xl bg-[#1A1A24] hover:bg-[#27273A] border border-[#27273A] text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Edit Module</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Module Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={selectedModule ? 'Edit Module' : 'Add New Module'}
      >
        <form onSubmit={handleSaveModule} className="p-5 space-y-4 bg-[#121218] text-white text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Module Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              placeholder="e.g. Pre-Intentional Communication Tool"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              placeholder="e.g. Early Auditory & Social Response Behaviors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Age Range *</label>
              <input
                type="text"
                required
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
                placeholder="e.g. 0–3 months"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              >
                <option value="published">Published (Unlocked)</option>
                <option value="locked">Locked</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              placeholder="Clinical description of module scope..."
            />
          </div>

          <div className="pt-3 border-t border-[#27273A] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 bg-[#1A1A24] border border-[#27273A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-md"
            >
              Save Module
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
