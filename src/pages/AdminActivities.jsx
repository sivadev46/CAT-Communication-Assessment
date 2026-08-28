import React, { useState } from 'react';
import { ClipboardList, Plus, Image as ImageIcon, Video, Upload, Edit3, Trash2 } from 'lucide-react';
import Modal from '../components/Modal/Modal';
import { therapyActivities } from '../data/therapyActivitiesData';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function AdminActivities() {
  const [activitiesList, setActivitiesList] = useState(therapyActivities);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [formData, setFormData] = useState({
    activityNumber: 1,
    title: '',
    category: 'Auditory Response',
    description: '',
    instructions: '',
    imageUrl: '',
    videoUrl: '',
    displayOrder: 1,
  });

  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleOpenEdit = (act, idx) => {
    setSelectedActivity(act);
    setFormData({
      activityNumber: idx + 1,
      title: act.title,
      category: act.category || 'Auditory Response',
      description: act.description || '',
      instructions: Array.isArray(act.instructions) ? act.instructions.join('\n') : (act.instructions || ''),
      imageUrl: act.imagePath || act.image_url || '',
      videoUrl: act.video_url || act.youtubeUrl || '',
      displayOrder: idx + 1,
    });
    setIsAddModalOpen(true);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const filePath = `admin_${field}_${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('assessment-media')
          .upload(filePath, file, { upsert: true });

        if (error) {
          console.warn('Media upload error:', error);
          const localUrl = URL.createObjectURL(file);
          setFormData((prev) => ({ ...prev, [field]: localUrl }));
        } else if (data?.path) {
          const { data: urlData } = supabase.storage.from('assessment-media').getPublicUrl(data.path);
          setFormData((prev) => ({ ...prev, [field]: urlData?.publicUrl || '' }));
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, [field]: localUrl }));
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (selectedActivity) {
      setActivitiesList((prev) =>
        prev.map((a) =>
          a.id === selectedActivity.id
            ? {
                ...a,
                title: formData.title,
                category: formData.category,
                description: formData.description,
                instructions: formData.instructions.split('\n').filter(Boolean),
                imagePath: formData.imageUrl,
                video_url: formData.videoUrl,
              }
            : a
        )
      );
    } else {
      const newAct = {
        id: `act-${String(activitiesList.length + 1).padStart(2, '0')}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        instructions: formData.instructions.split('\n').filter(Boolean),
        imagePath: formData.imageUrl,
        video_url: formData.videoUrl,
      };
      setActivitiesList((prev) => [...prev, newAct]);
    }
    setIsAddModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Manage Module 1 Activities (21 Activities)
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Create, edit, and upload media for the 21 activities under Module 1 (0–3 Months).
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedActivity(null);
            setFormData({
              activityNumber: activitiesList.length + 1,
              title: '',
              category: 'Auditory Response',
              description: '',
              instructions: '',
              imageUrl: '',
              videoUrl: '',
              displayOrder: activitiesList.length + 1,
            });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Add Activity
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 text-xs font-extrabold uppercase text-gray-500 dark:text-slate-400">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Activity Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Media</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {activitiesList.map((act, index) => (
                <tr key={act.id || index} className="hover:bg-gray-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-gray-900 dark:text-slate-100">{index + 1}</td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900 dark:text-slate-100">{act.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{act.description}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {act.category || 'Auditory Response'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs">
                      {(act.imagePath || act.image_url) && (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <ImageIcon className="w-3.5 h-3.5" /> Image
                        </span>
                      )}
                      {(act.video_url || act.youtubeUrl) && (
                        <span className="flex items-center gap-1 text-purple-600 font-semibold">
                          <Video className="w-3.5 h-3.5" /> Video
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(act, index)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Activity Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={selectedActivity ? 'Edit Activity' : 'Add Activity'}
        size="lg"
      >
        <form onSubmit={handleSaveActivity} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Order #
              </label>
              <input
                type="number"
                min={1}
                max={21}
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
                placeholder="e.g. Auditory Response"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Activity Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
              placeholder="e.g. Startle response to loud sudden noises"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Media Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Activity Image (Supabase Storage)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'imageUrl')}
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.imageUrl && (
                <p className="text-[10px] text-emerald-600 mt-1 font-semibold truncate">
                  Attached: {formData.imageUrl}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Instructional Video URL
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-xs"
                placeholder="YouTube or Supabase Storage video link"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingMedia}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              {uploadingMedia ? 'Uploading Media...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
