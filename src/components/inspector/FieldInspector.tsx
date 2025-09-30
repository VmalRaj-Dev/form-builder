'use client';

import React, { useState, useEffect } from 'react';
import { FormFieldData, FieldOption, ValidationRule, SelectOption } from '@/types/form';
import { CheckboxRichTextEditor } from '@/components/ui/CheckboxRichTextEditor';
import { CSVUploader } from '@/components/ui/CSVUploader';
import { CSVOption } from '@/utils/csvParser';

interface FieldInspectorProps {
  selectedField: FormFieldData | null;
  onUpdateField: (updates: Partial<FormFieldData>) => void;
}

export function FieldInspector({ selectedField, onUpdateField }: FieldInspectorProps) {
  const [localField, setLocalField] = useState<FormFieldData | null>(null);

  useEffect(() => {
    setLocalField(selectedField);
  }, [selectedField]);

  if (!localField) {
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
            Click on a form field in the editor to configure its properties.
          </p>
        </div>
      </div>
    );
  }

  const updateField = (key: string, value: unknown) => {
    const updates = { [key]: value };
    setLocalField(prev => prev ? { ...prev, ...updates } : null);
    onUpdateField(updates);
  };

  const updateValidation = (validationUpdates: Partial<ValidationRule>) => {
    const newValidation = { ...localField.validation, ...validationUpdates };
    updateField('validation', newValidation);
  };

  const addOption = () => {
    if ('options' in localField && localField.options) {
      const newOption: SelectOption = {
        id: `option_${Date.now()}`,
        label: `Option ${localField.options.length + 1}`,
        value: `option${localField.options.length + 1}`,
      };
      updateField('options', [...localField.options, newOption]);
    }
  };

  const updateOption = (optionId: string, updates: Partial<SelectOption>) => {
    if ('options' in localField && localField.options) {
      const updatedOptions = localField.options.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      );
      updateField('options', updatedOptions);
    }
  };

  const removeOption = (optionId: string) => {
    if ('options' in localField && localField.options) {
      const filteredOptions = localField.options.filter(option => option.id !== optionId);
      updateField('options', filteredOptions);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Field Type Header */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {localField.type.charAt(0).toUpperCase() + localField.type.slice(1)} Field
          </h3>
          <p className="text-sm text-gray-500">Configure field properties and validation</p>
        </div>

        {/* Basic Properties */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={localField.label}
              onChange={(e) => updateField('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {localField.type !== 'separator' && localField.type !== 'checkbox' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={localField.placeholder || ''}
                onChange={(e) => updateField('placeholder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={localField.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {localField.type !== 'separator' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={localField.required || false}
                onChange={(e) => updateField('required', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                Required field
              </label>
            </div>
          )}
        </div>

        {/* Options for Dropdown and Radio */}
        {'options' in localField && localField.options && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <button
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Option
              </button>
            </div>
            <div className="space-y-2">
              {(localField.options || []).map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateOption(option.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {(localField.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="px-2 py-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* CSV Upload for Options */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <CSVUploader
                onOptionsImported={(csvOptions: CSVOption[]) => {
                  const newOptions: SelectOption[] = csvOptions.map(csvOpt => ({
                    id: csvOpt.id,
                    label: csvOpt.label,
                    value: csvOpt.value
                  }));
                  updateField('options', newOptions);
                }}
                currentOptions={localField.options?.map(opt => ({
                  id: opt.id,
                  label: opt.label,
                  value: opt.value
                })) || []}
              />
            </div>
          </div>
        )}

        {/* Long Text Specific */}
        {localField.type === 'longtext' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rows
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={localField.rows || 4}
              onChange={(e) => updateField('rows', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Rich Text Specific */}
        {localField.type === 'richtext' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Toolbar
              </label>
              <select
                value={(localField as any).toolbar || 'basic'}
                onChange={(e) => updateField('toolbar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="minimal">Minimal</option>
                <option value="basic">Basic</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Height</label>
                <input
                  type="text"
                  value={(localField as any).minHeight || '120px'}
                  onChange={(e) => updateField('minHeight', e.target.value)}
                  placeholder="120px"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Height</label>
                <input
                  type="text"
                  value={(localField as any).maxHeight || '400px'}
                  onChange={(e) => updateField('maxHeight', e.target.value)}
                  placeholder="400px"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localField as any).allowLinks !== false}
                  onChange={(e) => updateField('allowLinks', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Allow Links</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localField as any).allowFormatting !== false}
                  onChange={(e) => updateField('allowFormatting', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Allow Formatting</span>
              </label>
            </div>
          </div>
        )}

        {/* Checkbox Specific */}
        {localField.type === 'checkbox' && (
          <div className="space-y-3">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localField as any).useRichText || false}
                  onChange={(e) => updateField('useRichText', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Use Rich Text Content</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Enable rich text editor for terms & conditions</p>
            </div>

            {(localField as any).useRichText ? (
              <CheckboxRichTextEditor
                value={(localField as any).richTextContent || ''}
                onChange={(value) => updateField('richTextContent', value)}
                placeholder="I agree to the terms and conditions..."
              />
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={(localField as any).linkText || ''}
                    onChange={(e) => updateField('linkText', e.target.value)}
                    placeholder="e.g., Terms and Conditions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={(localField as any).linkUrl || ''}
                    onChange={(e) => updateField('linkUrl', e.target.value)}
                    placeholder="https://example.com/terms"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation Rules */}
        {localField.type !== 'separator' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Validation</h4>
            <div className="space-y-3">
              {(localField.type === 'text' || localField.type === 'longtext' || localField.type === 'richtext') && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Min Length</label>
                      <input
                        type="number"
                        min="0"
                        value={localField.validation?.minLength || ''}
                        onChange={(e) => updateValidation({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Max Length</label>
                      <input
                        type="number"
                        min="0"
                        value={localField.validation?.maxLength || ''}
                        onChange={(e) => updateValidation({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {localField.type === 'number' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Value</label>
                    <input
                      type="number"
                      value={localField.validation?.min || ''}
                      onChange={(e) => updateValidation({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Value</label>
                    <input
                      type="number"
                      value={localField.validation?.max || ''}
                      onChange={(e) => updateValidation({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-1">Custom Validation Message</label>
                <input
                  type="text"
                  value={localField.validation?.message || ''}
                  onChange={(e) => updateValidation({ message: e.target.value })}
                  placeholder="Enter custom error message"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
