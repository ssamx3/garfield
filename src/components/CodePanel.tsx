import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code } from 'lucide-react';
import { Animation } from '@/types/animation';

interface CodePanelProps {
  animation: Animation;
}

export const CodePanel: React.FC<CodePanelProps> = ({ animation }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateCSS = () => {
    const keyframeSteps = animation.keyframes
      .sort((a, b) => a.time - b.time)
      .map(keyframe => {
        const { translateX, translateY, scaleX, scaleY, rotation, skewX, skewY } = keyframe.properties;
        const transform = `translateX(${translateX}px) translateY(${translateY}px) scaleX(${scaleX + '%'}) scaleY(${scaleY + '%'}) rotate(${rotation}deg) skewX(${skewX}deg) skewY(${skewY}deg)`;
        
        return `  ${keyframe.time}% {
    transform: ${transform};
  }`;
      })
      .join('\n');

    return `@keyframes ${animation.name.replace(/\s+/g, '-').toLowerCase()} {
${keyframeSteps}
}

.animated-element {
  animation: ${animation.name.replace(/\s+/g, '-').toLowerCase()} ${animation.duration}s ${animation.easing} infinite;
}`;
  };

  const cssCode = generateCSS();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gray-900 w-[600px] max-h-[80vh] rounded-lg border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Generated CSS</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 text-sm bg-purple-300 hover:bg-purple-400 text-purple-900 hover:scale-105 transition-all duration-200 rounded-md flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" />
                  <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" />
                </svg>
                Copy CSS
              </>
            )}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300"
          >
            {isExpanded ? '×' : 'Expand'}
          </button>
        </div>
      </div>
      <div className={`p-4 overflow-auto ${isExpanded ? 'max-h-[calc(80vh-4rem)]' : 'max-h-[300px]'}`}>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm font-mono">
          <code>{cssCode}</code>
        </pre>
      </div>
    </div>
  );
};