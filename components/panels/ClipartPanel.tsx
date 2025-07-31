import React from 'react';

const cliparts = [
    'https://api.iconify.design/twemoji:star.svg',
    'https://api.iconify.design/twemoji:sparkles.svg',
    'https://api.iconify.design/twemoji:fire.svg',
    'https://api.iconify.design/twemoji:thumbs-up.svg',
    'https://api.iconify.design/twemoji:ghost.svg',
    'https://api.iconify.design/twemoji:alien.svg',
    'https://api.iconify.design/twemoji:cat-face.svg',
    'https://api.iconify.design/twemoji:pizza.svg',
    'https://api.iconify.design/twemoji:rocket.svg',
];

export const ClipartPanel = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Add Clipart</h2>
            <div 
                className="relative h-72 bg-black/20 p-3 rounded-2xl overflow-hidden"
            >
                <div className="absolute inset-0 -z-10 bg-zinc-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                    <div className="group grid grid-cols-3 gap-3">
                        {cliparts.map((url, index) => (
                            <button 
                                key={index}
                                className="aspect-square bg-white/5 rounded-lg flex items-center justify-center p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/80 shadow-md border border-transparent 
                                       hover:scale-125 
                                       group-hover:[&:not(:hover)]:scale-90 group-hover:[&:not(:hover)]:blur-sm group-hover:[&:not(:hover)]:opacity-70"
                                aria-label={`Clipart ${index + 1}`}
                            >
                                <img src={url} alt="" className="w-full h-full object-contain drop-shadow-lg"/>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};