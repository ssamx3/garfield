export interface Keyframe {
  id: string;
  time: number; // 0-100 percentage
  properties: {
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    skewX: number;
    skewY: number;
    x: number;
    y: number;
    opacity: number;
    color: string;
  };
  easing?: string;
}

export interface Animation {
  id: string;
  name: string;
  duration: number; // in seconds
  keyframes: Keyframe[];
  easing: string;
}

export interface ElementShape {
  id: string;
  name: string;
  className: string;
}

export interface EasingOption {
  id: string;
  name: string;
  value: string;
}