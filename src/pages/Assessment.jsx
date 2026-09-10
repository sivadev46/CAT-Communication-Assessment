import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowRight, UserCheck } from 'lucide-react';
import AssessmentEngine from '../components/Assessment/AssessmentEngine';
import { patientService } from '../services/patientService';
import { calculateAge } from '../utils/ageUtils';
import { useAuth } from '../context/AuthContext';

export default function Assessment() {
  const { user } = useAuth();
  const userRole = user?.role === 'parent' ? 'parent' : 'therapist';

  const [patients, setPatients] = useState([
    { id: 'p-1', fullName: 'Aarav Kumar', patient_id_code: 'CAT-2026-00124', date_of_birth: '2026-05-12', gender: 'Male' },
    { id: 'p-2', fullName: 'Eleanor Vance', patient_id_code: 'CAT-2026-08411', date_of_birth: '2026-03-20', gender: 'Female' },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await patientService.getPatients({ limit: 50 });
        if (res.success && res.data?.patients?.length) {
          setPatients(res.data.patients);
          setSelectedPatient(res.data.patients[0]);
        }
      } catch (err) {
        console.warn('Error fetching patients for assessment:', err);
      }
    };
    loadPatients();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 text-white">
      {!isAssessmentActive ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <ClipboardCheck className="w-8 h-8 text-[#FFE600]" />
                Communication Assessment Engine
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Shared standardized clinical assessment engine for {userRole === 'parent' ? 'caregiver sessions' : 'clinicians'}.
              </p>
            </div>
          </div>

          {/* Patient Selection Card */}
          <div className="bg-[#121218] p-6 rounded-2xl border border-[#27273A] shadow-xl space-y-5 max-w-xl">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#FFE600]">
              Select Ward / Patient for Evaluation
            </label>
            <select
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                const pt = patients.find((p) => (p.id || p._id) === e.target.value);
                if (pt) setSelectedPatient(pt);
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#27273A] bg-[#1A1A24] text-white font-semibold text-sm focus:border-[#FFE600] focus:ring-2 focus:ring-[#FFE600]/30 outline-none"
            >
              {patients.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.fullName || p.full_name || p.name} ({p.patient_id_code || p.patientId || 'CAT-2026-00124'})
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="p-4 bg-[#1A1A24] rounded-xl border border-[#27273A] space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Patient ID Code:</span>
                  <strong className="font-mono text-[#FFE600] font-bold">
                    {selectedPatient.patient_id_code || selectedPatient.patientId || 'CAT-2026-00124'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exact Dynamic Age:</span>
                  <strong className="text-white font-bold">
                    {selectedPatient.date_of_birth
                      ? calculateAge(selectedPatient.date_of_birth).formatted
                      : selectedPatient.age || '3 months 16 days'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gender:</span>
                  <strong className="text-white font-semibold">
                    {selectedPatient.gender || 'Male'}
                  </strong>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsAssessmentActive(true)}
              className="w-full py-4 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <span>Start / Continue Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <AssessmentEngine
          patient={selectedPatient}
          role={userRole}
          onExit={() => setIsAssessmentActive(false)}
          onComplete={() => {}}
        />
      )}
    </div>
  );
}
