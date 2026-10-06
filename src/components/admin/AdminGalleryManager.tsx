import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Plus, Trash2, Camera, Upload, 
  Sparkles, CheckCircle2, AlertCircle, Eye, RefreshCw
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { api } from '../../services/api';
import { MedicinePhotoUploader } from './MedicinePhotoUploader';

interface AdminGalleryManagerProps {
  onNotification?: (msg: string) => void;
  onDataRefresh?: () => void;
}

export const AdminGalleryManager: React.FC<AdminGalleryManagerProps> = ({
  onNotification,
  onDataRefresh
}) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Clinic' | 'Doctor' | 'X-Ray' | 'Physiotherapy' | 'Facilities'>('Doctor');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    const res = await api.getAdminGallery();
    setLoading(false);
    if (res.success && res.data) {
      setGallery(res.data);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handlePostPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('कृपया तस्वीर का शीर्षक (Title) दर्ज करें।');
      return;
    }
    if (!imageUrl) {
      alert('कृपया गैलरी के लिए तस्वीर (Photo) अपलोड या कैप्चर करें।');
      return;
    }

    setIsSubmitting(true);
    const res = await api.addGalleryItem({
      title: title.trim(),
      category,
      description: description.trim(),
      image_url: imageUrl,
      active: true
    });
    setIsSubmitting(false);

    if (res.success) {
      if (onNotification) onNotification('तस्वीर गैलरी में सफलतापूर्वक पोस्ट कर दी गई!');
      setTitle('');
      setDescription('');
      setImageUrl('');
      fetchGallery();
      if (onDataRefresh) onDataRefresh();
    } else {
      alert(res.error || 'तस्वीर पोस्ट करने में समस्या आई।');
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    // Instant 1-click removal without confirmation popup
    setGallery(prev => prev.filter(g => String(g.id) !== String(id)));
    if (onNotification) onNotification(`तस्वीर "${itemTitle}" को तुरंत हटा दिया गया।`);

    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        if (onDataRefresh) onDataRefresh();
      } else {
        fetchGallery(); // rollback on error
      }
    } catch (err) {
      console.error('Delete gallery item error:', err);
      fetchGallery();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <ImageIcon className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>एडमिन गैलरी मैनेजर (Admin Gallery)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            डॉक्टर साहब का काम एवं क्लिनिक की तस्वीरें पोस्ट करें
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            यहाँ से आप अपने मोबाइल कैमरे या गैलरी से सीधे तस्वीरें (मरीजों के सफल इलाज, एक्स-रे, फिजियोथेरेपी व क्लिनिक की झलक) अपलोड कर सकते हैं, जो तुरंत वेबसाइट के गैलरी सेक्शन में दिखाई देंगी।
          </p>
        </div>
      </div>

      {/* Upload New Photo Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">नई तस्वीर जोड़ें (Upload New Photo)</h3>
            <p className="text-xs text-slate-500">कैमरे से लाइव फोटो खींचें या गैलरी से चुनें</p>
          </div>
        </div>

        <form onSubmit={handlePostPhoto} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Title & Category & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  तस्वीर का शीर्षक / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="जैसे: डॉ. जितेन्द्र कुमार द्वारा सफल घुटना इलाज"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  श्रेणी / Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 font-medium"
                >
                  <option value="Doctor">👨‍⚕️ डॉक्टर का कार्य / इलाज (Doctor Work & Treatment)</option>
                  <option value="Clinic">🏥 क्लिनिक परिसर (Clinic Premises)</option>
                  <option value="X-Ray">🩻 X-Ray जांच कक्ष (X-Ray Lab)</option>
                  <option value="Physiotherapy">🏋️ फिजियोथेरेपी यूनिट (Physiotherapy)</option>
                  <option value="Facilities">⚡ आधुनिक उपकरण (Facilities)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विवरण / Description (वैकल्पिक)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="तस्वीर के बारे में संक्षिप्त जानकारी लिखें..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                ></textarea>
              </div>
            </div>

            {/* Right: Photo Uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                तस्वीर (Photo) — लाइव कैमरा या गैलरी <span className="text-rose-500">*</span>
              </label>
              <MedicinePhotoUploader
                value={imageUrl}
                onChange={(dataUrl) => setImageUrl(dataUrl)}
                onNotification={onNotification}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting || !imageUrl || !title.trim()}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-600/30 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'पोस्ट हो रहा है...' : 'गैलरी में पोस्ट करें (Post to Gallery)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Gallery Photos Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">पोस्ट की गई तस्वीरें ({gallery.length})</h3>
              <p className="text-xs text-slate-500">वेबसाइट पर लाइव प्रदर्शित हो रही तस्वीरें</p>
            </div>
          </div>
          <button
            onClick={fetchGallery}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>रिफ्रेश</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">तस्वीरें लोड हो रही हैं...</div>
        ) : gallery.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">अभी कोई तस्वीर पोस्ट नहीं की गई है।</p>
            <p className="text-xs text-slate-500">ऊपर दिए गए फॉर्म से डॉक्टर के काम या क्लिनिक की पहली तस्वीर जोड़ें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.category === 'Doctor' ? '👨‍⚕️ डॉक्टर का काम' : item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> लाइव सक्रिय
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>एक क्लिक में हटाएं</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
