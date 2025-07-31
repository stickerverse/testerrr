import React from 'react';

const userImages = [
    'https://i.imgur.com/83u0d6E.png',
    'https://i.imgur.com/vH3vfnS.png',
    'https://i.imgur.com/3dOAmDN.png',
    'https://i.imgur.com/rE2t1gC.png',
];

interface ImageLibraryProps {
    setSelectedImage: (image: string | null) => void;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ setSelectedImage }) => {
    return (
        <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Your Library</h2>
            <div className="relative h-72 bg-black/20 p-3 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-zinc-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                    <div className="grid grid-cols-2 gap-4">
                        {userImages.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(url)}
                                className="aspect-square bg-white/10 rounded-lg flex items-center justify-center p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/80 shadow-md border border-transparent 
                                       hover:scale-105 hover:border-blue-400 hover:bg-blue-500/20"
                                aria-label={`Uploaded Image ${index + 1}`}
                            >
                                <img src={url} alt={`User upload ${index+1}`} className="max-w-full max-h-full object-contain drop-shadow-lg rounded-md"/>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};