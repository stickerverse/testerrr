import React, { useRef, useState, useEffect } from 'react';

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

// Define a type for the global window object with our custom property
declare global {
    interface Window {
        openFileDialog?: () => void;
    }
}

interface UploadPanelProps {
    setSelectedImage: (image: string | null) => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ setSelectedImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Expose a global function that can be called to trigger the file input
        window.openFileDialog = () => {
            console.log('openFileDialog called, clicking on input');
            fileInputRef.current?.click();
        };

        return () => {
            // Clean up the global function
            delete (window as any).openFileDialog;
        };
    }, []);

    const handleFileSelect = (file: File) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, PNG, GIF, SVG)');
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setIsUploading(true);

        // Create FileReader to convert file to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setSelectedImage(result);
            setIsUploading(false);
        };
        reader.onerror = () => {
            alert('Error reading file');
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Upload Your File</h2>
            <div className="relative h-96 bg-black/20 p-4 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-zinc-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-25"></div>
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                    <div 
                        className={`group relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-lg h-full ${
                            isDragOver 
                                ? 'border-blue-400 bg-blue-500/20' 
                                : isUploading
                                ? 'border-yellow-400 bg-yellow-500/10'
                                : 'bg-white/5 border-white/20 hover:border-blue-400 hover:bg-blue-500/10'
                        }`}
                        style={{
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                        id="upload-drop-area"
                    >
                        {isUploading ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                                <p className="mt-4 font-semibold text-white">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <UploadIcon />
                                <p className="mt-4 font-semibold text-white">
                                    {isDragOver ? 'Drop your image here' : 'Drag & drop to upload'}
                                </p>
                                <p className="text-sm text-zinc-400">or browse</p>
                                
                                {/* Add a direct button as a fallback for the file input */}
                                <button 
                                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                  }}
                                >
                                  Select File
                                </button>
                            </>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            aria-label="Upload file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                            onChange={handleFileChange}
                            id="file-upload-input"
                        />
                    </div>
                    <div className="text-xs text-zinc-500 text-center mt-2">
                        <p>Supported formats: JPG, PNG, GIF, SVG</p>
                        <p>Max file size: 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};