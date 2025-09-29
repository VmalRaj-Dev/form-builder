'use client';

import React, { useState } from 'react';
import { FormDesign } from '@/types/form';

interface ThemeInspectorProps {
  design: FormDesign;
  onUpdateDesign: (updates: Partial<FormDesign>) => void;
}

const BACKGROUND_COLORS = [
  { label: 'White', value: 'bg-white', color: '#ffffff' },
  { label: 'Gray 50', value: 'bg-gray-50', color: '#f9fafb' },
  { label: 'Gray 100', value: 'bg-gray-100', color: '#f3f4f6' },
  { label: 'Blue 50', value: 'bg-blue-50', color: '#eff6ff' },
  { label: 'Green 50', value: 'bg-green-50', color: '#f0fdf4' },
  { label: 'Purple 50', value: 'bg-purple-50', color: '#faf5ff' },
];

const FONT_FAMILIES = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Monospace', value: 'font-mono' },
];

const FONT_SIZES = [
  { label: 'Small', value: 'text-sm' },
  { label: 'Medium', value: 'text-base' },
  { label: 'Large', value: 'text-lg' },
  { label: 'Extra Large', value: 'text-xl' },
];

const SPACING_OPTIONS = [
  { label: 'Tight', container: 'p-4', fields: 'space-y-4' },
  { label: 'Normal', container: 'p-6', fields: 'space-y-6' },
  { label: 'Relaxed', container: 'p-8', fields: 'space-y-8' },
  { label: 'Loose', container: 'p-12', fields: 'space-y-12' },
];

export function ThemeInspector({ design, onUpdateDesign }: ThemeInspectorProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'spacing' | 'branding'>('appearance');

  const updateSpacing = (container: string, fields: string) => {
    onUpdateDesign({
      spacing: {
        container,
        fields,
      },
    });
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Theme</h3>
          <p className="text-sm text-gray-500">Customize the overall appearance of your form</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'appearance', label: 'Appearance' },
              { id: 'spacing', label: 'Spacing' },
              { id: 'branding', label: 'Branding' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_COLORS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => onUpdateDesign({ backgroundColor: bg.value })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      design.backgroundColor === bg.value
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: bg.color }}
                  >
                    <div className="text-xs font-medium text-gray-700">{bg.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={design.fontFamily || 'font-sans'}
                onChange={(e) => onUpdateDesign({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={design.fontSize || 'text-base'}
                onChange={(e) => onUpdateDesign({ fontSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Spacing Tab */}
        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Form Spacing
              </label>
              <div className="space-y-3">
                {SPACING_OPTIONS.map((spacing) => (
                  <button
                    key={spacing.label}
                    onClick={() => updateSpacing(spacing.container, spacing.fields)}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      design.spacing?.container === spacing.container
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{spacing.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Container: {spacing.container}, Fields: {spacing.fields}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={design.logoUrl || ''}
                onChange={(e) => onUpdateDesign({ logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Logo will appear at the top of your form
              </p>
            </div>

            {design.logoUrl && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
                <img
                  src={design.logoUrl}
                  alt="Form logo"
                  className="max-w-full h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
