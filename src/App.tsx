import React from 'react';
import { useAnimation } from '@/hooks/useAnimation';
import { Timeline } from '@/components/Timeline';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { PreviewArea } from '@/components/PreviewArea';
import { CodePanel } from '@/components/CodePanel';

function App() {
  const {
    animation,
    currentTime,
    isPlaying,
    selectedKeyframes,
    setSelectedKeyframes,
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
  } = useAnimation();

  const currentProperties = getCurrentProperties();

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-gray-900 border-b border-gray-700 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Garfield</h1>
          <button
            onClick={newAnimation}
            className="px-3 py-1.5 text-sm border border-gray-600 text-gray-300 hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Animation
          </button>
        </div>
        <button
          onClick={() => document.getElementById('code-panel')?.classList.toggle('hidden')}
          className="px-3 py-1.5 text-sm bg-purple-300 hover:bg-purple-400 text-purple-900 hover:scale-105 transition-all duration-200 rounded-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
          </svg>
          Export CSS
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Viewport */}
        <PreviewArea currentProperties={currentProperties} />
        
        {/* Properties Panel */}
        <PropertiesPanel
          selectedKeyframes={selectedKeyframes}
          keyframes={animation.keyframes}
          duration={animation.duration}
          onUpdateProperties={updateKeyframe}
          onUpdateDuration={updateDuration}
        />
      </div>

      {/* Timeline */}
      <Timeline
        animation={animation}
        currentTime={currentTime}
        isPlaying={isPlaying}
        selectedKeyframes={selectedKeyframes}
        onTimeChange={setCurrentTime}
        onKeyframeSelect={setSelectedKeyframes}
        onAddKeyframe={addKeyframe}
        onRemoveKeyframe={removeKeyframe}
        onPlay={play}
        onPause={pause}
        onReset={reset}
        onUpdateKeyframeEasing={updateKeyframeEasing}
        onNewAnimation={newAnimation}
        onExportCSS={() => document.getElementById('code-panel')?.classList.toggle('hidden')}
      />

      {/* Code Panel */}
      <div id="code-panel" className="hidden absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 w-[600px] max-h-[80vh] rounded-lg border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Generated CSS</h3>
            <button
              onClick={() => document.getElementById('code-panel')?.classList.add('hidden')}
              className="text-gray-400 hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(80vh-4rem)]">
            <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm font-mono">
              <code>{`@keyframes ${animation.name.replace(/\s+/g, '-').toLowerCase()} {
${animation.keyframes
  .sort((a, b) => a.time - b.time)
  .map(keyframe => {
    const { translateX, translateY, scaleX, scaleY, rotation, skewX, skewY } = keyframe.properties;
    return `  ${keyframe.time}% {
    transform: translateX(${translateX}px) translateY(${translateY}px) scaleX(${scaleX}%) scaleY(${scaleY}%) rotate(${rotation}deg) skewX(${skewX}deg) skewY(${skewY}deg);
  }`;
  })
  .join('\n')}
}

.animated-element {
  animation: ${animation.name.replace(/\s+/g, '-').toLowerCase()} ${animation.duration}s ${animation.easing} infinite;
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;