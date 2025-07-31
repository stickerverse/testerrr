import React from 'react';
import type { Shape, ShapeId } from '../../types';

interface ShapeSelectorProps {
  shapes: Shape[];
  selectedShape: Shape;
  setSelectedShapeId: (id: ShapeId) => void;
}

interface ShapeItemProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
}

const ShapeItem: React.FC<ShapeItemProps> = ({ shape, isSelected, onSelect }) => (
  <div 
    onClick={onSelect}
    role="option" 
    aria-selected={isSelected}
    className={`flex flex-col items-center justify-center gap-3 p-4 h-24 text-sm font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-md border hover:scale-[1.03] hover:-translate-y-0.5 cursor-pointer
    ${
        isSelected ? 'bg-blue-500/20 text-white shadow-blue-500/20 border-blue-400' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
    }`}
  >
    <div className={isSelected ? 'text-blue-300' : 'text-zinc-300'}>
        {shape.icon}
    </div>
    <span className="text-sm font-medium">{shape.name}</span>
  </div>
);

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({ shapes, selectedShape, setSelectedShapeId }) => {
  return (
    <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Sticker Shape</h2>
        <div 
          className="relative h-96 bg-black/20 p-4 rounded-2xl overflow-hidden"
        >
            <div className="absolute inset-0 -z-10 bg-zinc-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                <div className="grid grid-cols-2 gap-4">
                    {shapes.map((shape) => (
                        <ShapeItem
                            key={shape.id}
                            shape={shape}
                            isSelected={shape.id === selectedShape.id}
                            onSelect={() => setSelectedShapeId(shape.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};