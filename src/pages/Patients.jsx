import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Trash2, Edit2, Loader2, Calendar, UserCheck, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal/Modal';
import { catSupabaseService } from '../services/catSupabase';
import { calculateAge } from '../utils/ageUtils';

export default function Patients() {
  const [patients, setPatients] = useState([
    { id: 'p-1', fullName: 'Aarav Kumar', patient_id_code: 'CAT-2026-00124', date_of_birth: '2026-05-12', gender: 'Male', guardianName: 'Rohan Kumar' },
    { id: 'p-2', fullName: 'Eleanor Vance', patient_id_code: 'CAT-2026-08411', date_of_birth: '2026-03-20', gender: 'Female', guardianName: 'Clara Vance' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    guardianName: '',
  });

  const handleOpenAddModal = async () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      guardianName: '',
    });
    setIsAddModalOpen(true);
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.dateOfBirth) return;

    setIsSubmitting(true);
    try {
      const res = await catSupabaseService.createPatient({
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      });

      if (res.success && res.patient) {
        setPatients((prev) => [res.patient, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating patient:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_id_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121218] p-6 rounded-2xl border border-[#27273A] shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-[#FFE600]" />
            Patient Management
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Create patients with DOB, auto-generate Patient IDs, and manage linked parent accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>+ Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search patients by name or Patient ID code (e.g. CAT-2026-00124)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#121218] border border-[#27273A] rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#FFE600]"
        />
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((p) => {
          const ageObj = p.date_of_birth ? calculateAge(p.date_of_birth) : { formatted: '3 months' };

          return (
            <div
              key={p.id || p.patient_id_code}
              className="bg-[#121218] border border-[#27273A] p-5 rounded-2xl shadow-xl space-y-4 hover:border-[#FFE600] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">{p.fullName || p.full_name}</h3>
                  <span className="inline-block mt-1 font-mono text-xs font-bold text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/30 px-2.5 py-0.5 rounded-md">
                    {p.patient_id_code || p.patientId || 'CAT-2026-00124'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  {p.gender || 'Male'}
                </span>
              </div>

              <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#27273A] space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date of Birth:</span>
                  <strong className="text-white font-mono">{p.date_of_birth || '2026-05-12'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exact Dynamic Age:</span>
                  <strong className="text-[#FFE600] font-bold">{ageObj.formatted}</strong>
                </div>
                {p.guardianName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Caregiver:</span>
                    <strong className="text-white">{p.guardianName}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE PATIENT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Patient Profile"
      >
        <form onSubmit={handleCreatePatient} className="p-5 space-y-4 bg-[#121218] text-white text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Full Patient Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Date of Birth (DOB) *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              />
              {formData.dateOfBirth && (
                <p className="text-[11px] font-bold text-[#FFE600] mt-1">
                  Dynamic Age: {calculateAge(formData.dateOfBirth).formatted}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#27273A] text-gray-400 text-[11px]">
            <span className="text-[#FFE600] font-bold block mb-0.5">Auto-Generated Patient ID Code:</span>
            A unique Patient ID (e.g. <code className="text-white font-mono font-bold">CAT-2026-XXXXX</code>) will be generated automatically upon saving for parent account linking.
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFE600] hover:bg-[#FACC15] text-black shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Creating Patient...</span>
                </>
              ) : (
                <span>Save Patient Profile</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
