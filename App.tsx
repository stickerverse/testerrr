import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { MATERIALS, SHAPES } from './constants';
import type { Material, EditorTabId, Shape, ShapeId } from './types';
import { AuthProvider } from './firebase/auth';
import { Boxes } from './components/ui/background-boxes';

// Main application
const StickerEditor = () => {
  const [comment, setComment] = useState<string>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('glitter');
  const [activeTab, setActiveTab] = useState<EditorTabId>('upload');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<ShapeId>('die-cut');

  const selectedMaterial = MATERIALS.find(m => m.id === selectedMaterialId) as Material;
  const selectedShape = SHAPES.find(s => s.id === selectedShapeId) as Shape;

  useEffect(() => {
    if (selectedMaterial) {
      setTotalPrice(selectedMaterial.pricePerUnit);
    }
  }, [selectedMaterial]);

  return (
    <div className="relative flex flex-col h-screen bg-slate-900 isolate overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
      </div>
      
      {/* Content */}
      <div className="relative z-30">
        <div className="bg-zinc-900/90 backdrop-blur-sm p-3 flex items-center justify-between border-b border-zinc-800">
          <div className="text-white font-bold text-xl">StickerVerse</div>
        </div>
        <div className="flex flex-1">
          <Preview 
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            selectedShape={selectedShape}
            setActiveTab={setActiveTab}
          />
          <Editor
            comment={comment}
            setComment={setComment}
            materials={MATERIALS}
            selectedMaterial={selectedMaterial}
            setSelectedMaterialId={setSelectedMaterialId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            totalPrice={totalPrice}
            setSelectedImage={setSelectedImage}
            shapes={SHAPES}
            selectedShape={selectedShape}
            setSelectedShapeId={setSelectedShapeId}
          />
        </div>
      </div>
    </div>
  );
};

// Main App wrapper - directly showing StickerEditor without auth
export default function App() {
  return (
    <AuthProvider>
      <StickerEditor />
    </AuthProvider>
  );
}