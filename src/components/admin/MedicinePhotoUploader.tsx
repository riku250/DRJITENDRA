import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Crop, Sparkles, RotateCw, ZoomIn, ZoomOut, 
  Check, X, Trash2, Camera, Move, Image as ImageIcon, Sliders, CheckCircle2
} from 'lucide-react';

interface MedicinePhotoUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  onNotification?: (msg: string) => void;
}

type AspectRatioType = '1:1' | '4:3' | '3:4' | 'auto';

export const MedicinePhotoUploader: React.FC<MedicinePhotoUploaderProps> = ({
  value,
  onChange,
  onNotification
}) => {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Interactive Crop Modal State
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0); // -100 to +100
  const [panY, setPanY] = useState<number>(0); // -100 to +100
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [isLiveCropping, setIsLiveCropping] = useState(false);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto size helper (smart fit into 600x600 square with crisp medical white frame)
  const handleApplyAutoSize = async (sourceImg?: string) => {
    const src = sourceImg || value;
    if (!src) return;
    setIsProcessing(true);
    try {
      const autoDataUrl = await autoSizeImage(src, 600);
      onChange(autoDataUrl);
      if (onNotification) {
        onNotification('दवा की फोटो पर ऑटो-साइज़ (600×600) लागू कर दिया गया है।');
      }
    } catch (err) {
      console.error('Auto size error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process selected file
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया एक मान्य इमेज फाइल चुनें (JPG, PNG, WEBP आदि)।');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      if (rawDataUrl) {
        // Automatically optimize & apply initial auto-size
        const optimized = await autoSizeImage(rawDataUrl, 600);
        onChange(optimized);
        setCropSourceImage(rawDataUrl);
        if (onNotification) {
          onNotification('दवा की फोटो सफलतापूर्वक अपलोड हो गई! ऑटो-साइज़ लागू है।');
        }
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert('फोटो लोड करने में त्रुटि हुई।');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  // Open Interactive Crop Tool
  const handleOpenCropTool = () => {
    if (!value) {
      alert('कृपया पहले दवा की फोटो अपलोड करें।');
      return;
    }
    setCropSourceImage(value);
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setAspectRatio('1:1');
    setShowCropModal(true);
  };

  // Update Crop Preview whenever controls change
  useEffect(() => {
    if (!showCropModal || !cropSourceImage) return;

    let isMounted = true;
    const updatePreview = async () => {
      setIsLiveCropping(true);
      try {
        const preview = await renderCroppedImage(
          cropSourceImage,
          zoom,
          panX,
          panY,
          rotation,
          aspectRatio,
          400
        );
        if (isMounted) {
          setCropPreviewUrl(preview);
        }
      } catch (err) {
        console.error('Crop preview error:', err);
      } finally {
        if (isMounted) setIsLiveCropping(false);
      }
    };

    updatePreview();
    return () => {
      isMounted = false;
    };
  }, [showCropModal, cropSourceImage, zoom, panX, panY, rotation, aspectRatio]);

  // Save the cropped image to form
  const handleSaveCrop = async () => {
    if (!cropSourceImage) return;
    setIsProcessing(true);
    try {
      const finalCropped = await renderCroppedImage(
        cropSourceImage,
        zoom,
        panX,
        panY,
        rotation,
        aspectRatio,
        600
      );
      onChange(finalCropped);
      setShowCropModal(false);
      if (onNotification) {
        onNotification('दवा की फोटो सफलतापूर्वक क्रॉप व सेव हो गई!');
      }
    } catch (err) {
      console.error('Save crop error:', err);
      alert('क्रॉप सुरक्षित करने में समस्या आई।');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick 90 deg rotation on main preview
  const handleQuickRotate = async () => {
    if (!value) return;
    setIsProcessing(true);
    try {
      const rotated = await renderCroppedImage(value, 1.0, 0, 0, 90, 'auto', 600);
      onChange(rotated);
      if (onNotification) {
        onNotification('फोटो 90° घुमाई गई।');
      }
    } catch (err) {
      console.error('Rotate error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-teal-700" />
          <span>दवा की तस्वीर (Direct Photo Upload) *</span>
        </label>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          डायरेक्ट अपलोड सक्रिय (No URL required)
        </span>
      </div>

      {/* Main Upload / Preview Container */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-4 ${
          dragOver 
            ? 'border-teal-500 bg-teal-50/80 scale-[1.01]' 
            : value 
              ? 'border-teal-300 bg-teal-50/30' 
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'
        }`}
      >
        {/* Dedicated Gallery Input (standard picker without force capture) */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        {/* Dedicated Camera Input (with capture="environment" for rear mobile camera) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        {value ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Image Preview Thumbnail */}
              <div className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-teal-600 bg-white shadow-md shrink-0">
                <img
                  src={value}
                  alt="Medicine Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleOpenCropTool}
                  title="क्रॉप व ज़ूम टूल खोलें"
                  className="absolute inset-0 bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-bold text-[11px]"
                >
                  <Crop className="w-5 h-5 mb-0.5" />
                  <span>क्रॉप करें</span>
                </button>
              </div>

              {/* Upload Details & Actions */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    फोटो तैयार है
                  </span>
                  <span className="text-[11px] text-slate-500">
                    कैमरा या गैलरी से लोड की गई
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  अपलोड के बाद नीचे दिए गए विकल्पों से <strong>ऑटो-साइज़</strong> करें या <strong>क्रॉप</strong> करके दवा का नाम/स्ट्रिप स्पष्ट करें:
                </p>

                {/* Primary Sizing Buttons: Auto & Crop */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {/* AUTO BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleApplyAutoSize()}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ ऑटो-साइज़ (Auto)</span>
                  </button>

                  {/* CROP BUTTON */}
                  <button
                    type="button"
                    onClick={handleOpenCropTool}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Crop className="w-3.5 h-3.5 text-teal-700" />
                    <span>✂️ क्रॉप करें (Crop & Fit)</span>
                  </button>

                  {/* ROTATE BUTTON */}
                  <button
                    type="button"
                    onClick={handleQuickRotate}
                    disabled={isProcessing}
                    title="90 डिग्री घुमाएं"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>90°</span>
                  </button>

                  {/* CHANGE FILE BUTTON */}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>बदलें (Change)</span>
                  </button>

                  {/* REMOVE BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      if (galleryInputRef.current) galleryInputRef.current.value = '';
                      if (cameraInputRef.current) cameraInputRef.current.value = '';
                    }}
                    title="फोटो हटाएं"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - 2 Distinct Buttons: Live Camera & Direct Gallery */
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 shadow-xs">
              <Camera className="w-7 h-7" />
            </div>
            <div className="text-sm font-black text-slate-900 mb-1">
              दवा की फोटो अपलोड करें / Upload Medicine Photo
            </div>
            <p className="text-xs text-slate-500 mb-4 max-w-sm">
              नीचे दिए गए दोनों विकल्पों में से एक चुनें — सीधे मोबाइल का कैमरा खोलें या गैलरी से फोटो चुनें।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* LIVE CAMERA BUTTON */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <span>📸 लाइव कैमरा (Live Camera)</span>
              </button>

              {/* DIRECT GALLERY BUTTON */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-teal-700" />
                <span>📁 डायरेक्ट गैलरी (Gallery)</span>
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
              <Sparkles className="w-4 h-4 animate-spin text-teal-600" />
              <span>फोटो प्रोसेस हो रही है...</span>
            </div>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* INTERACTIVE CROP MODAL                            */}
      {/* ================================================= */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-teal-300" />
                <h4 className="font-bold text-sm sm:text-base">
                  दवा फोटो क्रॉप एवं साइज़ एडजेस्टमेंट (Crop Tool)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Live Cropped Result Viewport */}
              <div className="space-y-1.5 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  लाइव प्रीव्यू (मरीज को ऐसा दिखेगा)
                </span>
                <div className="mx-auto max-w-[280px] aspect-square rounded-2xl overflow-hidden border-4 border-teal-600 bg-slate-100 shadow-inner flex items-center justify-center relative">
                  {cropPreviewUrl ? (
                    <img
                      src={cropPreviewUrl}
                      alt="Crop Result"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">लोड हो रहा है...</div>
                  )}

                  {isLiveCropping && (
                    <div className="absolute top-2 right-2 bg-teal-900/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-spin" />
                      अपडेट...
                    </div>
                  )}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  1. क्रॉप अनुपात (Aspect Ratio):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1:1', label: '1:1 वर्ग', sub: 'Square' },
                    { id: '4:3', label: '4:3 चौड़ा', sub: 'Landscape' },
                    { id: '3:4', label: '3:4 लंबा', sub: 'Portrait' },
                    { id: 'auto', label: 'ऑटो / मूल', sub: 'Original' }
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setAspectRatio(ratio.id as AspectRatioType)}
                      className={`p-2 rounded-xl text-center border font-bold transition-all cursor-pointer ${
                        aspectRatio === ratio.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs">{ratio.label}</div>
                      <div className={`text-[10px] ${aspectRatio === ratio.id ? 'text-teal-100' : 'text-slate-400'}`}>
                        {ratio.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Control Slider */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-4 h-4 text-teal-700" />
                    2. ज़ूम (Zoom / Focus):
                  </span>
                  <span className="font-mono text-teal-800">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <ZoomIn className="w-4 h-4 text-teal-700 shrink-0" />
                </div>
              </div>

              {/* Pan / Position Controls (X & Y) */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Move className="w-4 h-4 text-teal-700" />
                    3. स्थिति संरेखण (Pan Horizontal / Vertical):
                  </span>
                  <button
                    type="button"
                    onClick={() => { setPanX(0); setPanY(0); }}
                    className="text-[10px] text-teal-700 hover:underline"
                  >
                    रीसेट (Center)
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-[11px] font-semibold text-slate-500">बाएं-दाएं:</span>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="2"
                      value={panX}
                      onChange={(e) => setPanX(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <span className="w-8 text-right font-mono text-[10px] text-slate-500">{panX}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-[11px] font-semibold text-slate-500">ऊपर-नीचे:</span>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="2"
                      value={panY}
                      onChange={(e) => setPanY(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <span className="w-8 text-right font-mono text-[10px] text-slate-500">{panY}</span>
                  </div>
                </div>
              </div>

              {/* Rotate & Quick Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-teal-700" />
                  <span>फोटो 90° घुमाएं ({rotation}°)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1.0);
                    setPanX(0);
                    setPanY(0);
                    setRotation(0);
                    setAspectRatio('1:1');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  डिफ़ॉल्ट सेटिंग्स
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>क्रॉप लागू करें (Apply & Save)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Canvas Cropping & Auto-Size Utilities
// ==========================================

function autoSizeImage(imageSrc: string, targetSize: number = 600): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Crisp clean white background for high quality pharmaceutical presentation
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetSize, targetSize);

      // Scale to fit completely with gentle padding
      const padding = 16;
      const avail = targetSize - padding * 2;
      const scale = Math.min(avail / img.width, avail / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      resolve(dataUrl);
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

function renderCroppedImage(
  imageSrc: string,
  zoom: number,
  panX: number,
  panY: number,
  rotation: number,
  aspectRatio: AspectRatioType,
  targetDimension: number = 600
): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let targetW = targetDimension;
      let targetH = targetDimension;

      if (aspectRatio === '4:3') {
        targetW = targetDimension;
        targetH = Math.round((targetDimension * 3) / 4);
      } else if (aspectRatio === '3:4') {
        targetW = Math.round((targetDimension * 3) / 4);
        targetH = targetDimension;
      } else if (aspectRatio === 'auto') {
        const isRotated = rotation === 90 || rotation === 270;
        const w = isRotated ? img.height : img.width;
        const h = isRotated ? img.width : img.height;
        if (w > h) {
          targetW = targetDimension;
          targetH = Math.round((targetDimension * h) / w);
        } else {
          targetH = targetDimension;
          targetW = Math.round((targetDimension * w) / h);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      ctx.save();
      // Move to center
      ctx.translate(targetW / 2, targetH / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply zoom
      ctx.scale(zoom, zoom);

      // Effective dimensions after accounting for rotation
      const isRotated = rotation === 90 || rotation === 270;
      const baseScale = Math.max(
        targetW / (isRotated ? img.height : img.width),
        targetH / (isRotated ? img.width : img.height)
      );

      const drawW = img.width * baseScale;
      const drawH = img.height * baseScale;

      // Pan offset
      const pixelPanX = (panX / 100) * (targetW / 2);
      const pixelPanY = (panY / 100) * (targetH / 2);

      ctx.drawImage(
        img,
        -drawW / 2 + pixelPanX / zoom,
        -drawH / 2 + pixelPanY / zoom,
        drawW,
        drawH
      );

      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      resolve(dataUrl);
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}
