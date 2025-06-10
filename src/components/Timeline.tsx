import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Play, Pause, RotateCcw, Code } from 'lucide-react';
import { Animation, Keyframe, EasingOption } from '@/types/animation';

interface TimelineProps {
  animation: Animation;
  currentTime: number;
  isPlaying: boolean;
  selectedKeyframes: string[];
  onTimeChange: (time: number) => void;
  onKeyframeSelect: (id: string, multiSelect?: boolean) => void;
  onAddKeyframe: (time: number) => void;
  onRemoveKeyframe: (id: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onUpdateKeyframeEasing: (keyframeId: string, easing: string) => void;
  onExportCSS: () => void;
}

const easingOptions: EasingOption[] = [
  { id: 'linear', name: 'Linear', value: 'linear' },
  { id: 'ease', name: 'Ease', value: 'ease' },
  { id: 'ease-in', name: 'Ease In', value: 'ease-in' },
  { id: 'ease-out', name: 'Ease Out', value: 'ease-out' },
  { id: 'ease-in-out', name: 'Ease In Out', value: 'ease-in-out' },
  { id: 'cubic-bezier-1', name: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  { id: 'cubic-bezier-2', name: 'Elastic', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  { id: 'cubic-bezier-3', name: 'Back', value: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)' }
];

export const Timeline: React.FC<TimelineProps> = ({
  animation,
  currentTime,
  isPlaying,
  selectedKeyframes,
  onTimeChange,
  onKeyframeSelect,
  onAddKeyframe,
  onRemoveKeyframe,
  onPlay,
  onPause,
  onReset,
  onUpdateKeyframeEasing,
  onExportCSS
}) => {
  const [showEasingMenu, setShowEasingMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const snapToMark = (percentage: number): number => {
    const marks = [0, 25, 50, 75, 100];
    const snapThreshold = 5; // Snap if within 5% of a mark
    
    for (const mark of marks) {
      if (Math.abs(percentage - mark) <= snapThreshold) {
        return mark;
      }
    }
    return percentage;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = timelineRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const snappedPercentage = snapToMark(percentage);
      onTimeChange(snappedPercentage);
    }
  }, [onTimeChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const snappedPercentage = snapToMark(percentage);
    onTimeChange(snappedPercentage);
  }, [isDragging, onTimeChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'g' && selectedKeyframes.length === 2) {
        setShowEasingMenu(true);
      }
      if (e.key === 'Escape') {
        setShowEasingMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedKeyframes.length]);

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    // Only handle clicks directly on the timeline track
    if (e.target === timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const snappedPercentage = snapToMark(percentage);
      onTimeChange(snappedPercentage);
      // Deselect all keyframes when clicking on empty timeline
      onKeyframeSelect('', false);
    }
  }, [onTimeChange, onKeyframeSelect]);

  const getKeyframeAtTime = useCallback((time: number) => {
    return animation.keyframes.find(kf => Math.abs(kf.time - time) < 2);
  }, [animation.keyframes]);

  const handleAddOrRemoveKeyframe = (e: React.MouseEvent) => {
    e.stopPropagation();
    const keyframeAtTime = getKeyframeAtTime(currentTime);
    
    if (keyframeAtTime) {
      onRemoveKeyframe(keyframeAtTime.id);
      onKeyframeSelect('', false);
    } else {
      onAddKeyframe(currentTime);
    }
  };

  const timeMarkers = [0, 25, 50, 75, 100];

  const handleKeyframeClick = useCallback((e: React.MouseEvent, keyframeId: string, time: number, multiSelect: boolean = false) => {
    e.stopPropagation();
    onKeyframeSelect(keyframeId, multiSelect);
    // Move playhead to the keyframe's position
    onTimeChange(time);
  }, [onKeyframeSelect, onTimeChange]);

  return (
    <div className="h-52 bg-gray-900 border-t border-gray-700 p-4 flex-shrink-0">
      {/* Playback Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={isPlaying ? onPause : onPlay}
            size="sm"
            className={`transition-all duration-200 ${
              isPlaying 
                ? 'bg-orange-500 hover:bg-orange-600 scale-105' 
                : 'bg-purple-300 hover:bg-purple-400 text-purple-900 hover:scale-105'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={onReset}
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-mono">
            {currentTime.toFixed(1)}%
          </span>
          
          <Button
            onClick={handleAddOrRemoveKeyframe}
            size="sm"
            className={`transition-all duration-200 ${
              getKeyframeAtTime(currentTime)
                ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-105'
                : 'bg-purple-300 hover:bg-purple-400 text-purple-900 hover:scale-105'
            }`}
          >
            {getKeyframeAtTime(currentTime) ? (
              <>
                <Trash2 className="w-4 h-4 mr-1" />
                Remove Keyframe
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Add Keyframe
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="relative">
        {/* Time markers */}
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {timeMarkers.map(time => (
            <span key={time} className="font-mono">
              {time}%
            </span>
          ))}
        </div>

        {/* Main timeline */}
        <div
          ref={timelineRef}
          className="relative h-16 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer overflow-hidden select-none"
          onMouseDown={handleTimelineClick}
        >
          {/* Grid lines with enhanced visibility for snap points */}
          {timeMarkers.map(time => (
            <div
              key={time}
              className="absolute top-0 bottom-0 border-l border-gray-600 opacity-50"
              style={{ left: `${time}%` }}
            />
          ))}

          {/* Current time indicator with snap point highlight */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-purple-300 z-20 pointer-events-none transition-all duration-100"
            style={{ left: `${currentTime}%` }}
          >
            <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-purple-300 rounded-full border border-white shadow-lg"></div>
          </div>

          {/* Snap point indicators */}
          {timeMarkers.map(time => (
            <div
              key={`snap-${time}`}
              className="absolute top-0 bottom-0 w-1 bg-purple-300/30 z-10 pointer-events-none"
              style={{ left: `${time}%`, transform: 'translateX(-50%)' }}
            />
          ))}

          {/* Keyframes */}
          {animation.keyframes.map((keyframe) => (
            <div
              key={keyframe.id}
              className="absolute top-2 bottom-2 group"
              style={{ left: `${keyframe.time}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-4 h-full rounded cursor-pointer transition-all duration-200 border-2 ${
                  selectedKeyframes.includes(keyframe.id)
                    ? 'bg-purple-300 border-purple-300 shadow-lg shadow-purple-300/50 scale-110'
                    : 'bg-gray-600 border-gray-500 hover:bg-purple-200 hover:border-purple-200 hover:scale-105'
                }`}
                onClick={(e) => handleKeyframeClick(e, keyframe.id, keyframe.time, e.ctrlKey || e.metaKey)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Easing Menu */}
      {showEasingMenu && selectedKeyframes.length === 2 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in-0 zoom-in-95 duration-200">
          <Card className="p-4 bg-gray-800 border-gray-600 shadow-xl">
            <h4 className="text-sm font-medium text-white mb-3">Choose Easing</h4>
            <div className="grid grid-cols-2 gap-2">
              {easingOptions.map((option) => (
                <Button
                  key={option.id}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-purple-300 hover:text-purple-900 text-xs transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    selectedKeyframes.forEach(id => {
                      onUpdateKeyframeEasing(id, option.value);
                    });
                    setShowEasingMenu(false);
                  }}
                >
                  {option.name}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="w-full mt-2 text-gray-400 hover:text-gray-300 transition-all duration-200"
              onClick={() => setShowEasingMenu(false)}
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};