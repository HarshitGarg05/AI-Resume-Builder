"use client";

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'

export default function ImageCropper({ imageSrc, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      onComplete(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md relative flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Adjust Photo</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
            </button>
        </div>

        <div className="relative w-full h-72 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Square crop for profile
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="cover" // Start with cover
              cropShape="round" // Since it's a profile photo
              showGrid={false}
            />
        </div>

        <div className="flex items-center gap-4 px-2">
            <ZoomOut size={16} className="text-gray-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
            />
            <ZoomIn size={16} className="text-gray-400" />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button 
                onClick={onCancel}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition flex items-center gap-2 active:scale-95 transform"
            >
                <Check size={16} /> Save Photo
            </button>
        </div>
      </div>
    </div>
  )
}
