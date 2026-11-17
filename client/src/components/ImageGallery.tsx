import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[selectedIdx] || '/images/product/scissor lift.jpg';

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
        <img
          src={currentImage}
          alt={`${productName} - Image ${selectedIdx + 1}`}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover zoom pill */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-[#2F5FA8] text-white p-2.5 rounded-xl shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>View High-Res</span>
        </button>
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-white p-1 transition-all ${
                selectedIdx === idx
                  ? 'border-[#2F5FA8] shadow-md scale-102'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#E53935] p-2 rounded-full bg-white/10"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="max-w-4xl max-h-[85vh] p-4 flex items-center justify-center">
            <img
              src={currentImage}
              alt={productName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
