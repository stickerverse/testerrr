import React from 'react';
import { TransformableImage } from './TransformableImage';
import type { Shape, EditorTabId } from '../types';

// Define a type for the global window object with our custom property
declare global {
  interface Window {
    openFileDialog?: () => void;
  }
}

interface PreviewProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  selectedShape: Shape;
  setActiveTab?: (id: EditorTabId) => void; // Updated type
}

interface ViewToggleProps {
    children: React.ReactNode;
    active?: boolean;
    badge?: string;
}

const ViewToggleButton: React.FC<ViewToggleProps> = ({ children, active = false, badge }) => (
    <button className={`relative text-sm font-bold py-2 px-6 rounded-full transition-all duration-300 backdrop-blur-lg border hover:scale-105 hover:-translate-y-0.5
        ${active 
            ? 'bg-gradient-to-r from-fuchsia-600/60 to-purple-600/60 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-500/30' 
            : 'bg-black/40 text-zinc-300 border-white/10 hover:bg-black/50 hover:text-white hover:border-fuchsia-500/30'
        }`}>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-fuchsia-300' : 'bg-zinc-500'}`}></div>
            {children}
        </div>
        {badge && (
            <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-br from-green-400 to-green-500 text-black font-bold rounded-full px-1.5 py-0.5 shadow-md shadow-green-500/20 animate-pulse">
                {badge}
            </span>
        )}
    </button>
);

const getShapeClasses = (shapeId: string) => {
    switch (shapeId) {
        case 'circle': return 'rounded-full aspect-square';
        case 'square': return 'rounded-none aspect-square';
        case 'rounded-square': return 'rounded-3xl aspect-square';
        case 'rectangle': return 'rounded-xl aspect-[4/3]';
        case 'oval': return 'rounded-full aspect-[4/3]';
        default: return ''; // For die-cut
    }
}

export const Preview: React.FC<PreviewProps> = ({ selectedImage, setSelectedImage, selectedShape, setActiveTab }) => {
  const isDieCut = selectedShape.id === 'die-cut';

  const handlePlaceholderClick = () => {
    console.log('Placeholder clicked, setting active tab to upload');
    if (setActiveTab) {
      // Set the active tab to 'upload'
      setActiveTab('upload');
      
      // Trigger the file input click with a delay to ensure the tab has changed
      setTimeout(() => {
        console.log('Trying to trigger file dialog');
        // Try the global function first
        if (typeof window.openFileDialog === 'function') {
          console.log('Calling openFileDialog');
          window.openFileDialog();
          return;
        }
        
        // Try to find the direct button
        const uploadButton = document.querySelector('#upload-drop-area button');
        if (uploadButton) {
          console.log('Found upload button, clicking it');
          (uploadButton as HTMLButtonElement).click();
          return;
        }
        
        // Try to find the file input directly
        const fileInput = document.querySelector('#file-upload-input');
        if (fileInput) {
          console.log('Found file input, clicking it');
          (fileInput as HTMLInputElement).click();
          return;
        }
        
        // Last resort: try to find any file input
        const uploadInputs = document.querySelectorAll('input[type="file"]');
        console.log('Found upload inputs:', uploadInputs.length);
        
        if (uploadInputs.length > 0) {
          const uploadInput = uploadInputs[0] as HTMLInputElement;
          console.log('Clicking on file input');
          uploadInput.click();
        } else {
          console.error('File input not found!');
        }
      }, 500); // Increased timeout to ensure the DOM has updated
    }
  };

  const ShapeContainer: React.FC<{children: React.ReactNode}> = ({ children }) => {
    if (isDieCut) {
        return <>{children}</>;
    }

    return (
      <div 
        className={`relative w-[350px] overflow-hidden flex items-center justify-center transition-all duration-300 ${getShapeClasses(selectedShape.id)}`}
        // This container clips the content (the TransformableImage)
      >
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-fuchsia-500/10 pointer-events-none" 
               style={{ borderRadius: 'inherit' }}></div>
          
          {/* Light reflection effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 'inherit' }}>
            <div className="absolute top-0 left-[-100%] w-[300%] h-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45 animate-shine"></div>
          </div>
          
          {children}
          
          {/* Premium outer border with glow effect */}
          <div className="absolute inset-0 border-[3px] border-fuchsia-500 pointer-events-none animate-pulse" 
               style={{ 
                 borderRadius: 'inherit',
                 boxShadow: '0 0 20px 2px rgba(217, 70, 239, 0.5), inset 0 0 10px rgba(217, 70, 239, 0.3)',
                 animationDuration: '3s'
               }}></div>
          
          {/* Inner dashed border for better visibility */}
          <div className="absolute inset-[4px] border-[2px] border-dashed border-white/60 pointer-events-none" style={{ borderRadius: 'inherit' }}></div>
          
          {/* Corner accents to enhance premium look */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-fuchsia-500 pointer-events-none"
               style={{ borderRadius: 'inherit 0 0 0' }}></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-fuchsia-500 pointer-events-none"
               style={{ borderRadius: '0 inherit 0 0' }}></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-fuchsia-500 pointer-events-none"
               style={{ borderRadius: '0 0 0 inherit' }}></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-fuchsia-500 pointer-events-none"
               style={{ borderRadius: '0 0 inherit 0' }}></div>
          
          {/* Dimension indicators */}
          {!selectedImage && (
            <>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold pointer-events-none">
                1.6"
              </div>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold pointer-events-none rotate-90">
                2"
              </div>
            </>
          )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="relative flex items-center justify-center w-full h-full max-w-4xl max-h-4xl" id="canvas-container">
        {/* Premium Background Glow for Sticker */}
        <div className="absolute w-[70%] h-[70%] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute w-[40%] h-[40%] bg-blue-500/15 rounded-full blur-2xl -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>

        {/* Premium Shape Label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-fuchsia-500/50 shadow-lg shadow-fuchsia-500/20 z-10 group">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gradient-to-br from-fuchsia-400 to-purple-600 rounded-sm shadow-inner shadow-white/20 animate-pulse"></div>
            <span className="text-white font-bold tracking-wider text-sm">{selectedShape.name.toUpperCase()} SHAPE</span>
            {/* Size indicator */}
            <span className="bg-fuchsia-500/20 text-fuchsia-200 text-xs font-mono px-2 py-0.5 rounded-md border border-fuchsia-500/30">
              1.6" × 2"
            </span>
          </div>
          {/* Animated glow element */}
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 blur-md animate-pulse"></div>
        </div>

         <ShapeContainer>
            {selectedImage ? (
                <TransformableImage 
                    src={selectedImage}
                    onDeselect={() => setSelectedImage(null)}
                    isDieCut={isDieCut}
                />
            ) : (
                <div 
                  className="text-center flex flex-col items-center justify-center p-8 cursor-pointer hover:opacity-80 transition-opacity duration-300 relative"
                  onClick={handlePlaceholderClick}
                >
                    {/* Shape-specific placeholder illustration */}
                    {isDieCut ? (
                      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Complete circle with premium dashed stroke */}
                          <rect x="40" y="40" width="160" height="160" rx="8" stroke="url(#gradientStroke)" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
                          
                          {/* Inner glow rectangle */}
                          <rect x="60" y="60" width="120" height="120" rx="4" fill="url(#glowGradient)" fillOpacity="0.12" />
                          
                          {/* Upload icon */}
                          <path d="M120 80V140M120 80L100 100M120 80L140 100" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M90 160H150" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
                          
                          {/* Text with premium styling */}
                          <text x="120" y="180" fontFamily="sans-serif" fontSize="16" fontWeight="500" fill="#a0aec0" textAnchor="middle">
                              Choose Your Image
                          </text>
                          
                          {/* Gradient definitions */}
                          <defs>
                              <linearGradient id="gradientStroke" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#3B82F6" />
                                  <stop offset="50%" stopColor="#60A5FA" />
                                  <stop offset="100%" stopColor="#93C5FD" />
                              </linearGradient>
                              <radialGradient id="glowGradient" cx="120" cy="120" r="80" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#3B82F6" />
                                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                              </radialGradient>
                          </defs>
                      </svg>
                    ) : (
                      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Use the appropriate shape based on selectedShape.id */}
                          {selectedShape.id === 'circle' && (
                            <circle cx="120" cy="120" r="100" stroke="url(#gradientStroke)" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
                          )}
                          {selectedShape.id === 'square' && (
                            <rect x="20" y="20" width="200" height="200" stroke="url(#gradientStroke)" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
                          )}
                          {selectedShape.id === 'rounded-square' && (
                            <rect x="20" y="20" width="200" height="200" rx="30" stroke="url(#gradientStroke)" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
                          )}
                          {selectedShape.id === 'rectangle' && (
                            <rect x="40" y="50" width="160" height="120" rx="10" stroke="url(#gradientStroke)" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
                          )}
                          {selectedShape.id === 'oval' && (
                            <ellipse cx="120" cy="120" rx="100" ry="75" stroke="url(#gradientStroke)" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
                          )}
                          
                          {/* Inner glow shape that matches the outer shape */}
                          {selectedShape.id === 'circle' && (
                            <circle cx="120" cy="120" r="80" fill="url(#glowGradient)" fillOpacity="0.08" />
                          )}
                          {selectedShape.id === 'square' && (
                            <rect x="40" y="40" width="160" height="160" fill="url(#glowGradient)" fillOpacity="0.08" />
                          )}
                          {selectedShape.id === 'rounded-square' && (
                            <rect x="40" y="40" width="160" height="160" rx="25" fill="url(#glowGradient)" fillOpacity="0.08" />
                          )}
                          {selectedShape.id === 'rectangle' && (
                            <rect x="50" y="60" width="140" height="100" rx="8" fill="url(#glowGradient)" fillOpacity="0.08" />
                          )}
                          {selectedShape.id === 'oval' && (
                            <ellipse cx="120" cy="120" rx="80" ry="60" fill="url(#glowGradient)" fillOpacity="0.08" />
                          )}
                          
                          {/* Upload icon */}
                          <path d="M120 80V140M120 80L100 100M120 80L140 100" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M90 160H150" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
                          
                          {/* Text with premium styling */}
                          <text x="120" y="180" fontFamily="sans-serif" fontSize="16" fontWeight="500" fill="#a0aec0" textAnchor="middle">
                              Add Your Image
                          </text>
                          
                          {/* Gradient definitions */}
                          <defs>
                              <linearGradient id="gradientStroke" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#3B82F6" />
                                  <stop offset="50%" stopColor="#60A5FA" />
                                  <stop offset="100%" stopColor="#93C5FD" />
                              </linearGradient>
                              <radialGradient id="glowGradient" cx="120" cy="120" r="80" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#3B82F6" />
                                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                              </radialGradient>
                          </defs>
                      </svg>
                    )}
                    
                    {/* Add a pulsing arrow for better visibility */}
                    <div className="absolute bottom-0 w-full flex justify-center">
                      <div className="animate-bounce bg-blue-500/80 p-2 rounded-full shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                    </div>
                </div>
            )}
        </ShapeContainer>

      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <div className="flex items-center bg-black/50 backdrop-blur-xl border border-fuchsia-500/20 rounded-full p-1.5 shadow-lg">
            <ViewToggleButton active>STICKER</ViewToggleButton>
            <ViewToggleButton badge="NEW">BACK PAPER</ViewToggleButton>
        </div>
        <button className="group flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:border-fuchsia-500/30 text-zinc-300 hover:text-white text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fuchsia-400 group-hover:text-fuchsia-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Screenshot
        </button>
      </div>
    </div>
  );
};