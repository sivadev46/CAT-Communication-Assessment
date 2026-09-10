import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Image as ImageIcon, Video, Edit3, Loader2 } from 'lucide-react';
import Modal from '../components/Modal/Modal';
import { catSupabaseService } from '../services/catSupabase';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function AdminActivities() {
  const [activitiesList, setActivitiesList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

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

  const loadActivities = async () => {
    const data = await catSupabaseService.getModuleActivities('m1000000-0000-0000-0000-000000000001');
    setActivitiesList(data);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleOpenEdit = (act, idx) => {
    setSelectedActivity(act);
    setFormData({
      activityNumber: act.activity_number || idx + 1,
      title: act.title || '',
      category: act.category || 'Auditory Response',
      description: act.description || '',
      instructions: Array.isArray(act.instructions) ? act.instructions.join('\n') : (act.instructions || act.instruction || ''),
      imageUrl: act.image_url || act.imagePath || '',
      videoUrl: act.video_url || act.youtubeUrl || '',
      displayOrder: act.display_order || idx + 1,
    });
    setIsAddModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const filePath = `activity_img_${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('assessment-media')
          .upload(filePath, file, { upsert: true });

        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from('assessment-media').getPublicUrl(data.path);
          setFormData((prev) => ({ ...prev, imageUrl: urlData?.publicUrl || '' }));
        } else {
          const localUrl = URL.createObjectURL(file);
          setFormData((prev) => ({ ...prev, imageUrl: localUrl }));
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, imageUrl: localUrl }));
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    const newAct = {
      id: selectedActivity ? selectedActivity.id : `act-${Date.now()}`,
      activity_number: formData.displayOrder,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      instruction: formData.instructions,
      image_url: formData.imageUrl,
      video_url: formData.videoUrl,
      display_order: formData.displayOrder,
      status: 'published'
    };

    if (selectedActivity) {
      setActivitiesList((prev) => prev.map((a) => (a.id === selectedActivity.id ? newAct : a)));
    } else {
      setActivitiesList((prev) => [...prev, newAct]);
    }

    setIsAddModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-white font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121218] p-6 rounded-2xl border border-[#27273A] shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-[#FFE600]" />
            Manage Assessment Activities ({activitiesList.length} Activities)
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Create activities, upload demonstration images to Supabase Storage, and paste YouTube demonstration URLs.
          </p>
        </div>

        <button
          type="button"
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
          className="px-5 py-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>+ Add Activity</span>
        </button>
      </div>

      <div className="bg-[#121218] rounded-2xl border border-[#27273A] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A24] border-b border-[#27273A] text-gray-400 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Activity Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Media Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27273A]">
              {activitiesList.map((act, index) => (
                <tr key={act.id || index} className="hover:bg-[#1A1A24]/60 transition-colors">
                  <td className="p-4 font-bold text-[#FFE600]">{index + 1}</td>
                  <td className="p-4">
                    <p className="font-extrabold text-white text-sm">{act.title}</p>
                    <p className="text-gray-400 line-clamp-1 mt-0.5">{act.description}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30">
                      {act.category || 'Auditory Response'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-xs">
                      {(act.image_url || act.imagePath) && (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" /> Image
                        </span>
                      )}
                      {(act.video_url || act.youtubeUrl) && (
                        <span className="flex items-center gap-1 text-[#FFE600] font-bold">
                          <Video className="w-3.5 h-3.5" /> Video
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(act, index)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1A1A24] hover:bg-[#27273A] border border-[#27273A] text-gray-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span>Edit</span>
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
        <form onSubmit={handleSaveActivity} className="p-5 space-y-4 bg-[#121218] text-white text-xs">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Display Order #</label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-300 font-bold mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
                placeholder="e.g. Auditory Response"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Activity Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
              placeholder="e.g. Startle response to loud sudden noises"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
            />
          </div>

          {/* Media Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-gray-300 font-bold mb-1">
                Activity Image (Upload to Supabase Storage)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#FFE600] file:text-black hover:file:bg-[#FACC15] cursor-pointer"
              />
              {formData.imageUrl && (
                <p className="text-[11px] text-emerald-400 mt-1 font-mono truncate">
                  Image URL: {formData.imageUrl}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">
                YouTube Video Demonstration URL
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
                placeholder="Paste YouTube URL e.g. https://youtu.be/tSqHEyWPZSI"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Paste YouTube video link. Do NOT upload video files to Supabase.
              </p>
            </div>
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
              disabled={uploadingMedia}
              className="px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploadingMedia ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Uploading Image...</span>
                </>
              ) : (
                <span>Save Activity</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
