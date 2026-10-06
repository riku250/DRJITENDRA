import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
  onNavigate: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'सभी तस्वीरें (All)' },
    { id: 'clinic', label: 'क्लिनिक परिसर' },
    { id: 'xray', label: 'X-Ray जांच' },
    { id: 'physiotherapy', label: 'फिजियोथेरेपी' },
    { id: 'facilities', label: 'उपकरण व सुविधाएं' }
  ];

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">Photo Gallery</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>तस्वीरें व झलकियां</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          क्लिनिक फोटो गैलरी (Gallery)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          मां जानकी एक्स-रे क्लिनिक के आधुनिक उपकरणों, स्वच्छ परामर्श कक्ष तथा नैदानिक सुविधाओं की एक झलक।
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-60 overflow-hidden bg-slate-100">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-xs">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1 bg-white">
              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-white space-y-1">
              <h3 className="text-lg font-bold text-slate-900">{selectedImage.title}</h3>
              <p className="text-sm text-slate-600">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
