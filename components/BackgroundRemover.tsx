import React, { useState, useRef, useEffect, useCallback } from 'react';

interface BackgroundRemoverProps {
  imageUrl: string;
  onProcessed: (processedImageUrl: string) => void;
  onCancel: () => void;
}

export const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({ 
  imageUrl, 
  onProcessed, 
  onCancel 
}) => {
  const [tolerance, setTolerance] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sampledColor, setSampledColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Define updatePreview with useCallback to avoid recreating it on every render
  const updatePreview = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !sampledColor) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Reset canvas with original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Parse the sampled color
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const targetColor = hexToRgb(sampledColor);
    if (!targetColor) return;

    // Process the image data - remove background based on color similarity
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate color distance (simple Euclidean distance in RGB space)
      const distance = Math.sqrt(
        Math.pow(r - targetColor.r, 2) +
        Math.pow(g - targetColor.g, 2) +
        Math.pow(b - targetColor.b, 2)
      );

      // If the color is within tolerance, make it transparent
      if (distance < tolerance) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }

    // Put the processed image data back to canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Update preview
    setPreviewImage(canvas.toDataURL('image/png'));
  }, [sampledColor, tolerance]);

  // Load the image when the component mounts or imageUrl changes
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      imageRef.current = img;
      
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          if (sampledColor) {
            updatePreview();
          }
        }
      }
    };
  }, [imageUrl, sampledColor, updatePreview]);

  // Update the preview when tolerance or sampled color changes
  useEffect(() => {
    if (sampledColor) {
      updatePreview();
    }
  }, [sampledColor, tolerance, updatePreview]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
      setSampledColor(color);
    }
  };

  const handleApply = () => {
    setIsProcessing(true);
    // Process is already done in the preview, so we just use that result
    if (previewImage) {
      onProcessed(previewImage);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-3xl w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Remove Background</h2>
          <button 
            onClick={onCancel} 
            className="text-zinc-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="text-zinc-400 text-sm mb-2">1. Click on the background color to sample it</p>
            <div className="relative bg-zinc-800/50 rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-auto cursor-crosshair"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
              {sampledColor && (
                <div className="absolute bottom-2 left-2 flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: sampledColor }}></div>
                  <span className="text-xs text-white font-mono">{sampledColor}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-zinc-400 text-sm mb-2">2. Preview result</p>
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '300px' }}>
              {previewImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                  {/* Checkerboard background to show transparency */}
                  <div className="absolute inset-0 -z-10" style={{ 
                    backgroundImage: 'linear-gradient(45deg, #666 25%, transparent 25%), linear-gradient(-45deg, #666 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #666 75%), linear-gradient(-45deg, transparent 75%, #666 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    opacity: 0.2
                  }}></div>
                </div>
              ) : (
                <div className="text-zinc-500 text-center">
                  Sample a color to see preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-zinc-400 text-sm mb-2">
            Color Tolerance: {tolerance}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Higher values remove more colors similar to the background
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!sampledColor || isProcessing}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              !sampledColor || isProcessing
                ? 'bg-blue-500/30 text-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
