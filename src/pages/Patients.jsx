import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import RetryButton from '../components/Common/RetryButton';
import { patientService } from '../services/patientService';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentPatient, setCurrentPatient] = useState(null);

  // Form input state for Add / Edit
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    diagnosis: '',
    status: 'Scheduled',
  });

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 9,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await patientService.getPatients(params);
      if (res.success && res.data) {
        setPatients(res.data.patients || []);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients from server.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedStatus]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Handle Status Filter Change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  // Open Add Patient Modal
  const handleOpenAdd = () => {
    setFormData({
      fullName: '',
      age: '',
      gender: 'Male',
      diagnosis: '',
      status: 'Scheduled',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Patient Modal
  const handleOpenEdit = (patient) => {
    setCurrentPatient(patient);
    setFormData({
      fullName: patient.fullName || patient.name || '',
      age: patient.age ? patient.age.toString() : '',
      gender: patient.gender || 'Male',
      diagnosis: patient.diagnosis || '',
      status: patient.status || 'Scheduled',
    });
    setIsEditModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (patient) => {
    setCurrentPatient(patient);
    setIsDeleteModalOpen(true);
  };

  // Save new Patient to API
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.age) return;

    setActionLoading(true);
    try {
      const res = await patientService.createPatient({
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        diagnosis: formData.diagnosis || 'Speech Evaluation Pending',
        status: formData.status,
      });

      if (res.success) {
        setIsAddModalOpen(false);
        fetchPatients();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating patient record.');
    } finally {
      setActionLoading(false);
    }
  };

  // Update existing Patient via API
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentPatient || !formData.fullName.trim() || !formData.age) return;

    setActionLoading(true);
    try {
      const patientId = currentPatient._id || currentPatient.id;
      const res = await patientService.updatePatient(patientId, {
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        diagnosis: formData.diagnosis,
        status: formData.status,
      });

      if (res.success) {
        setIsEditModalOpen(false);
        setCurrentPatient(null);
        fetchPatients();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating patient record.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Patient via API
  const handleDeleteConfirm = async () => {
    if (!currentPatient) return;

    setActionLoading(true);
    try {
      const patientId = currentPatient._id || currentPatient.id;
      const res = await patientService.deletePatient(patientId);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setCurrentPatient(null);
        fetchPatients();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting patient record.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (statusText) => {
    switch (statusText) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Scheduled
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Pending Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {statusText || 'Scheduled'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Patient Management"
        subtitle="View, search, filter, and manage clinical patient files and assessment records."
      >
        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </Button>
      </Header>

      {/* Search and Status Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients by name, ID, or diagnosis..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-600 hidden sm:inline">Status:</span>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="py-2 px-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses ({totalCount})</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Pending Review">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton / Error State / Data List */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : error ? (
        <RetryButton onRetry={fetchPatients} message={error} />
      ) : patients.length === 0 ? (
        <Card className="text-center py-16 px-6">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Patients Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedStatus !== 'All'
              ? 'No patients match your current search criteria or status filter.'
              : 'No patients available in database. Add a patient to begin an assessment.'}
          </p>
          {(searchQuery || selectedStatus !== 'All') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setPage(1);
              }}
              className="mt-4 text-xs"
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {patients.map((patient) => {
              const name = patient.fullName || patient.name || 'Patient';
              const initials = name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <Card
                  key={patient._id || patient.id}
                  className="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-700 shadow-xs flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">{name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {patient.age} yrs • {patient.gender || 'Patient'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(patient.status)}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs space-y-1.5">
                      <div className="flex items-start justify-between text-gray-600">
                        <span className="font-semibold text-gray-500 text-[11px] uppercase">MRN ID:</span>
                        <span className="font-mono text-gray-700">{patient.patientId || patient._id?.slice(-6)}</span>
                      </div>
                      <div className="flex items-start justify-between text-gray-600">
                        <span className="font-semibold text-gray-500 text-[11px] uppercase">Diagnosis:</span>
                        <span className="font-medium text-gray-800 text-right max-w-[170px] truncate">
                          {patient.diagnosis || 'Standard Speech Protocol'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenEdit(patient)}
                      className="py-1 px-2.5 text-xs text-gray-700 hover:text-blue-600 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDelete(patient)}
                      className="py-1 px-2.5 text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 text-xs">
              <p className="text-gray-500">
                Page <span className="font-bold text-gray-800">{page}</span> of{' '}
                <span className="font-bold text-gray-800">{totalPages}</span> ({totalCount} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="py-1.5 px-3 text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="py-1.5 px-3 text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Clinical Patient"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Patient Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Robert Langdon"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                required
                placeholder="e.g. 58"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              placeholder="e.g. Expressive Aphasia"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Assessment Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Patient Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient Details"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Patient Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Assessment Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Details'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Are you sure you want to delete patient file for{' '}
            <span className="font-bold text-gray-900">{currentPatient?.fullName || currentPatient?.name}</span>? This operation will remove their record permanently.
          </p>
          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Patient'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
