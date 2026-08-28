import React, { useState } from 'react';
import { Users, UserCheck, HeartHandshake, Plus, Shield, Mail, Phone, Link2 } from 'lucide-react';
import Modal from '../components/Modal/Modal';

const MOCK_THERAPISTS = [
  { id: 'th-1', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@niepmd.org', license: 'SLP-94021', specialization: 'Speech-Language Pathologist', patientsCount: 12 },
  { id: 'th-2', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@niepmd.org', license: 'SLP-88310', specialization: 'Early Intervention Specialist', patientsCount: 8 },
];

const MOCK_PARENTS = [
  { id: 'pr-1', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210', linkedChild: 'Aarav Kumar', patientCode: 'CAT-2026-00124' },
  { id: 'pr-2', name: 'Arthur Vance', email: 'arthur.vance@example.com', phone: '+91 91234 56789', linkedChild: 'Eleanor Vance', patientCode: 'CAT-2026-08411' },
];

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('therapists'); // 'therapists' | 'parents'
  const [therapists, setTherapists] = useState(MOCK_THERAPISTS);
  const [parents, setParents] = useState(MOCK_PARENTS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'therapist',
    license: '',
    phone: '',
    patientCode: '',
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (newUserData.role === 'therapist') {
      setTherapists((prev) => [
        ...prev,
        {
          id: `th-${prev.length + 1}`,
          name: newUserData.name,
          email: newUserData.email,
          license: newUserData.license || 'SLP-PENDING',
          specialization: 'Speech-Language Pathologist',
          patientsCount: 0,
        },
      ]);
    } else {
      setParents((prev) => [
        ...prev,
        {
          id: `pr-${prev.length + 1}`,
          name: newUserData.name,
          email: newUserData.email,
          phone: newUserData.phone,
          linkedChild: 'Ward Linked via Code',
          patientCode: newUserData.patientCode || 'CAT-2026-99999',
        },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            User Management (Therapists & Parents)
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Manage registered Clinicians, Parents/Caregivers, and Patient ID links.
          </p>
        </div>

        <button
          onClick={() => {
            setNewUserData({ name: '', email: '', role: activeTab === 'therapists' ? 'therapist' : 'parent', license: '', phone: '', patientCode: '' });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Add New User
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('therapists')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'therapists'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Therapists / Clinicians ({therapists.length})
        </button>
        <button
          onClick={() => setActiveTab('parents')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'parents'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          Parents / Caregivers ({parents.length})
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'therapists' ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 text-xs font-extrabold uppercase text-gray-500 dark:text-slate-400">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">License Number</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Assigned Patients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {therapists.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-4 font-bold text-gray-900 dark:text-slate-100">{t.name}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-400">{t.email}</td>
                    <td className="p-4 font-semibold text-blue-600">{t.license}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-400">{t.specialization}</td>
                    <td className="p-4 font-bold">{t.patientsCount} Patients</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 text-xs font-extrabold uppercase text-gray-500 dark:text-slate-400">
                <tr>
                  <th className="p-4">Parent Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Linked Child / Ward</th>
                  <th className="p-4">Patient Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {parents.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-4 font-bold text-gray-900 dark:text-slate-100">{p.name}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-400">{p.email}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-400">{p.phone}</td>
                    <td className="p-4 font-semibold text-emerald-700 dark:text-emerald-400">{p.linkedChild}</td>
                    <td className="p-4 font-mono text-xs font-bold text-gray-900 dark:text-slate-100">{p.patientCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Account"
      >
        <form onSubmit={handleCreateUser} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Account Role
            </label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="therapist">Therapist / Clinician</option>
              <option value="parent">Parent / Caregiver</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
              placeholder="e.g. Dr. Sarah Jenkins"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
              placeholder="user@niepmd.org"
            />
          </div>

          {newUserData.role === 'therapist' ? (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                License Number
              </label>
              <input
                type="text"
                value={newUserData.license}
                onChange={(e) => setNewUserData({ ...newUserData, license: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
                placeholder="SLP-94021"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Link Patient ID Code
                </label>
                <input
                  type="text"
                  value={newUserData.patientCode}
                  onChange={(e) => setNewUserData({ ...newUserData, patientCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-mono"
                  placeholder="e.g. CAT-2026-00124"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
