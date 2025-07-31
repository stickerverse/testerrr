import React, { useState } from 'react';
import AnimatedButton from '../AnimatedButton';
import FloatingLabelInput from '../FloatingLabelInput';

export const TextPanel = () => {
    const [text, setText] = useState('');
    const [font, setFont] = useState('Arial');

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Insert Text</h2>

            <div className="relative h-72 bg-black/20 p-3 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-zinc-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                    <div className="space-y-4 p-4">
                        <div>
                            <FloatingLabelInput
                                id="text-input"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                label="Your Text"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="font-select" className="block text-sm font-medium text-zinc-300 mb-1">Font</label>
                            <select 
                                id="font-select" 
                                value={font}
                                onChange={(e) => setFont(e.target.value)}
                                className="w-full bg-zinc-800/80 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/80 shadow-inner backdrop-blur-sm transition-colors duration-300"
                            >
                                <option className="bg-zinc-900">Arial</option>
                                <option className="bg-zinc-900">Helvetica</option>
                                <option className="bg-zinc-900">Lobster</option>
                                <option className="bg-zinc-900">Roboto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Color</label>
                            <div className="flex gap-2">
                                {['#FFFFFF', '#000000', '#EF4444', '#3B82F6', '#22C55E'].map((color, i) => (
                                   <button 
                                        key={color} 
                                        style={{ backgroundColor: color }} 
                                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 shadow-md hover:scale-110 ${ i === 3 ? 'ring-2 ring-offset-2 ring-offset-black/20 ring-blue-400 border-transparent' : 'border-transparent hover:border-white/50'}`}
                                        aria-label={`Color ${color}`}
                                   />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center pt-4">
                            <AnimatedButton text="ADD TEXT" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};