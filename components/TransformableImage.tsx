import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ContextMenu } from './ContextMenu';
import { BackgroundRemover } from './BackgroundRemover';

interface TransformableImageProps {
  src: string;
  onDeselect: () => void;
  isDieCut: boolean;
}

type Interaction = 'pan' | 'scale' | 'rotate' | null;

export const TransformableImage: React.FC<TransformableImageProps> = ({ src, onDeselect, isDieCut }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: isDieCut ? 0.5 : 1, rotation: 0 });
  const [interaction, setInteraction] = useState<Interaction>(null);
  const [showBgRemover, setShowBgRemover] = useState(false);
  const [currentImage, setCurrentImage] = useState(src);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const startPointRef = useRef({ x: 0, y: 0, transformX: 0, transformY: 0, scale: 0, rotation: 0, angle: 0, dist: 0 });
  
  // Only reset transform when the image actually changes, not on every render
  useEffect(() => {
    if (src !== currentImage) {
      setCurrentImage(src);
      // Reset transform for new images, but preserve for the same image
      setTransform({ x: 0, y: 0, scale: isDieCut ? 0.5 : 1, rotation: 0 });
    }
  }, [src, isDieCut, currentImage]);
  
  // Add wheel zoom support with better performance
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out or in
    setTransform(prev => {
      const newScale = Math.max(0.1, Math.min(3, prev.scale * delta));
      return { ...prev, scale: newScale };
    });
  }, []);
  
  const handleInteractionStart = useCallback((e: React.MouseEvent<HTMLDivElement>, type: Interaction) => {
    e.preventDefault();
    e.stopPropagation();
    
    setInteraction(type);
    
    const startX = e.clientX;
    const startY = e.clientY;

    if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        startPointRef.current = {
            x: startX,
            y: startY,
            transformX: transform.x,
            transformY: transform.y,
            scale: transform.scale,
            rotation: transform.rotation,
            angle: Math.atan2(startY - centerY, startX - centerX),
            dist: Math.hypot(startX - centerX, startY - centerY),
        };
    }

    // Create new event handler functions for this interaction session
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!type) {
        return;
      }
      
      e.preventDefault();

      const dx = e.clientX - startPointRef.current.x;
      const dy = e.clientY - startPointRef.current.y;

      if (type === 'pan') {
        const newX = startPointRef.current.transformX + dx;
        const newY = startPointRef.current.transformY + dy;
        setTransform(prev => ({ ...prev, x: newX, y: newY }));
      } 
      
      if (type === 'rotate' && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const angleDiff = currentAngle - startPointRef.current.angle;
        const newRotation = startPointRef.current.rotation + angleDiff * (180 / Math.PI);
        setTransform(prev => ({ ...prev, rotation: newRotation }));
      }

      if (type === 'scale' && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const currentDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        if (startPointRef.current.dist > 0) {
          const scaleRatio = currentDist / startPointRef.current.dist;
          const newScale = Math.max(0.1, Math.min(3, startPointRef.current.scale * scaleRatio));
          setTransform(prev => ({ ...prev, scale: newScale }));
        }
      }
    };

    const mouseUpHandler = () => {
      setInteraction(null);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Use passive: false to ensure preventDefault works
    document.addEventListener('mousemove', mouseMoveHandler, { passive: false });
    document.addEventListener('mouseup', mouseUpHandler, { passive: false });
  }, [transform]);
  
  // Cleanup function for any remaining event listeners
  useEffect(() => {
    return () => {
      // Clean up any remaining event listeners
      const cleanupMouseMove = () => {};
      const cleanupMouseUp = () => {};
      document.removeEventListener('mousemove', cleanupMouseMove as EventListener);
      document.removeEventListener('mouseup', cleanupMouseUp as EventListener);
    };
  }, []);

  const handleRemoveBg = () => {
    setShowBgRemover(true);
  };

  const handleBgRemovalComplete = (processedImageUrl: string) => {
    setCurrentImage(processedImageUrl);
    setShowBgRemover(false);
  };

  return (
    <>
      <div
        className="absolute flex items-center justify-center draggable-area"
        style={{
          width: isDieCut ? 'auto' : '150%', // Allow image to be larger than container
          height: isDieCut ? 'auto' : '150%',
          transform: `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotation}deg)`,
          cursor: interaction ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        onMouseDown={(e) => {
          // Start panning - control elements should have stopPropagation to prevent this
          handleInteractionStart(e, 'pan');
        }}
        onWheel={handleWheel}
      >
        <div className="relative" style={{transform: `scale(${transform.scale})`}}>
          {/* Premium Bounding Box for all modes */}
          <div className="absolute -inset-4 rounded-xl border-2 border-fuchsia-500 bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 pointer-events-none"
               style={{ boxShadow: '0 0 12px 2px rgba(217, 70, 239, 0.4), inset 0 0 10px rgba(217, 70, 239, 0.2)' }}></div>
          
          {/* Measurements indicators - inspired by screenshot */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold pointer-events-none"
               style={{transform: `scale(${1 / transform.scale})`}}>
            1.6"
          </div>
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold pointer-events-none rotate-90"
               style={{transform: `scale(${1 / transform.scale}) rotate(${-transform.rotation}deg)`}}>
            2"
          </div>
          
          <img
            ref={imageRef}
            src={currentImage}
            alt="transformable sticker"
            className="max-w-none max-h-none object-contain drop-shadow-2xl w-[300px] h-auto"
            draggable="false"
          />
          
          {/* Advanced bounding box with corner points */}
          <div className="absolute -inset-4">
            {/* Corner dots and resize controls */}
            {/* Top Left */}
            <div className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center pointer-events-none"
                 style={{transform: `scale(${1 / transform.scale})`}}>
              <div className="w-4 h-4 rounded-full bg-black border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30"></div>
              <div className="absolute w-8 h-8 rounded-full border border-fuchsia-500/30 animate-ping"></div>
            </div>
            
            {/* Top Right */}
            <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center pointer-events-none"
                 style={{transform: `scale(${1 / transform.scale})`}}>
              <div className="w-4 h-4 rounded-full bg-black border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30"></div>
            </div>
            
            {/* Bottom Left */}
            <div className="absolute -bottom-2 -left-2 w-8 h-8 flex items-center justify-center pointer-events-none"
                 style={{transform: `scale(${1 / transform.scale})`}}>
              <div className="w-4 h-4 rounded-full bg-black border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30"></div>
            </div>
            
            {/* Bottom Right - Interactive resize handle */}
            <div 
              className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center cursor-nwse-resize group z-10"
              style={{transform: `scale(${1 / transform.scale})`}}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInteractionStart(e, 'scale');
              }}
              title="Drag to resize"
            >
              <div className="w-5 h-5 rounded-full bg-black border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30 
                              group-hover:scale-110 group-hover:shadow-fuchsia-500/50 transition-all duration-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-fuchsia-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h3a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h3a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h3a1 1 0 010 2H4a1 1 0 01-1-1zm6-8a1 1 0 011-1h7a1 1 0 110 2h-7a1 1 0 01-1-1zm1 4a1 1 0 100 2h7a1 1 0 100-2h-7zm0 4a1 1 0 100 2h7a1 1 0 100-2h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Rotate Handle */}
          <div 
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{transform: `scale(${1 / transform.scale})`}}
          >
            <div className="h-6 w-0.5 bg-fuchsia-500 pointer-events-none shadow-lg shadow-fuchsia-500/30"></div>
            <div 
              className="w-7 h-7 rounded-full bg-black border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30 flex items-center justify-center 
                        cursor-alias hover:scale-110 hover:shadow-fuchsia-500/50 transition-all duration-200 z-10"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInteractionStart(e, 'rotate');
              }}
              title="Drag to rotate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fuchsia-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v3a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 7.586V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Context Menu - repositioned to float near the image */}
          <div 
            className="absolute top-4 right-4 z-10" 
            style={{transform: `scale(${1 / transform.scale}) rotate(${-transform.rotation}deg)`}}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
             <ContextMenu 
               onDelete={() => {
                 onDeselect();
               }} 
               onRemoveBg={() => {
                 handleRemoveBg();
               }}
             />
          </div>
          
          {/* Additional Controls inspired by the screenshot */}
          <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2"
               style={{transform: `scale(${1 / transform.scale}) rotate(${-transform.rotation}deg)`}}
               onMouseDown={(e) => e.stopPropagation()}>
            {/* Control buttons */}
            <button 
              className="w-10 h-10 rounded-full bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-black/90 transition-all duration-200"
              onMouseDown={(e) => e.stopPropagation()}
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-black/90 transition-all duration-200"
              onMouseDown={(e) => e.stopPropagation()}
              title="Filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-black/90 transition-all duration-200"
              onMouseDown={(e) => e.stopPropagation()}
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Background Remover Modal */}
      {showBgRemover && (
        <BackgroundRemover 
          imageUrl={src} 
          onProcessed={handleBgRemovalComplete}
          onCancel={() => setShowBgRemover(false)}
        />
      )}
    </>
  );
};