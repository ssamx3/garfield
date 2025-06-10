import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Keyframe } from '@/types/animation';

interface PropertiesPanelProps {
  selectedKeyframes: string[];
  keyframes: Keyframe[];
  duration: number;
  onUpdateProperties: (keyframeId: string, properties: Partial<Keyframe['properties']>) => void;
  onUpdateDuration: (duration: number) => void;
  onUpdateKeyframeShape: (keyframeId: string, shape: string) => void;
}

const PropertySlider = memo(({ 
  prop, 
  value, 
  onChange 
}: { 
  prop: any; 
  value: number; 
  onChange: (value: number) => void;
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <Label className="text-sm font-medium text-gray-200">
        {prop.label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 h-6 text-xs bg-gray-700 border-gray-600 text-purple-300"
          step={prop.step}
        />
        <span className="text-xs text-gray-400 w-6">
          {prop.unit}
        </span>
      </div>
    </div>
    <Slider
      value={[value]}
      onValueChange={([newValue]) => onChange(newValue)}
      min={prop.min}
      max={prop.max}
      step={prop.step}
      className="slider-purple"
    />
  </div>
));

PropertySlider.displayName = 'PropertySlider';

export const PropertiesPanel: React.FC<PropertiesPanelProps> = memo(({
  selectedKeyframes,
  keyframes,
  duration,
  onUpdateProperties,
  onUpdateDuration,
  onUpdateKeyframeShape
}) => {
  const selectedKeyframe = selectedKeyframes.length === 1 
    ? keyframes.find(kf => kf.id === selectedKeyframes[0])
    : null;

  const properties = [
    {
      key: 'translateX' as const,
      label: 'Translate X',
      min: -300,
      max: 300,
      step: 1,
      unit: 'px'
    },
    {
      key: 'translateY' as const,
      label: 'Translate Y',
      min: -300,
      max: 300,
      step: 1,
      unit: 'px'
    },
    {
      key: 'scaleX' as const,
      label: 'Scale X',
      min: 0,
      max: 200,
      step: 1,
      unit: '%'
    },
    {
      key: 'scaleY' as const,
      label: 'Scale Y',
      min: 0,
      max: 200,
      step: 1,
      unit: '%'
    },
    {
      key: 'rotation' as const,
      label: 'Rotation',
      min: -360,
      max: 360,
      step: 1,
      unit: '°'
    },
    {
      key: 'skewX' as const,
      label: 'Skew X',
      min: -45,
      max: 45,
      step: 1,
      unit: '°'
    },
    {
      key: 'skewY' as const,
      label: 'Skew Y',
      min: -45,
      max: 45,
      step: 1,
      unit: '°'
    }
  ];

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto flex-shrink-0">
      {/* Animation Controls */}
      <Card className="p-4 bg-gray-800 border-gray-600 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Animation</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-200 mb-2 block">
              Duration
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={duration}
                onChange={(e) => onUpdateDuration(Number(e.target.value))}
                min={0.1}
                max={10}
                step={0.1}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <span className="text-sm text-gray-400">seconds</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Properties Panel */}
      <Card className="p-4 bg-gray-800 border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
        
        {selectedKeyframes.length === 0 && (
          <p className="text-gray-400 text-sm">Select a keyframe to edit properties</p>
        )}
        
        {selectedKeyframes.length > 1 && (
          <div className="text-gray-400 text-sm">
            <p>{selectedKeyframes.length} keyframes selected</p>
            <p className="text-xs mt-1">Press 'G' to set easing between keyframes</p>
          </div>
        )}
        
        {selectedKeyframe && (
          <div className="space-y-6">
            <div className="text-sm text-gray-400 mb-4">
              Keyframe at {selectedKeyframe.time.toFixed(1)}%
            </div>
            
            {properties.map((prop) => (
              <PropertySlider
                key={prop.key}
                prop={prop}
                value={selectedKeyframe.properties[prop.key]}
                onChange={(value) => {
                  onUpdateProperties(selectedKeyframe.id, { [prop.key]: value });
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
});

PropertiesPanel.displayName = 'PropertiesPanel';