'use client';

import React, { useState } from 'react';
import { FormDesign, CustomFont } from '@/types/form';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { NumberInput } from '@/components/ui/NumberInput';
import { 
  loadCustomFont, 
  extractFontFamilyFromGoogleFontsUrl, 
  generateFontId, 
  isValidFontUrl,
  removeCustomFont 
} from '@/utils/fontLoader';

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
  const [activeTab, setActiveTab] = useState<'appearance' | 'spacing' | 'branding' | 'fonts' | 'submit'>('appearance');
  const [newFontUrl, setNewFontUrl] = useState('');
  const [newFontName, setNewFontName] = useState('');
  const [isAddingFont, setIsAddingFont] = useState(false);

  const updateSpacing = (container: string, fields: string) => {
    onUpdateDesign({
      spacing: {
        container,
        fields,
      },
    });
  };

  const handleAddCustomFont = async () => {
    if (!newFontUrl.trim()) return;

    // Validate URL
    if (!isValidFontUrl(newFontUrl)) {
      alert('Please enter a valid font URL (Google Fonts, Adobe Fonts, etc.)');
      return;
    }

    // Auto-extract font name from Google Fonts URL if not provided
    let fontName = newFontName.trim();
    if (!fontName && newFontUrl.includes('fonts.googleapis.com')) {
      fontName = extractFontFamilyFromGoogleFontsUrl(newFontUrl);
    }

    if (!fontName) {
      alert('Please provide a font name');
      return;
    }

    const customFont: CustomFont = {
      id: generateFontId(fontName),
      name: fontName,
      url: newFontUrl,
      fontFamily: fontName
    };

    try {
      // Load the font
      await loadCustomFont(customFont);
      
      // Add to design
      const currentFonts = design.customFonts || [];
      onUpdateDesign({
        customFonts: [...currentFonts, customFont]
      });

      // Reset form
      setNewFontUrl('');
      setNewFontName('');
      setIsAddingFont(false);
    } catch (error) {
      alert('Failed to load font. Please check the URL and try again.');
    }
  };

  const handleRemoveCustomFont = (fontId: string) => {
    const currentFonts = design.customFonts || [];
    const fontToRemove = currentFonts.find(f => f.id === fontId);
    
    if (fontToRemove) {
      // Remove from document
      removeCustomFont(fontToRemove.url);
      
      // Update design
      onUpdateDesign({
        customFonts: currentFonts.filter(f => f.id !== fontId)
      });

      // If this was the selected font, reset to default
      if (design.customFontFamily === fontToRemove.fontFamily) {
        onUpdateDesign({
          fontFamily: 'font-sans',
          customFontFamily: undefined
        });
      }
    }
  };

  const handleSelectCustomFont = (font: CustomFont) => {
    onUpdateDesign({
      fontFamily: 'custom',
      customFontFamily: font.fontFamily
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
              { id: 'fonts', label: 'Fonts' },
              { id: 'spacing', label: 'Spacing' },
              { id: 'submit', label: 'Submit Button' },
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
              <ColorPicker
                label="Background Color"
                value={design.backgroundColor || '#ffffff'}
                onChange={(color) => onUpdateDesign({ backgroundColor: color })}
                placeholder="#ffffff"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={design.fontFamily === 'custom' ? `custom-${design.customFontFamily}` : design.fontFamily || 'font-sans'}
                onChange={(e) => {
                  if (e.target.value.startsWith('custom-')) {
                    const fontFamily = e.target.value.replace('custom-', '');
                    onUpdateDesign({ 
                      fontFamily: 'custom',
                      customFontFamily: fontFamily
                    });
                  } else {
                    onUpdateDesign({ 
                      fontFamily: e.target.value,
                      customFontFamily: undefined
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
                {design.customFonts && design.customFonts.length > 0 && (
                  <optgroup label="Custom Fonts">
                    {design.customFonts.map((font) => (
                      <option key={font.id} value={`custom-${font.fontFamily}`}>
                        {font.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              {design.fontFamily === 'custom' && design.customFontFamily && (
                <p className="text-xs text-gray-500 mt-1">
                  Using: {design.customFontFamily}
                </p>
              )}
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

        {/* Fonts Tab */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            {/* Custom Fonts Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Fonts
                </label>
                <button
                  onClick={() => setIsAddingFont(!isAddingFont)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isAddingFont ? 'Cancel' : '+ Add Font'}
                </button>
              </div>

              {/* Add Font Form */}
              {isAddingFont && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font URL
                    </label>
                    <input
                      type="url"
                      value={newFontUrl}
                      onChange={(e) => {
                        setNewFontUrl(e.target.value);
                        // Auto-extract font name from Google Fonts URL
                        if (e.target.value.includes('fonts.googleapis.com')) {
                          const extractedName = extractFontFamilyFromGoogleFontsUrl(e.target.value);
                          if (extractedName) {
                            setNewFontName(extractedName);
                          }
                        }
                      }}
                      placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports Google Fonts, Adobe Fonts, and other CSS font URLs
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font Name
                    </label>
                    <input
                      type="text"
                      value={newFontName}
                      onChange={(e) => setNewFontName(e.target.value)}
                      placeholder="Roboto"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Auto-filled for Google Fonts
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCustomFont}
                      disabled={!newFontUrl.trim()}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add Font
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingFont(false);
                        setNewFontUrl('');
                        setNewFontName('');
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Fonts List */}
              {design.customFonts && design.customFonts.length > 0 ? (
                <div className="space-y-2">
                  {design.customFonts.map((font) => (
                    <div
                      key={font.id}
                      className={`p-3 border rounded-lg transition-colors ${
                        design.fontFamily === 'custom' && design.customFontFamily === font.fontFamily
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div 
                            className="font-medium text-sm cursor-pointer"
                            style={{ fontFamily: font.fontFamily }}
                            onClick={() => handleSelectCustomFont(font)}
                          >
                            {font.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {font.url}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handleSelectCustomFont(font)}
                            className={`text-xs px-2 py-1 rounded ${
                              design.fontFamily === 'custom' && design.customFontFamily === font.fontFamily
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {design.fontFamily === 'custom' && design.customFontFamily === font.fontFamily ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => handleRemoveCustomFont(font.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-sm">No custom fonts added yet</div>
                  <div className="text-xs mt-1">Add Google Fonts or other web fonts to customize your form</div>
                </div>
              )}
            </div>

            {/* Font Examples */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Popular Google Fonts
              </label>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {[
                  { name: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' },
                  { name: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' },
                  { name: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
                  { name: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap' },
                ].map((font) => (
                  <button
                    key={font.name}
                    onClick={() => {
                      setNewFontUrl(font.url);
                      setNewFontName(font.name);
                      setIsAddingFont(true);
                    }}
                    className="text-left p-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  >
                    + Add {font.name}
                  </button>
                ))}
              </div>
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

        {/* Submit Button Tab */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={design.submitButton?.text || 'Submit Form'}
                onChange={(e) => onUpdateDesign({ 
                  submitButton: { ...design.submitButton, text: e.target.value }
                })}
                placeholder="Submit Form"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Button Colors */}
            <div className="space-y-4">
              <ColorPicker
                label="Background Color"
                value={design.submitButton?.backgroundColor || '#3b82f6'}
                onChange={(color) => onUpdateDesign({ 
                  submitButton: { ...design.submitButton, backgroundColor: color }
                })}
                placeholder="#3b82f6"
              />

              <ColorPicker
                label="Text Color"
                value={design.submitButton?.textColor || '#ffffff'}
                onChange={(color) => onUpdateDesign({ 
                  submitButton: { ...design.submitButton, textColor: color }
                })}
                placeholder="#ffffff"
              />
            </div>

            {/* Button Dimensions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Padding
                </label>
                <input
                  type="text"
                  value={design.submitButton?.padding || '12px 24px'}
                  onChange={(e) => onUpdateDesign({ 
                    submitButton: { ...design.submitButton, padding: e.target.value }
                  })}
                  placeholder="12px 24px"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Format: top/bottom left/right (e.g., "12px 24px")</p>
              </div>

              <NumberInput
                label="Border Radius"
                value={design.submitButton?.borderRadius || '6px'}
                onChange={(radius) => onUpdateDesign({ 
                  submitButton: { ...design.submitButton, borderRadius: radius }
                })}
                unit="px"
                min={0}
                max={50}
              />

              <NumberInput
                label="Font Size"
                value={design.submitButton?.fontSize || '16px'}
                onChange={(size) => onUpdateDesign({ 
                  submitButton: { ...design.submitButton, fontSize: size }
                })}
                unit="px"
                min={12}
                max={24}
              />
            </div>

            {/* Button Style Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
                <select
                  value={design.submitButton?.fontWeight || 'medium'}
                  onChange={(e) => onUpdateDesign({ 
                    submitButton: { ...design.submitButton, fontWeight: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <select
                  value={design.submitButton?.width || 'full'}
                  onChange={(e) => onUpdateDesign({ 
                    submitButton: { ...design.submitButton, width: e.target.value as 'full' | 'auto' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full">Full Width</option>
                  <option value="auto">Auto Width</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
                <div className="flex space-x-1">
                  {[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' },
                  ].map((align) => (
                    <button
                      key={align.value}
                      onClick={() => onUpdateDesign({ 
                        submitButton: { ...design.submitButton, alignment: align.value as any }
                      })}
                      className={`flex-1 px-3 py-2 text-xs border rounded-md transition-colors ${
                        design.submitButton?.alignment === align.value
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
          </div>
        )}
      </div>
    </div>
  );
}
