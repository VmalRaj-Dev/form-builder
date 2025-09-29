'use client';

import React, { useState } from 'react';

interface NumberInputProps {
  value?: number | string;
  onChange: (value: string) => void;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export function NumberInput({ 
  value = '', 
  onChange, 
  label, 
  unit = 'px', 
  min = 0, 
  max = 1000, 
  step = 1,
  placeholder = '0'
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(String(value));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Allow empty string or valid numbers
    if (newValue === '' || (!isNaN(Number(newValue)) && Number(newValue) >= min && Number(newValue) <= max)) {
      onChange(newValue === '' ? '' : `${newValue}${unit}`);
    }
  };

  const handleIncrement = () => {
    const currentNum = parseFloat(inputValue) || 0;
    const newValue = Math.min(currentNum + step, max);
    setInputValue(String(newValue));
    onChange(`${newValue}${unit}`);
  };

  const handleDecrement = () => {
    const currentNum = parseFloat(inputValue) || 0;
    const newValue = Math.max(currentNum - step, min);
    setInputValue(String(newValue));
    onChange(`${newValue}${unit}`);
  };

  // Extract numeric value from value prop (remove unit)
  React.useEffect(() => {
    if (typeof value === 'string' && value !== inputValue + unit) {
      const numericValue = value.replace(/[^\d.-]/g, '');
      setInputValue(numericValue);
    }
  }, [value, inputValue, unit]);

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        
        {/* Unit Display */}
        <span className="absolute right-8 text-xs text-gray-500 pointer-events-none">
          {unit}
        </span>
        
        {/* Increment/Decrement Buttons */}
        <div className="absolute right-1 flex flex-col">
          <button
            type="button"
            onClick={handleIncrement}
            className="px-1 py-0.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="px-1 py-0.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
