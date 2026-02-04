'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Sun, Moon, Download, Shuffle } from 'lucide-react';

type GradientType = 'linear' | 'radial' | 'conic';
type ColorStop = { color: string; position: number };

export default function Home() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ]);

  const gradientCSS = generateGradientCSS(gradientType, colorStops, angle);

  function generateGradientCSS(type: GradientType, stops: ColorStop[], deg: number): string {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

    switch (type) {
      case 'linear':
        return `linear-gradient(${deg}deg, ${stopString})`;
      case 'radial':
        return `radial-gradient(circle, ${stopString})`;
      case 'conic':
        return `conic-gradient(from ${deg}deg, ${stopString})`;
      default:
        return `linear-gradient(${deg}deg, ${stopString})`;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function addColorStop() {
    const newPosition = Math.floor(Math.random() * 100);
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    setColorStops([...colorStops, { color: newColor, position: newPosition }]);
  }

  function removeColorStop(index: number) {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  }

  function randomize() {
    const count = Math.floor(Math.random() * 3) + 2;
    const newStops = Array.from({ length: count }, () => ({
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      position: Math.floor(Math.random() * 100)
    }));
    setColorStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  }

  function updateColorStop(index: number, field: keyof ColorStop, value: string | number) {
    const newStops = [...colorStops];
    newStops[index] = { ...newStops[index], [field]: value };
    setColorStops(newStops);
  }

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              CSS Gradient Generator
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Create beautiful gradients for your designs
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all ${
              darkMode
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                : 'bg-white text-gray-900 hover:bg-gray-100 shadow-md'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Panel */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={randomize}
                    className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    title="Randomize"
                  >
                    <Shuffle size={18} />
                  </button>
                </div>
              </div>
              <div
                className="h-80 w-full transition-all duration-300"
                style={{ background: gradientCSS }}
              />
            </div>

            {/* CSS Output */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CSS Code</h2>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4">
                <pre className={`text-sm font-mono overflow-x-auto ${darkMode ? 'text-green-400' : 'text-gray-800'}`}>
                  <code>background: {gradientCSS};</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Gradient Type */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Gradient Type
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`py-3 px-4 rounded-lg font-medium capitalize transition-all ${
                      gradientType === type
                        ? 'bg-purple-600 text-white shadow-lg'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Control (for linear & conic) */}
            {(gradientType === 'linear' || gradientType === 'conic') && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Angle: {angle}°
                </h3>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-sm mt-2 text-gray-500 dark:text-gray-400">
                  <span>0°</span>
                  <span>180°</span>
                  <span>360°</span>
                </div>
              </div>
            )}

            {/* Color Stops */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Color Stops
                </h3>
                <button
                  onClick={addColorStop}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Add Color
                </button>
              </div>

              <div className="space-y-4">
                {colorStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Color {index + 1}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={stop.color}
                          onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="w-24">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Position
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => updateColorStop(index, 'position', Number(e.target.value))}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>

                    {colorStops.length > 2 && (
                      <button
                        onClick={() => removeColorStop(index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Remove color stop"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Export Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Copy size={18} />
                  Copy CSS
                </button>
                <button
                  onClick={() => {
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${gradientCSS}"/></svg>`;
                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'gradient.svg';
                    a.click();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <Download size={18} />
                  Export SVG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Create beautiful gradients for your web projects</p>
        </div>
      </div>
    </div>
  );
}
