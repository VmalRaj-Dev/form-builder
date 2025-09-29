'use client';

import React, { useState } from 'react';
import { FormFieldData, FieldStyle } from '@/types/form';

interface FieldDesignInspectorProps {
  selectedField: FormFieldData | null;
  onUpdateField: (updates: Partial<FormFieldData>) => void;
}

const LABEL_COLORS = [
  { label: 'Black', value: 'text-black', color: '#000000' },
  { label: 'Gray 900', value: 'text-gray-900', color: '#111827' },
  { label: 'Gray 700', value: 'text-gray-700', color: '#374151' },
  { label: 'Blue 600', value: 'text-blue-600', color: '#2563eb' },
  { label: 'Green 600', value: 'text-green-600', color: '#059669' },
  { label: 'Purple 600', value: 'text-purple-600', color: '#9333ea' },
];

const BORDER_COLORS = [
  { label: 'Gray 300', value: 'border-gray-300', color: '#d1d5db' },
  { label: 'Blue 500', value: 'border-blue-500', color: '#3b82f6' },
  { label: 'Green 500', value: 'border-green-500', color: '#10b981' },
  { label: 'Red 500', value: 'border-red-500', color: '#ef4444' },
  { label: 'Purple 500', value: 'border-purple-500', color: '#8b5cf6' },
];

const BORDER_RADIUS = [
  { label: 'None', value: 'rounded-none' },
  { label: 'Small', value: 'rounded-sm' },
  { label: 'Medium', value: 'rounded-md' },
  { label: 'Large', value: 'rounded-lg' },
  { label: 'Extra Large', value: 'rounded-xl' },
  { label: 'Full', value: 'rounded-full' },
];

const BACKGROUND_COLORS = [
  { label: 'White', value: 'bg-white', color: '#ffffff' },
  { label: 'Gray 50', value: 'bg-gray-50', color: '#f9fafb' },
  { label: 'Blue 50', value: 'bg-blue-50', color: '#eff6ff' },
  { label: 'Green 50', value: 'bg-green-50', color: '#f0fdf4' },
  { label: 'Yellow 50', value: 'bg-yellow-50', color: '#fffbeb' },
];

const FOCUS_COLORS = [
  { label: 'Blue', value: 'focus:ring-blue-500' },
  { label: 'Green', value: 'focus:ring-green-500' },
  { label: 'Purple', value: 'focus:ring-purple-500' },
  { label: 'Red', value: 'focus:ring-red-500' },
];

const FIELD_ICONS = [
  { label: 'None', value: '' },
  { label: 'User', value: 'user' },
  { label: 'Mail', value: 'mail' },
  { label: 'Phone', value: 'phone' },
  { label: 'Lock', value: 'lock' },
  { label: 'Calendar', value: 'calendar' },
];

export function FieldDesignInspector({ selectedField, onUpdateField }: FieldDesignInspectorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');

  if (!selectedField) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Field Selected</h3>
          <p className="text-sm text-gray-500">
            Click on a form field to configure its properties and design.
          </p>
        </div>
      </div>
    );
  }

  const updateStyle = (styleUpdates: Partial<FieldStyle>) => {
    const currentStyle = selectedField.style || {};
    onUpdateField({
      style: { ...currentStyle, ...styleUpdates },
    });
  };

  const fieldStyle = selectedField.style || {};

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Field Type Header */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)} Field
          </h3>
          <p className="text-sm text-gray-500">Configure field properties and design</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content & Logic
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'design'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Design
            </button>
          </nav>
        </div>

        {/* Content & Logic Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => onUpdateField({ label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {selectedField.type !== 'separator' && selectedField.type !== 'checkbox' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => onUpdateField({ placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={selectedField.description || ''}
                onChange={(e) => onUpdateField({ description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {selectedField.type !== 'separator' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedField.required || false}
                  onChange={(e) => onUpdateField({ required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                  Required field
                </label>
              </div>
            )}
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Label Appearance */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Label Appearance</h4>
              
              {/* Label Color */}
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-2">Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {LABEL_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateStyle({ labelColor: color.value })}
                      className={`p-2 rounded border-2 transition-colors ${
                        fieldStyle.labelColor === color.value
                          ? 'border-blue-500 ring-1 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded mx-auto"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="text-xs mt-1">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Label Weight */}
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-2">Weight</label>
                <select
                  value={fieldStyle.labelWeight || 'font-medium'}
                  onChange={(e) => updateStyle({ labelWeight: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semibold</option>
                  <option value="font-bold">Bold</option>
                </select>
              </div>

              {/* Label Alignment */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Alignment</label>
                <div className="flex space-x-1">
                  {[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' },
                  ].map((align) => (
                    <button
                      key={align.value}
                      onClick={() => updateStyle({ labelAlignment: align.value as any })}
                      className={`flex-1 px-2 py-1 text-xs border rounded ${
                        fieldStyle.labelAlignment === align.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {align.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Appearance */}
            {selectedField.type !== 'separator' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Input Appearance</h4>
                
                {/* Border Color */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Border Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BORDER_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateStyle({ inputBorderColor: color.value })}
                        className={`p-2 rounded border-2 transition-colors ${
                          fieldStyle.inputBorderColor === color.value
                            ? 'border-blue-500 ring-1 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded mx-auto border-2"
                          style={{ borderColor: color.color }}
                        />
                        <div className="text-xs mt-1">{color.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Border Radius</label>
                  <select
                    value={fieldStyle.inputBorderRadius || 'rounded-md'}
                    onChange={(e) => updateStyle({ inputBorderRadius: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {BORDER_RADIUS.map((radius) => (
                      <option key={radius.value} value={radius.value}>
                        {radius.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background Color */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Background</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BACKGROUND_COLORS.map((bg) => (
                      <button
                        key={bg.value}
                        onClick={() => updateStyle({ inputBackgroundColor: bg.value })}
                        className={`p-2 rounded border-2 transition-colors ${
                          fieldStyle.inputBackgroundColor === bg.value
                            ? 'border-blue-500 ring-1 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: bg.color }}
                      >
                        <div className="text-xs">{bg.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Color */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Focus Ring</label>
                  <select
                    value={fieldStyle.inputFocusColor || 'focus:ring-blue-500'}
                    onChange={(e) => updateStyle({ inputFocusColor: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {FOCUS_COLORS.map((focus) => (
                      <option key={focus.value} value={focus.value}>
                        {focus.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field Icon */}
                {(selectedField.type === 'email' || selectedField.type === 'phone' || selectedField.type === 'text') && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Icon</label>
                    <select
                      value={fieldStyle.icon || ''}
                      onChange={(e) => updateStyle({ icon: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {FIELD_ICONS.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
