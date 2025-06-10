import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onDurationChange: (duration: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  duration,
  currentTime,
  onPlay,
  onPause,
  onReset,
  onDurationChange
}) => {
  return (
    <Card className="p-4 bg-gray-900 border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Playback</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={isPlaying ? onPause : onPlay}
          className={`${
            isPlaying 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'bg-purple-300 hover:bg-purple-400 text-purple-900'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-300">Duration:</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
            className="w-20 bg-gray-800 border-gray-600 text-white"
          />
          <span className="text-sm text-gray-400">seconds</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Progress: {currentTime.toFixed(1)}%</span>
          <span>Time: {((currentTime / 100) * duration).toFixed(2)}s</span>
        </div>
      </div>
    </Card>
  );
};