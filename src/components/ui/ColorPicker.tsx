'use client';

import React, { useState } from 'react';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
  placeholder?: string;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
];

export function ColorPicker({ value = '', onChange, label, placeholder = '#000000' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleColorChange = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Validate hex color format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue) || newValue === '') {
      onChange(newValue);
    }
  };

  const displayColor = inputValue || '#ffffff';

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <div
            className="w-5 h-5 rounded border border-gray-300 mr-2 flex-shrink-0"
            style={{ backgroundColor: displayColor }}
          />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 outline-none bg-transparent text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64">
            {/* Native Color Picker */}
            <div className="mb-3">
              <input
                type="color"
                value={displayColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    inputValue === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={() => handleColorChange('')}
              className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
            >
              Clear Color
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
