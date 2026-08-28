import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ClipboardCheck, ArrowRight, RotateCcw } from 'lucide-react';
import AssessmentEngine from '../components/Assessment/AssessmentEngine';
import { patientService } from '../services/patientService';
import { calculateAge } from '../utils/ageUtils';

export default function Assessment() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([
    { id: 'p-1', name: 'Aarav Kumar', patient_id_code: 'CAT-2026-00124', date_of_birth: '2026-05-12', gender: 'Male' },
    { id: 'p-2', name: 'Eleanor Vance', patient_id_code: 'CAT-2026-08411', date_of_birth: '2026-03-20', gender: 'Female' },
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
        console.error('Error fetching patients for assessment:', err);
      }
    };
    loadPatients();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {!isAssessmentActive ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <ClipboardCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                Clinical Communication Assessment
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Select an assigned patient to start or resume Module 1 (Pre-Intentional Communication, 0–3 Months).
              </p>
            </div>
          </div>

          {/* Patient Selection Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4 max-w-xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Select Patient for Evaluation
            </label>
            <select
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                const pt = patients.find((p) => (p.id || p._id) === e.target.value);
                if (pt) setSelectedPatient(pt);
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-medium text-sm focus:ring-2 focus:ring-blue-500"
            >
              {patients.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.fullName || p.name} ({p.patient_id_code || p.patientId || 'CAT-2026-00124'})
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-2 text-xs text-gray-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Patient ID Code:</span>
                  <strong className="font-mono text-gray-900 dark:text-slate-100 font-bold">
                    {selectedPatient.patient_id_code || selectedPatient.patientId || 'CAT-2026-00124'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Exact Dynamic Age:</span>
                  <strong className="text-blue-700 dark:text-blue-400 font-bold">
                    {selectedPatient.date_of_birth
                      ? calculateAge(selectedPatient.date_of_birth).formatted
                      : selectedPatient.age || '3 months 16 days'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Gender:</span>
                  <strong className="text-gray-900 dark:text-slate-100">
                    {selectedPatient.gender || 'Male'}
                  </strong>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsAssessmentActive(true)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <span>Start / Continue Module 1 Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <AssessmentEngine
          patient={selectedPatient}
          role="therapist"
          onExit={() => setIsAssessmentActive(false)}
          onComplete={() => {
            // Stay on completed state or exit
          }}
        />
      )}
    </div>
  );
}
