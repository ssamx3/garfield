import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Animation, Keyframe } from '@/types/animation';

const defaultKeyframe = {
  translateX: 0,
  translateY: 0,
  scaleX: 100,
  scaleY: 100,
  rotation: 0,
  skewX: 0,
  skewY: 0,
  x: 0,
  y: 0,
  opacity: 1,
  color: '#ffffff'
};

export const useAnimation = () => {
  const [animation, setAnimation] = useState<Animation>({
    id: '1',
    name: 'My Animation',
    duration: 2,
    keyframes: [
      {
        id: '1',
        time: 0,
        properties: { ...defaultKeyframe },
        easing: 'ease-in-out'
      },
      {
        id: '2',
        time: 100,
        properties: { ...defaultKeyframe, translateX: 100 },
        easing: 'ease-in-out'
      }
    ],
    easing: 'ease-in-out'
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedKeyframes, setSelectedKeyframes] = useState<string[]>(['1']);
  const intervalRef = useRef<number>();

  const play = useCallback(() => {
    setIsPlaying(true);
    const startTime = Date.now();
    const duration = animation.duration * 1000;
    const startProgress = currentTime;
    
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100 + startProgress, 100);
      
      setCurrentTime(progress);
      
      if (progress >= 100) {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
        setCurrentTime(0); // Loop back to start
      }
    }, 16);
  }, [animation.duration, currentTime]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setCurrentTime(0);
  }, [pause]);

  const newAnimation = useCallback(() => {
    pause();
    const newId = Date.now().toString();
    setAnimation({
      id: newId,
      name: 'New Animation',
      duration: 2,
      keyframes: [
        {
          id: newId + '_1',
          time: 0,
          properties: { ...defaultKeyframe },
          easing: 'ease-in-out'
        },
        {
          id: newId + '_2',
          time: 100,
          properties: { ...defaultKeyframe },
          easing: 'ease-in-out'
        }
      ],
      easing: 'ease-in-out'
    });
    setCurrentTime(0);
    setSelectedKeyframes([]);
  }, [pause]);

  const updateKeyframe = useCallback((keyframeId: string, properties: Partial<Keyframe['properties']>) => {
    setAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.map(kf => 
        kf.id === keyframeId 
          ? { ...kf, properties: { ...kf.properties, ...properties } }
          : kf
      )
    }));
  }, []);

  const updateKeyframeEasing = useCallback((keyframeId: string, easing: string) => {
    setAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.map(kf => 
        kf.id === keyframeId 
          ? { ...kf, easing }
          : kf
      )
    }));
  }, []);

  const addKeyframe = useCallback((time: number) => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time,
      properties: { ...defaultKeyframe },
      easing: 'ease-in-out'
    };
    
    setAnimation(prev => ({
      ...prev,
      keyframes: [...prev.keyframes, newKeyframe].sort((a, b) => a.time - b.time)
    }));
    
    setSelectedKeyframes([newKeyframe.id]);
  }, []);

  const removeKeyframe = useCallback((keyframeId: string) => {
    setAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.filter(kf => kf.id !== keyframeId)
    }));
    setSelectedKeyframes(prev => prev.filter(id => id !== keyframeId));
  }, []);

  const updateDuration = useCallback((duration: number) => {
    setAnimation(prev => ({ ...prev, duration }));
  }, []);

  const selectKeyframe = useCallback((keyframeId: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedKeyframes(prev => 
        prev.includes(keyframeId) 
          ? prev.filter(id => id !== keyframeId)
          : [...prev, keyframeId]
      );
    } else {
      setSelectedKeyframes([keyframeId]);
    }
  }, []);

  const sortedKeyframes = useMemo(() => 
    [...animation.keyframes].sort((a, b) => a.time - b.time),
    [animation.keyframes]
  );

  const getCurrentProperties = useCallback((time: number = currentTime) => {
    if (sortedKeyframes.length === 0) return defaultKeyframe;
    
    const prevKeyframe = sortedKeyframes.slice().reverse().find(kf => kf.time <= time);
    const nextKeyframe = sortedKeyframes.find(kf => kf.time > time);
    
    if (!prevKeyframe) return sortedKeyframes[0]?.properties || defaultKeyframe;
    if (!nextKeyframe) return prevKeyframe.properties;
    
    // Interpolate between keyframes
    const progress = (time - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
    const interpolated = { ...defaultKeyframe };
    
    Object.keys(defaultKeyframe).forEach(key => {
      const prop = key as keyof typeof defaultKeyframe;
      const prevValue = prevKeyframe.properties[prop];
      const nextValue = nextKeyframe.properties[prop];
      
      // Convert scale values to decimal for interpolation
      if (prop === 'scaleX' || prop === 'scaleY') {
        const prevDecimal = Number(prevValue) / 100;
        const nextDecimal = Number(nextValue) / 100;
        interpolated[prop] = (prevDecimal + (nextDecimal - prevDecimal) * progress) * 100;
      } else if (prop === 'color') {
        // Keep the color from the previous keyframe
        interpolated[prop] = String(prevValue);
      } else {
        // Handle all numeric properties
        const prevNum = Number(prevValue);
        const nextNum = Number(nextValue);
        interpolated[prop] = prevNum + (nextNum - prevNum) * progress;
      }
    });
    
    return interpolated;
  }, [sortedKeyframes, currentTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    animation,
    currentTime,
    isPlaying,
    selectedKeyframes,
    setSelectedKeyframes: selectKeyframe,
    setCurrentTime,
    play,
    pause,
    reset,
    newAnimation,
    updateKeyframe,
    updateKeyframeEasing,
    addKeyframe,
    removeKeyframe,
    updateDuration,
    getCurrentProperties
  };
};