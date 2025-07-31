import React from 'react';
import type { Material } from '../../types';
import HolographicCard from '../ui/holographic-card';

interface MaterialPanelProps {
  materials: Material[];
  selectedMaterial: Material;
  setSelectedMaterialId: (id: string) => void;
}

interface MaterialItemProps {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
}

const PremiumBadge = () => (
    <div 
        className="absolute top-1.5 right-1.5 flex items-center justify-center px-1.5 py-0.5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full text-white text-[9px] font-bold shadow-md"
        style={{filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))'}}
    >
        PRO
    </div>
);

const MaterialItem: React.FC<MaterialItemProps> = ({ material, isSelected, onSelect }) => {
  if (material.id === 'holographic') {
    return (
      <li className="group relative" onClick={onSelect} role="option" aria-selected={isSelected}>
        <style>{`
          :root {
            --hc-card-radius: 12px;
          }
          .hc-wrapper {
            perspective: 600px;
            transform: translate3d(0,0,0.1px);
            position: relative;
            width: 100%;
            height: 100%;
          }
          .hc-wrapper::before {
            content: '';
            position: absolute;
            inset: -8px;
            background: radial-gradient(circle at 50% 50%, #00c1ffff 1%, #073aff00 76%), conic-gradient(from 124deg at 50% 50%, #c137ffff 0%, #07c6ffff 40%, #07c6ffff 60%, #c137ffff 100%);
            border-radius: inherit;
            transition: all 0.6s ease;
            filter: contrast(1.5) saturate(1.5) blur(20px);
            transform: scale(0.85);
            opacity: 0.5;
          }
          .hc-wrapper.active::before {
            filter: contrast(1) saturate(1) blur(20px);
            transform: scale(0.95);
            opacity: 1;
          }
          .hc-card {
            width: 100%;
            height: 100%;
            border-radius: var(--hc-card-radius);
            position: relative;
            background: radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y), hsla(266, 100%, 90%, var(--card-opacity, 0)) 4%, hsla(266, 0%, 60%, 0) 100%), radial-gradient(35% 52% at 55% 20%, #00ffaac4 0%, #073aff00 100%), radial-gradient(100% 100% at 50% 50%, #00c1ffff 1%, #073aff00 76%), conic-gradient(from 124deg at 50% 50%, #c137ffff 0%, #07c6ffff 40%, #07c6ffff 60%, #c137ffff 100%);
            overflow: hidden;
            transform-style: preserve-3d;
            transition: transform 1s ease;
            transform: rotateY(var(--rotate-y, 0deg)) rotateX(var(--rotate-x, 0deg));
          }
          .hc-card.active {
            transition: transform 0.1s ease;
          }
          .hc-card * {
            transform-style: preserve-3d;
          }
          .hc-inside {
            position: absolute;
            inset: 1px;
            border-radius: var(--hc-card-radius);
            background: linear-gradient(145deg, #2d2333 0%, #3a5e74 100%);
            transform: translateZ(0.1px);
            overflow: hidden;
          }
          .hc-shine {
            position: absolute;
            inset: 0;
            z-index: 3;
            background: repeating-linear-gradient(0deg, hsl(53, 100%, 69%) calc(5% * 1), hsl(93, 100%, 69%) calc(5% * 2), hsl(176, 100%, 76%) calc(5% * 3), hsl(228, 100%, 74%) calc(5% * 4), hsl(283, 100%, 73%) calc(5% * 5), hsl(2, 100%, 73%) calc(5% * 6), hsl(53, 100%, 69%) calc(5% * 7)), repeating-linear-gradient(-45deg, #0e152e 0%, hsl(180, 10%, 60%) 3.8%, hsl(180, 29%, 66%) 4.5%, hsl(180, 10%, 60%) 5.2%, #0e152e 10%, #0e152e 12%);
            background-position: 0 var(--background-y, 50%), var(--background-x, 50%) var(--background-y, 50%);
            background-size: 500% 500%, 300% 300%;
            background-blend-mode: color-dodge;
            filter: brightness(0.8) contrast(1.5) saturate(0.8);
            opacity: 0.5;
            mix-blend-mode: color-dodge;
          }
          .hc-glare {
            position: absolute;
            inset: 0;
            z-index: 4;
            background: radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y), hsla(0,0%,100%,0.8) 10%, hsla(0,0%,100%,0) 80%);
            mix-blend-mode: overlay;
            opacity: calc(var(--pointer-from-center, 0) * 0.7 + 0.3);
          }
          .hc-content-wrapper {
            position: relative;
            z-index: 5;
            width: 100%;
            height: 100%;
            transform: translateZ(1px);
          }
        `}</style>
        <HolographicCard className="w-full h-full" enableTilt={true}>
          <div className="relative w-full h-full flex flex-col items-center justify-start p-2 rounded-xl cursor-pointer">
            <PremiumBadge />
            <img src={material.image} alt={material.name} className="w-16 h-16 object-contain mb-3 drop-shadow-lg" />
            <span className="font-bold text-center text-sm text-white">
              {material.name}
            </span>
          </div>
        </HolographicCard>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg text-sm text-center text-white bg-zinc-900/80 backdrop-blur-sm shadow-2xl opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 pointer-events-none z-10 origin-bottom">
          <p className="font-bold text-base text-blue-300 mb-1">{material.name}</p>
          <p className="text-zinc-300 text-xs">{material.description}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900/80"></div>
        </div>
      </li>
    );
  }
  
  return (
    <li className="group relative" onClick={onSelect} role="option" aria-selected={isSelected}>
        <div
            className={`relative w-full h-32 flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 backdrop-blur-lg ${
                isSelected
                ? 'bg-blue-500/20 border-blue-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
        >
            {material.id !== 'vinyl' && <PremiumBadge />}
            <img src={material.image} alt={material.name} className="w-16 h-16 object-contain mb-3 drop-shadow-lg" />
            <span className={`font-bold text-center text-sm transition-colors ${isSelected ? 'text-blue-300' : 'text-zinc-300'}`}>
                {material.name}
            </span>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg text-sm text-center text-white bg-zinc-900/80 backdrop-blur-sm shadow-2xl opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 pointer-events-none z-10 origin-bottom">
            <p className="font-bold text-base text-blue-300 mb-1">{material.name}</p>
            <p className="text-zinc-300 text-xs">{material.description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900/80"></div>
        </div>
    </li>
  );
};

export const MaterialPanel: React.FC<MaterialPanelProps> = ({ materials, selectedMaterial, setSelectedMaterialId }) => {
  return (
    <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Choose Material</h2>
        <div 
          className="relative h-96 bg-black/20 p-4 rounded-2xl overflow-hidden"
        >
            <div className="absolute inset-0 -z-10 bg-zinc-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                <ul className="grid grid-cols-2 gap-4" role="listbox" aria-label="Materials">
                    {materials.map((material) => (
                        <MaterialItem
                            key={material.id}
                            material={material}
                            isSelected={material.id === selectedMaterial.id}
                            onSelect={() => setSelectedMaterialId(material.id)}
                        />
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};