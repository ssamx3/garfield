import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Square, Circle, Triangle } from 'lucide-react';
import { ElementShape } from '@/types/animation';

interface PreviewAreaProps {
  currentProperties: {
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    skewX: number;
    skewY: number;
  };
}

const shapes: ElementShape[] = [
  { id: 'square', name: 'Square', className: 'w-16 h-16 bg-purple-300 rounded-lg shadow-lg' },
  { id: 'circle', name: 'Circle', className: 'w-16 h-16 bg-purple-300 rounded-full shadow-lg' },
  { id: 'triangle', name: 'Triangle', className: 'w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-purple-300 drop-shadow-lg' }
];

export const PreviewArea: React.FC<PreviewAreaProps> = ({ currentProperties }) => {
  const [selectedShape, setSelectedShape] = useState<ElementShape>(shapes[0]);

  const transform = useMemo(() => `
    translateX(${currentProperties.translateX}px) 
    translateY(${currentProperties.translateY}px) 
    scaleX(${currentProperties.scaleX / 100}) 
    scaleY(${currentProperties.scaleY / 100}) 
    rotate(${currentProperties.rotation}deg) 
    skewX(${currentProperties.skewX}deg) 
    skewY(${currentProperties.skewY}deg)
  `.trim(), [currentProperties]);

  return (
    <div className="flex-1 bg-gray-900 relative overflow-hidden">
      {/* Shape selector */}
      <div className="absolute top-6 left-6 z-10 flex gap-2">
        {shapes.map((shape) => (
          <Button
            key={shape.id}
            variant={selectedShape.id === shape.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedShape(shape)}
            className={`p-2 transition-all duration-200 ${
              selectedShape.id === shape.id 
                ? 'bg-purple-300 text-purple-900 hover:bg-purple-400 scale-105' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800/80 backdrop-blur-sm hover:scale-105'
            }`}
          >
            {shape.id === 'square' && <Square className="w-4 h-4" />}
            {shape.id === 'circle' && <Circle className="w-4 h-4" />}
            {shape.id === 'triangle' && <Triangle className="w-4 h-4" />}
          </Button>
        ))}
      </div>

      {/* Transform info overlay */}
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white text-xs p-3 rounded-lg font-mono border border-gray-600 transition-all duration-200 hover:bg-black/70">
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">X:</span>
            <span className="text-purple-300">{Math.round(currentProperties.translateX)}px</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Y:</span>
            <span className="text-purple-300">{Math.round(currentProperties.translateY)}px</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Scale:</span>
            <span className="text-purple-300">{currentProperties.scaleX.toFixed(1)}x, {currentProperties.scaleY.toFixed(1)}x</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Rotate:</span>
            <span className="text-purple-300">{Math.round(currentProperties.rotation)}°</span>
          </div>
        </div>
      </div>
      
      {/* Main viewport */}
      <div className="w-full h-full relative bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Center reference lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-purple-300/20"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-purple-300/20"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-300/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Animated element */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform"
          style={{ 
            transform: `translate(-50%, -50%) ${transform}`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className={selectedShape.className}></div>
        </div>
      </div>
    </div>
  );
};