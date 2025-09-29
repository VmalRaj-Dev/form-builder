'use client';

import React from 'react';

interface StructurePaletteProps {
  onInsertSingleColumn: () => void;
  onInsertTwoColumn: () => void;
}

export function StructurePalette({ onInsertSingleColumn, onInsertTwoColumn }: StructurePaletteProps) {
  return (
    <div className="bg-white border-r border-gray-200 p-4 w-64">
      <div className="space-y-6">
        {/* Structure Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Layout Structures</h3>
          <div className="space-y-2">
            <button
              onClick={onInsertSingleColumn}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center group-hover:bg-purple-200">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">Single Column</div>
                <div className="text-xs text-gray-500">Full-width container</div>
              </div>
            </button>

            <button
              onClick={onInsertTwoColumn}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center group-hover:bg-purple-200">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16m6-16v16M4 8h16M4 16h16" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">Two Column</div>
                <div className="text-xs text-gray-500">Side-by-side layout</div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Fields Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Form Fields</h3>
          <div className="grid grid-cols-2 gap-2">
            <FieldButton icon="📝" label="Text" />
            <FieldButton icon="📧" label="Email" />
            <FieldButton icon="📱" label="Phone" />
            <FieldButton icon="🔢" label="Number" />
            <FieldButton icon="📋" label="Long Text" />
            <FieldButton icon="📋" label="Dropdown" />
            <FieldButton icon="⚪" label="Radio" />
            <FieldButton icon="☑️" label="Checkbox" />
            <FieldButton icon="📎" label="File" />
            <FieldButton icon="➖" label="Separator" />
          </div>
        </div>

        {/* Design Tools Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Design Tools</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
              <span>🎨</span>
              <span>Theme Settings</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
              <span>🖼️</span>
              <span>Add Logo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center p-2 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors text-xs">
      <span className="text-lg mb-1">{icon}</span>
      <span className="text-gray-700">{label}</span>
    </button>
  );
}
