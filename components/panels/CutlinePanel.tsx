import React from 'react';
import type { Shape, ShapeId } from '../../types';
import { ShapeSelector } from './ShapeSelector';

interface CutlinePanelProps {
    shapes: Shape[];
    selectedShape: Shape;
    setSelectedShapeId: (id: ShapeId) => void;
}

const OptionButton = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
    <button className={`flex-1 p-3 text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-md border hover:scale-[1.03] hover:-translate-y-0.5
    ${
        active ? 'bg-blue-500/20 text-white shadow-blue-500/20 border-blue-400' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
    }`}
    >
        {children}
    </button>
);

export const CutlinePanel: React.FC<CutlinePanelProps> = ({ shapes, selectedShape, setSelectedShapeId }) => {
    return (
        <div className="space-y-6">
            <ShapeSelector
                shapes={shapes}
                selectedShape={selectedShape}
                setSelectedShapeId={setSelectedShapeId}
            />

            <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Cutline Style</h2>
            
            <div className="relative h-72 bg-black/20 p-3 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-zinc-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                    <div className="space-y-4 p-4">
                        <div>
                            <label htmlFor="cutline-type" className="block text-sm font-medium text-zinc-300 mb-3">Type</label>
                            <div className="flex gap-2">
                                <OptionButton active>Standard</OptionButton>
                                <OptionButton>Complex</OptionButton>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="border-size" className="block text-sm font-medium text-zinc-300 mb-3">
                                Border size <span className="text-zinc-400 font-normal">(0.25")</span>
                            </label>
                            <input 
                                id="border-size"
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05"
                                defaultValue="0.25"
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer backdrop-blur-sm
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-blue-300
                                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-blue-300"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};