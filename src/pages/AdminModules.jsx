import React, { useState } from 'react';
import { Layers, Lock, Unlock, Plus, Edit3, CheckCircle, Save } from 'lucide-react';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';

const INITIAL_MODULES = [
  {
    id: 'm1',
    moduleNumber: 1,
    name: 'Pre-Intentional Communication Tool',
    subtitle: 'Early Auditory & Social Response Behaviors',
    ageRange: '0–3 months',
    description: 'Evaluates foundational auditory responsiveness, social engagement, vocalization patterns, and reflex/orienting behaviors in infants aged 0 to 3 months.',
    activityCount: 21,
    status: 'published', // 'published' | 'locked' | 'draft'
  },
  {
    id: 'm2',
    moduleNumber: 2,
    name: 'Intentional Communication Tool',
    subtitle: 'Gaze Shift, Pointing & Early Gestures',
    ageRange: '3–6 months',
    description: 'Evaluates emerging intentional communication, gaze shifting, reaching, and early vocal imitations.',
    activityCount: 30,
    status: 'locked',
  },
  {
    id: 'm3',
    moduleNumber: 3,
    name: 'Early Symbolic Communication',
    subtitle: 'Babbling & Functional Gestures',
    ageRange: '6–9 months',
    description: 'Evaluates canonical babbling, gesture comprehension, and shared attention during structured play.',
    activityCount: 30,
    status: 'locked',
  },
  {
    id: 'm4',
    moduleNumber: 4,
    name: 'First Words & Receptive Vocabulary',
    subtitle: 'Single Word Production & Receptive Naming',
    ageRange: '9–12 months',
    description: 'Evaluates first functional words, following single commands, and identifying familiar objects.',
    activityCount: 30,
    status: 'locked',
  },
  {
    id: 'm5',
    moduleNumber: 5,
    name: 'Early Word Combinations',
    subtitle: '2-Word Phrases & Semantic Relations',
    ageRange: '12–18 months',
    description: 'Evaluates vocabulary expansion, 2-word phrase combinations, and expressive gestures.',
    activityCount: 30,
    status: 'locked',
  },
  {
    id: 'm6',
    moduleNumber: 6,
    name: 'Complex Sentence Structures',
    subtitle: 'Grammatical Development & Storytelling',
    ageRange: '18–24 months',
    description: 'Evaluates 3+ word sentences, grammatical morphemes, and early narrative skills.',
    activityCount: 30,
    status: 'locked',
  },
  {
    id: 'm7',
    moduleNumber: 7,
    name: 'Pragmatics & Peer Interaction',
    subtitle: 'Conversational Turn-taking & Social Play',
    ageRange: '24–36 months',
    description: 'Evaluates pragmatic turn-taking, topic maintenance, and social engagement with peers.',
    activityCount: 30,
    status: 'locked',
  },
  {
    id: 'm8',
    moduleNumber: 8,
    name: 'Advanced Speech & Language Mechanics',
    subtitle: 'Phonological Processing & Executive Function',
    ageRange: '36+ months',
    description: 'Evaluates advanced articulation, phonological processing, and complex problem solving.',
    activityCount: 30,
    status: 'locked',
  },
];

export default function AdminModules() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    ageRange: '',
    description: '',
    status: 'published',
  });

  const handleOpenEdit = (mod) => {
    setSelectedModule(mod);
    setFormData({
      name: mod.name,
      subtitle: mod.subtitle,
      ageRange: mod.ageRange,
      description: mod.description,
      status: mod.status,
    });
    setIsAddModalOpen(true);
  };

  const handleToggleLock = (id) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'locked' ? 'published' : 'locked' } : m
      )
    );
  };

  const handleSaveModule = (e) => {
    e.preventDefault();
    if (selectedModule) {
      setModules((prev) =>
        prev.map((m) => (m.id === selectedModule.id ? { ...m, ...formData } : m))
      );
    } else {
      const newMod = {
        id: `m${modules.length + 1}`,
        moduleNumber: modules.length + 1,
        activityCount: 0,
        ...formData,
      };
      setModules((prev) => [...prev, newMod]);
    }
    setIsAddModalOpen(false);
    setSelectedModule(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Manage Assessment Modules
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Configure the 8 clinical assessment modules, age brackets, and lock/unlock status.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedModule(null);
            setFormData({ name: '', subtitle: '', ageRange: '', description: '', status: 'published' });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Add Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const isUnlocked = mod.status === 'published';
          return (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm'
                  : 'bg-gray-50/80 dark:bg-slate-950/60 border-gray-200 dark:border-slate-850 opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    MODULE {mod.moduleNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-400'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {isUnlocked ? 'Published' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  {mod.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Age Range: {mod.ageRange} • {mod.activityCount} Activities
                </p>
                <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-3">
                  {mod.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleToggleLock(mod.id)}
                  className="text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {isUnlocked ? 'Lock Module' : 'Unlock Module'}
                </button>
                <button
                  onClick={() => handleOpenEdit(mod)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
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
        <form onSubmit={handleSaveModule} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Module Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              placeholder="e.g. Pre-Intentional Communication Tool"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              placeholder="e.g. Early Auditory & Social Response Behaviors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Age Range
              </label>
              <input
                type="text"
                required
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                placeholder="e.g. 0–3 months"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="published">Published (Unlocked)</option>
                <option value="locked">Locked</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              placeholder="Clinical description of module scope..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 border border-gray-300 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              Save Module
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
