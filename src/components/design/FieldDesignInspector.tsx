'use client';

import React, { useState, useRef } from 'react';
import { FormFieldData, FieldStyle, ValidationRule } from '@/types/form';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { NumberInput } from '@/components/ui/NumberInput';
import { CSVUploader } from '@/components/ui/CSVUploader';
import { CheckboxRichTextEditor } from '@/components/ui/CheckboxRichTextEditor';
import { CSVOption } from '@/utils/csvParser';

interface FieldDesignInspectorProps {
  selectedField: FormFieldData | null;
  onUpdateField: (updates: Partial<FormFieldData>) => void;
  allFields?: FormFieldData[]; // For conditional logic dependencies
}


export function FieldDesignInspector({ selectedField, onUpdateField, allFields = [] }: FieldDesignInspectorProps) {
  const optionIdCounterRef = useRef(0);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'validation'>('content');

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

  const updateValidation = (validationUpdates: Partial<ValidationRule>) => {
    const currentValidation = selectedField.validation || {};
    onUpdateField({
      validation: { ...currentValidation, ...validationUpdates },
    });
  };

  const fieldStyle = selectedField.style || {};
  const validation = selectedField.validation || {};

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
            {selectedField.type !== 'separator' && (
              <button
                onClick={() => setActiveTab('validation')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'validation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Validation
              </button>
            )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name
                <span className="text-xs text-gray-500 ml-1">(HTML name attribute)</span>
              </label>
              <input
                type="text"
                value={selectedField.name}
                onChange={(e) => onUpdateField({ name: e.target.value })}
                placeholder="field_name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for form submission. Should be unique and contain only letters, numbers, and underscores.
              </p>
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

            {/* Additional Field Properties */}
            {selectedField.type !== 'separator' && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Field Properties</h4>
                
                {/* Disabled Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="disabled"
                    checked={selectedField.disabled || false}
                    onChange={(e) => onUpdateField({ disabled: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="disabled" className="ml-2 block text-sm text-gray-900">
                    Disabled (field cannot be edited)
                  </label>
                </div>

                {/* Readonly Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="readonly"
                    checked={selectedField.readonly || false}
                    onChange={(e) => onUpdateField({ readonly: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="readonly" className="ml-2 block text-sm text-gray-900">
                    Read-only (field can be focused but not edited)
                  </label>
                </div>

                {/* Default Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Value
                    <span className="text-xs text-gray-500 ml-1">(pre-filled value)</span>
                  </label>
                  {selectedField.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="defaultValueCheckbox"
                        checked={selectedField.defaultValue === true}
                        onChange={(e) => onUpdateField({ defaultValue: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="defaultValueCheckbox" className="ml-2 block text-sm text-gray-900">
                        Checked by default
                      </label>
                    </div>
                  ) : selectedField.type === 'number' ? (
                    <input
                      type="number"
                      value={selectedField.defaultValue as number || ''}
                      onChange={(e) => onUpdateField({ defaultValue: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="Enter default number..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : selectedField.type === 'dropdown' || selectedField.type === 'radio' ? (
                    <select
                      value={selectedField.defaultValue as string || ''}
                      onChange={(e) => onUpdateField({ defaultValue: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No default selection</option>
                      {('options' in selectedField ? selectedField.options || [] : []).map(option => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedField.defaultValue as string || ''}
                      onChange={(e) => onUpdateField({ defaultValue: e.target.value || undefined })}
                      placeholder="Enter default text..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Value that appears in the field when the form loads
                  </p>
                </div>

                {/* Tooltip */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tooltip
                    <span className="text-xs text-gray-500 ml-1">(help text on hover)</span>
                  </label>
                  <input
                    type="text"
                    value={selectedField.tooltip || ''}
                    onChange={(e) => onUpdateField({ tooltip: e.target.value || undefined })}
                    placeholder="Enter helpful tooltip text..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Shows when users hover over the field label
                  </p>
                </div>

                {/* Width Info (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Width
                  </label>
                  <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded">
                    <span className="font-medium">
                      {selectedField.width === 'w-1/2' ? 'Half Width (w-1/2)' : 'Full Width (w-full)'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Width is automatically determined by container placement. Move field to two-column container for half width.
                  </p>
                </div>
              </div>
            )}

            {/* Options Management for Dropdown and Radio Fields */}
            {(selectedField.type === 'dropdown' || selectedField.type === 'radio') && 'options' in selectedField && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <button
                    onClick={() => {
                      const newOption = {
                        id: `option_${++optionIdCounterRef.current}`,
                        label: `Option ${('options' in selectedField ? selectedField.options?.length || 0 : 0) + 1}`,
                        value: `option_${('options' in selectedField ? selectedField.options?.length || 0 : 0) + 1}`
                      };
                      onUpdateField({
                        options: [...('options' in selectedField ? selectedField.options || [] : []), newOption]
                      });
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {('options' in selectedField ? selectedField.options || [] : []).map((option, index) => (
                    <div key={option.id} className="flex gap-2 items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => {
                              const updatedOptions = [...('options' in selectedField ? selectedField.options || [] : [])];
                              updatedOptions[index] = { ...option, label: e.target.value };
                              onUpdateField({ options: updatedOptions });
                            }}
                            placeholder="Display text"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => {
                              const updatedOptions = [...('options' in selectedField ? selectedField.options || [] : [])];
                              updatedOptions[index] = { ...option, value: e.target.value };
                              onUpdateField({ options: updatedOptions });
                            }}
                            placeholder="Submitted value"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {/* Move Up */}
                        {index > 0 && (
                          <button
                            onClick={() => {
                              const updatedOptions = [...('options' in selectedField ? selectedField.options || [] : [])];
                              [updatedOptions[index - 1], updatedOptions[index]] = [updatedOptions[index], updatedOptions[index - 1]];
                              onUpdateField({ options: updatedOptions });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Move up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        )}
                        {/* Move Down */}
                        {index < (('options' in selectedField ? selectedField.options?.length || 0 : 0) - 1) && (
                          <button
                            onClick={() => {
                              const updatedOptions = [...('options' in selectedField ? selectedField.options || [] : [])];
                              [updatedOptions[index], updatedOptions[index + 1]] = [updatedOptions[index + 1], updatedOptions[index]];
                              onUpdateField({ options: updatedOptions });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Move down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        {/* Delete */}
                        <button
                          onClick={() => {
                            const updatedOptions = ('options' in selectedField ? selectedField.options || [] : []).filter((_, i) => i !== index);
                            onUpdateField({ options: updatedOptions });
                          }}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete option"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!('options' in selectedField) || !selectedField.options || selectedField.options.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="mb-2">
                        <svg className="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-sm">No options added yet</p>
                      <p className="text-xs text-gray-400">Click &quot;Add Option&quot; to create your first option</p>
                    </div>
                  )}
                </div>
                
                {('options' in selectedField && selectedField.options && selectedField.options.length > 0) && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    <strong>Preview:</strong> {'options' in selectedField && selectedField.options ? selectedField.options.length : 0} option{('options' in selectedField && selectedField.options && selectedField.options.length !== 1) ? 's' : ''} configured
                  </div>
                )}

                {/* CSV Upload for Options */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <CSVUploader
                    onOptionsImported={(csvOptions: CSVOption[]) => {
                      const newOptions = csvOptions.map(csvOpt => ({
                        id: csvOpt.id,
                        label: csvOpt.label,
                        value: csvOpt.value
                      }));
                      onUpdateField({ options: newOptions });
                    }}
                    currentOptions={('options' in selectedField ? selectedField.options || [] : []).map(opt => ({
                      id: opt.id,
                      label: opt.label,
                      value: opt.value
                    }))}
                  />
                </div>
              </div>
            )}

            {/* Checkbox Rich Text Configuration */}
            {selectedField.type === 'checkbox' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Checkbox Content</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(selectedField as any).useRichText || false}
                        onChange={(e) => onUpdateField({ useRichText: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Use Rich Text Content</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Enable rich text editor for terms & conditions</p>
                  </div>

                  {(selectedField as any).useRichText ? (
                    <CheckboxRichTextEditor
                      value={(selectedField as any).richTextContent || ''}
                      onChange={(value) => onUpdateField({ richTextContent: value })}
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
                          value={(selectedField as any).linkText || ''}
                          onChange={(e) => onUpdateField({ linkText: e.target.value })}
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
                          value={(selectedField as any).linkUrl || ''}
                          onChange={(e) => onUpdateField({ linkUrl: e.target.value })}
                          placeholder="https://example.com/terms"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terms & Conditions Configuration */}
            {selectedField.type === 'terms' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Terms & Conditions</h4>
                
                <div className="space-y-4">
                  {/* Mode Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
                    <div className="flex space-x-2">
                      {(['checkbox', 'radio', 'text'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => onUpdateField({ mode })}
                          className={`px-3 py-2 text-sm rounded border ${
                            (selectedField as any).mode === mode
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {mode === 'checkbox' ? '☑️ Checkbox' : mode === 'radio' ? '⚪ Radio' : '📄 Text Only'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Terms Content</label>
                    <textarea
                      value={(selectedField as any).content || ''}
                      onChange={(e) => onUpdateField({ content: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="I agree to the Terms & Conditions and Privacy Policy. By checking this box, I acknowledge that I have read and understood the terms."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use link text from below to create clickable links (e.g., "Terms & Conditions" will become a clickable link)
                    </p>
                  </div>

                  {/* Links Management */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Links</label>
                      <button
                        onClick={() => {
                          const currentLinks = (selectedField as any).links || [];
                          const newLink = {
                            id: `link_${Date.now()}`,
                            text: 'Privacy Policy',
                            url: 'https://example.com/privacy'
                          };
                          onUpdateField({ links: [...currentLinks, newLink] });
                        }}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        + Add Link
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {((selectedField as any).links || []).map((link: any, index: number) => (
                        <div key={link.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex gap-2 mb-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Link Text</label>
                              <input
                                type="text"
                                value={link.text}
                                onChange={(e) => {
                                  const updatedLinks = [...((selectedField as any).links || [])];
                                  updatedLinks[index] = { ...link, text: e.target.value };
                                  onUpdateField({ links: updatedLinks });
                                }}
                                placeholder="Terms & Conditions"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const updatedLinks = ((selectedField as any).links || []).filter((_: any, i: number) => i !== index);
                                onUpdateField({ links: updatedLinks });
                              }}
                              className="mt-5 px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              title="Remove link"
                            >
                              ×
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => {
                                const updatedLinks = [...((selectedField as any).links || [])];
                                updatedLinks[index] = { ...link, url: e.target.value };
                                onUpdateField({ links: updatedLinks });
                              }}
                              placeholder="https://example.com/terms"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {((selectedField as any).links || []).length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No links added yet. Click "Add Link" to create clickable links in your terms text.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Label Styling */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Label Styling</h4>
              
              <div className="space-y-4">
                {/* Label Color */}
                <ColorPicker
                  label="Label Color"
                  value={fieldStyle.labelColor || '#374151'}
                  onChange={(color) => updateStyle({ labelColor: color })}
                  placeholder="#374151"
                />

                {/* Label Font Size */}
                <NumberInput
                  label="Font Size"
                  value={fieldStyle.labelFontSize || '14px'}
                  onChange={(size) => updateStyle({ labelFontSize: size })}
                  unit="px"
                  min={10}
                  max={24}
                />

                {/* Label Weight */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Font Weight</label>
                  <select
                    value={fieldStyle.labelWeight || 'medium'}
                    onChange={(e) => updateStyle({ labelWeight: e.target.value as 'normal' | 'medium' | 'semibold' | 'bold' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="semibold">Semibold</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                {/* Label Alignment */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
                  <div className="flex space-x-1">
                    {[
                      { label: 'Left', value: 'left' },
                      { label: 'Center', value: 'center' },
                      { label: 'Right', value: 'right' },
                    ].map((align) => (
                      <button
                        key={align.value}
                        onClick={() => updateStyle({ labelAlignment: align.value as 'left' | 'center' | 'right' })}
                        className={`flex-1 px-3 py-2 text-xs border rounded-md transition-colors ${
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

                {/* Label Margin Bottom */}
                <NumberInput
                  label="Label Spacing"
                  value={fieldStyle.labelMarginBottom || '4px'}
                  onChange={(margin) => updateStyle({ labelMarginBottom: margin })}
                  unit="px"
                  min={0}
                  max={20}
                />
              </div>
            </div>

            {/* Input Styling */}
            {selectedField.type !== 'separator' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Input Styling</h4>
                
                <div className="space-y-4">
                  {/* Input Text Color */}
                  <ColorPicker
                    label="Text Color"
                    value={fieldStyle.inputTextColor || '#111827'}
                    onChange={(color) => updateStyle({ inputTextColor: color })}
                    placeholder="#111827"
                  />

                  {/* Input Background Color */}
                  <ColorPicker
                    label="Background Color"
                    value={fieldStyle.inputBackgroundColor || '#ffffff'}
                    onChange={(color) => updateStyle({ inputBackgroundColor: color })}
                    placeholder="#ffffff"
                  />

                  {/* Input Border Color */}
                  <ColorPicker
                    label="Border Color"
                    value={fieldStyle.inputBorderColor || '#d1d5db'}
                    onChange={(color) => updateStyle({ inputBorderColor: color })}
                    placeholder="#d1d5db"
                  />

                  {/* Input Focus Color */}
                  <ColorPicker
                    label="Focus Ring Color"
                    value={fieldStyle.inputFocusColor || '#3b82f6'}
                    onChange={(color) => updateStyle({ inputFocusColor: color })}
                    placeholder="#3b82f6"
                  />

                  {/* Border Width */}
                  <NumberInput
                    label="Border Width"
                    value={fieldStyle.inputBorderWidth || '1px'}
                    onChange={(width) => updateStyle({ inputBorderWidth: width })}
                    unit="px"
                    min={0}
                    max={5}
                  />

                  {/* Border Radius */}
                  <NumberInput
                    label="Border Radius"
                    value={fieldStyle.inputBorderRadius || '6px'}
                    onChange={(radius) => updateStyle({ inputBorderRadius: radius })}
                    unit="px"
                    min={0}
                    max={20}
                  />

                  {/* Input Padding */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
                    <input
                      type="text"
                      value={fieldStyle.inputPadding || '8px 12px'}
                      onChange={(e) => updateStyle({ inputPadding: e.target.value })}
                      placeholder="8px 12px"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: top/bottom left/right (e.g., &quot;8px 12px&quot;)</p>
                  </div>

                  {/* Input Height */}
                  <NumberInput
                    label="Height"
                    value={fieldStyle.inputHeight || '40px'}
                    onChange={(height) => updateStyle({ inputHeight: height })}
                    unit="px"
                    min={30}
                    max={80}
                  />

                  {/* Input Font Size */}
                  <NumberInput
                    label="Font Size"
                    value={fieldStyle.inputFontSize || '14px'}
                    onChange={(size) => updateStyle({ inputFontSize: size })}
                    unit="px"
                    min={10}
                    max={20}
                  />
                </div>
              </div>
            )}

            {/* Field Container Styling */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Field Container</h4>
              
              <div className="space-y-4">
                {/* Margin Bottom */}
                <NumberInput
                  label="Bottom Margin"
                  value={fieldStyle.marginBottom || '16px'}
                  onChange={(margin) => updateStyle({ marginBottom: margin })}
                  unit="px"
                  min={0}
                  max={50}
                />

                {/* Width */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                  <input
                    type="text"
                    value={fieldStyle.width || '100%'}
                    onChange={(e) => updateStyle({ width: e.target.value })}
                    placeholder="100%"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use % for responsive or px for fixed width</p>
                </div>
              </div>
            </div>

            {/* Checkbox/Radio-specific Controls */}
            {(selectedField.type === 'checkbox' || selectedField.type === 'radio') && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {selectedField.type === 'checkbox' ? 'Checkbox Options' : 'Radio Options'}
                </h4>
                
                <div className="space-y-4">
                  {/* Style Variant */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Style</label>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => updateStyle({ checkboxStyle: 'default' })}
                        className={`flex-1 px-3 py-2 text-xs border rounded transition-colors ${
                          (fieldStyle.checkboxStyle || 'default') === 'default'
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Default
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStyle({ checkboxStyle: 'bordered' })}
                        className={`flex-1 px-3 py-2 text-xs border rounded transition-colors ${
                          fieldStyle.checkboxStyle === 'bordered'
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Bordered
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Choose between default or bordered container style</p>
                  </div>

                  {/* Checkbox Display Text (only for checkbox) */}
                  {selectedField.type === 'checkbox' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Checkbox Display Text</label>
                      <input
                        type="text"
                        value={fieldStyle.checkboxText || ''}
                        onChange={(e) => updateStyle({ checkboxText: e.target.value })}
                        placeholder={selectedField.label}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Text shown next to checkbox (leave empty to use field label)</p>
                    </div>
                  )}

                  {/* Checkbox/Radio Alignment (only for checkbox) */}
                  {selectedField.type === 'checkbox' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Checkbox Position</label>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => updateStyle({ checkboxAlignment: 'left' })}
                          className={`flex-1 px-3 py-2 text-xs border rounded transition-colors ${
                            (fieldStyle.checkboxAlignment || 'left') === 'left'
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          ☑️ Left
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStyle({ checkboxAlignment: 'right' })}
                          className={`flex-1 px-3 py-2 text-xs border rounded transition-colors ${
                            fieldStyle.checkboxAlignment === 'right'
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Right ☑️
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Position of checkbox relative to text</p>
                    </div>
                  )}

                  {/* Bordered Style Options */}
                  {fieldStyle.checkboxStyle === 'bordered' && (
                    <>
                      {/* Border Color */}
                      <ColorPicker
                        label="Border Color"
                        value={fieldStyle.checkboxBorderColor || fieldStyle.inputBorderColor || '#d1d5db'}
                        onChange={(color) => updateStyle({ checkboxBorderColor: color })}
                        placeholder="#d1d5db"
                      />

                      {/* Border Width */}
                      <NumberInput
                        label="Border Width"
                        value={fieldStyle.checkboxBorderWidth || fieldStyle.inputBorderWidth || '1px'}
                        onChange={(width) => updateStyle({ checkboxBorderWidth: width })}
                        unit="px"
                        min={0}
                        max={5}
                      />

                      {/* Border Radius */}
                      <NumberInput
                        label="Border Radius"
                        value={fieldStyle.checkboxBorderRadius || fieldStyle.inputBorderRadius || '6px'}
                        onChange={(radius) => updateStyle({ checkboxBorderRadius: radius })}
                        unit="px"
                        min={0}
                        max={20}
                      />

                      {/* Background Color */}
                      <ColorPicker
                        label="Background Color"
                        value={fieldStyle.checkboxBackgroundColor || fieldStyle.inputBackgroundColor || '#ffffff'}
                        onChange={(color) => updateStyle({ checkboxBackgroundColor: color })}
                        placeholder="#ffffff"
                      />

                      {/* Padding */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
                        <input
                          type="text"
                          value={fieldStyle.checkboxPadding || fieldStyle.inputPadding || '12px 16px'}
                          onChange={(e) => updateStyle({ checkboxPadding: e.target.value })}
                          placeholder="12px 16px"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: &quot;top bottom&quot; or &quot;top right bottom left&quot;</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Dropdown Styling */}
            {(selectedField.type === 'dropdown' || selectedField.type === 'radio') && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {selectedField.type === 'dropdown' ? 'Dropdown' : 'Radio'} Options Styling
                </h4>
                
                <div className="space-y-4">
                  {/* Option Hover Color */}
                  <ColorPicker
                    label="Hover Background Color"
                    value={fieldStyle.dropdownHoverColor || '#f3f4f6'}
                    onChange={(color) => updateStyle({ dropdownHoverColor: color })}
                    placeholder="#f3f4f6"
                  />

                  {/* Option Selected Color */}
                  <ColorPicker
                    label="Selected Background Color"
                    value={fieldStyle.dropdownSelectedColor || '#dbeafe'}
                    onChange={(color) => updateStyle({ dropdownSelectedColor: color })}
                    placeholder="#dbeafe"
                  />

                  {/* Option Text Color */}
                  <ColorPicker
                    label="Option Text Color"
                    value={fieldStyle.dropdownOptionTextColor || '#374151'}
                    onChange={(color) => updateStyle({ dropdownOptionTextColor: color })}
                    placeholder="#374151"
                  />

                  {/* Option Padding */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Option Padding</label>
                    <input
                      type="text"
                      value={fieldStyle.dropdownOptionPadding || '8px 12px'}
                      onChange={(e) => updateStyle({ dropdownOptionPadding: e.target.value })}
                      placeholder="8px 12px"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Spacing inside each option</p>
                  </div>

                  {selectedField.type === 'dropdown' && (
                    <>
                      {/* Dropdown Max Height */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Max Height</label>
                        <input
                          type="text"
                          value={fieldStyle.dropdownMaxHeight || '200px'}
                          onChange={(e) => updateStyle({ dropdownMaxHeight: e.target.value })}
                          placeholder="200px"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum height before scrolling</p>
                      </div>

                      {/* Dropdown Border Color */}
                      <ColorPicker
                        label="Dropdown Border Color"
                        value={fieldStyle.dropdownBorderColor || '#d1d5db'}
                        onChange={(color) => updateStyle({ dropdownBorderColor: color })}
                        placeholder="#d1d5db"
                      />

                      {/* Dropdown Shadow */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Dropdown Shadow</label>
                        <select
                          value={fieldStyle.dropdownShadow || 'shadow-lg'}
                          onChange={(e) => updateStyle({ dropdownShadow: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="shadow-none">No Shadow</option>
                          <option value="shadow-sm">Small Shadow</option>
                          <option value="shadow">Medium Shadow</option>
                          <option value="shadow-lg">Large Shadow</option>
                          <option value="shadow-xl">Extra Large Shadow</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Shadow depth for dropdown list</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Preview Section */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Style Preview</h5>
                  <div className="space-y-1">
                    <div 
                      className="px-2 py-1 text-xs rounded cursor-pointer transition-colors"
                      style={{
                        backgroundColor: fieldStyle.dropdownSelectedColor || '#dbeafe',
                        color: fieldStyle.dropdownOptionTextColor || '#374151',
                        padding: fieldStyle.dropdownOptionPadding || '8px 12px'
                      }}
                    >
                      Selected Option
                    </div>
                    <div 
                      className="px-2 py-1 text-xs rounded cursor-pointer transition-colors hover:bg-gray-200"
                      style={{
                        color: fieldStyle.dropdownOptionTextColor || '#374151',
                        padding: fieldStyle.dropdownOptionPadding || '8px 12px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = fieldStyle.dropdownHoverColor || '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Hover Over This Option
                    </div>
                    <div 
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        color: fieldStyle.dropdownOptionTextColor || '#374151',
                        padding: fieldStyle.dropdownOptionPadding || '8px 12px'
                      }}
                    >
                      Normal Option
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Field Icon */}
            {(selectedField.type === 'email' || selectedField.type === 'phone' || selectedField.type === 'text' || selectedField.type === 'date' || selectedField.type === 'postal' || selectedField.type === 'file') && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Icon</h4>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Field Icon</label>
                  <input
                    type="text"
                    value={fieldStyle.icon || ''}
                    onChange={(e) => updateStyle({ icon: e.target.value })}
                    placeholder="📧 (emoji or icon)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add an emoji or icon that appears inside the input</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation Tab */}
        {activeTab === 'validation' && selectedField.type !== 'separator' && (
          <div className="space-y-6">
            {/* Required Field */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedField.required || false}
                  onChange={(e) => onUpdateField({ required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-sm font-medium text-gray-700">
                  Required Field
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Users must fill this field to submit the form</p>
            </div>

            {/* Text/Email/Phone/Postal/LongText Validation */}
            {['text', 'email', 'phone', 'postal', 'longtext'].includes(selectedField.type) && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Text Length</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Min Length</label>
                    <input
                      type="number"
                      value={validation.minLength || ''}
                      onChange={(e) => updateValidation({ minLength: parseInt(e.target.value) || undefined })}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Max Length</label>
                    <input
                      type="number"
                      value={validation.maxLength || ''}
                      onChange={(e) => updateValidation({ maxLength: parseInt(e.target.value) || undefined })}
                      placeholder="No limit"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Number Validation */}
            {selectedField.type === 'number' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Number Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Min Value</label>
                    <input
                      type="number"
                      value={validation.min ?? ''}
                      onChange={(e) => updateValidation({ min: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="No minimum"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Max Value</label>
                    <input
                      type="number"
                      value={validation.max ?? ''}
                      onChange={(e) => updateValidation({ max: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="No maximum"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Date Validation */}
            {selectedField.type === 'date' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Date Format</h4>
                  <select
                    value={validation.dateFormat || 'YYYY-MM-DD'}
                    onChange={(e) => updateValidation({ dateFormat: e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'custom' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                    <option value="custom">Custom Format</option>
                  </select>
                  {validation.dateFormat === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={validation.customDateFormat || ''}
                        onChange={(e) => updateValidation({ customDateFormat: e.target.value })}
                        placeholder="e.g., DD/MM/YYYY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min Date</label>
                      <input
                        type="date"
                        value={validation.minDate || ''}
                        onChange={(e) => updateValidation({ minDate: e.target.value || undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max Date</label>
                      <input
                        type="date"
                        value={validation.maxDate || ''}
                        onChange={(e) => updateValidation({ maxDate: e.target.value || undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Age Validation</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min Age</label>
                      <input
                        type="number"
                        value={validation.minAge ?? ''}
                        onChange={(e) => updateValidation({ minAge: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="No minimum"
                        min="0"
                        max="150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max Age</label>
                      <input
                        type="number"
                        value={validation.maxAge ?? ''}
                        onChange={(e) => updateValidation({ maxAge: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="No maximum"
                        min="0"
                        max="150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Postal Code Validation */}
            {(selectedField.type as string) === 'postal' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Postal Code Format</h4>
                <select
                  value={validation.postalFormat || 'US'}
                  onChange={(e) => updateValidation({ postalFormat: e.target.value as 'US' | 'UK' | 'CA' | 'IN' | 'custom' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="US">US (12345 or 12345-6789)</option>
                  <option value="UK">UK (SW1A 1AA)</option>
                  <option value="CA">Canada (K1A 0A6)</option>
                  <option value="IN">India (110001)</option>
                  <option value="custom">Custom Pattern</option>
                </select>
                {validation.postalFormat === 'custom' && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Custom Regex Pattern</label>
                    <input
                      type="text"
                      value={validation.customPattern || ''}
                      onChange={(e) => updateValidation({ customPattern: e.target.value })}
                      placeholder="^[0-9]{5}$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a valid regex pattern</p>
                  </div>
                )}
              </div>
            )}

            {/* File Validation */}
            {selectedField.type === 'file' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">File Size Limit</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={validation.maxFileSize || ''}
                      onChange={(e) => updateValidation({ maxFileSize: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="10"
                      min="0.1"
                      step="0.1"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="text-sm text-gray-500">MB</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Allowed File Types</h4>
                  <input
                    type="text"
                    value={validation.fileTypes?.join(', ') || ''}
                    onChange={(e) => updateValidation({ 
                      fileTypes: e.target.value ? e.target.value.split(',').map(type => type.trim()) : undefined 
                    })}
                    placeholder="jpg, png, pdf, doc"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate file extensions with commas (without dots)</p>
                </div>
              </div>
            )}

            {/* Custom Pattern Validation for Text Fields */}
            {['text', 'longtext'].includes(selectedField.type) && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Pattern</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={validation.pattern || ''}
                    onChange={(e) => updateValidation({ pattern: e.target.value || undefined })}
                    placeholder="^[A-Za-z]+$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={validation.message || ''}
                    onChange={(e) => updateValidation({ message: e.target.value || undefined })}
                    placeholder="Custom error message"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500">Enter a regex pattern and custom error message</p>
                </div>
              </div>
            )}

            {/* Dropdown/Radio Options Validation Note */}
            {['dropdown', 'radio'].includes(selectedField.type) && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Options Validation</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>This field automatically validates that users select from the available options. Configure options in the Content tab.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Error Messages */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Error Messages</h4>
              <p className="text-xs text-gray-500 mb-4">Customize error messages for different validation failures</p>
              
              <div className="space-y-4">
                {/* Required Field Error Message */}
                {selectedField.required && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Required Field Message</label>
                    <input
                      type="text"
                      value={validation.requiredMessage || ''}
                      onChange={(e) => updateValidation({ requiredMessage: e.target.value })}
                      placeholder="This field is required"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}

                {/* Length Validation Error Messages */}
                {(selectedField.type === 'text' || selectedField.type === 'longtext' || selectedField.type === 'email' || selectedField.type === 'phone' || selectedField.type === 'postal') && (
                  <>
                    {validation.minLength && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Length Error</label>
                        <input
                          type="text"
                          value={validation.minLengthMessage || ''}
                          onChange={(e) => updateValidation({ minLengthMessage: e.target.value })}
                          placeholder={`Must be at least ${validation.minLength} characters`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                    
                    {validation.maxLength && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Maximum Length Error</label>
                        <input
                          type="text"
                          value={validation.maxLengthMessage || ''}
                          onChange={(e) => updateValidation({ maxLengthMessage: e.target.value })}
                          placeholder={`Must be no more than ${validation.maxLength} characters`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Number Validation Error Messages */}
                {selectedField.type === 'number' && (
                  <>
                    {(validation.min !== undefined && validation.min !== null) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Value Error</label>
                        <input
                          type="text"
                          value={validation.minMessage || ''}
                          onChange={(e) => updateValidation({ minMessage: e.target.value })}
                          placeholder={`Must be at least ${validation.min}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                    
                    {(validation.max !== undefined && validation.max !== null) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Maximum Value Error</label>
                        <input
                          type="text"
                          value={validation.maxMessage || ''}
                          onChange={(e) => updateValidation({ maxMessage: e.target.value })}
                          placeholder={`Must be no more than ${validation.max}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Email Error Message */}
                {selectedField.type === 'email' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Invalid Email Error</label>
                    <input
                      type="text"
                      value={validation.emailMessage || ''}
                      onChange={(e) => updateValidation({ emailMessage: e.target.value })}
                      placeholder="Please enter a valid email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}

                {/* Phone Error Message */}
                {selectedField.type === 'phone' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Invalid Phone Error</label>
                    <input
                      type="text"
                      value={validation.phoneMessage || ''}
                      onChange={(e) => updateValidation({ phoneMessage: e.target.value })}
                      placeholder="Please enter a valid phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}

                {/* Date Validation Error Messages */}
                {selectedField.type === 'date' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Invalid Date Format Error</label>
                      <input
                        type="text"
                        value={validation.dateFormatMessage || ''}
                        onChange={(e) => updateValidation({ dateFormatMessage: e.target.value })}
                        placeholder={`Please enter date in ${validation.dateFormat || 'YYYY-MM-DD'} format`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    
                    {validation.minAge && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Age Error</label>
                        <input
                          type="text"
                          value={validation.minAgeMessage || ''}
                          onChange={(e) => updateValidation({ minAgeMessage: e.target.value })}
                          placeholder={`You must be at least ${validation.minAge} years old`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                    
                    {validation.maxAge && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Maximum Age Error</label>
                        <input
                          type="text"
                          value={validation.maxAgeMessage || ''}
                          onChange={(e) => updateValidation({ maxAgeMessage: e.target.value })}
                          placeholder={`You must be no more than ${validation.maxAge} years old`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* File Validation Error Messages */}
                {selectedField.type === 'file' && (
                  <>
                    {validation.maxFileSize && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">File Size Error</label>
                        <input
                          type="text"
                          value={validation.fileSizeMessage || ''}
                          onChange={(e) => updateValidation({ fileSizeMessage: e.target.value })}
                          placeholder={`File size must be less than ${validation.maxFileSize}MB`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                    
                    {validation.fileTypes && validation.fileTypes.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">File Type Error</label>
                        <input
                          type="text"
                          value={validation.fileTypeMessage || ''}
                          onChange={(e) => updateValidation({ fileTypeMessage: e.target.value })}
                          placeholder={`Only ${validation.fileTypes.join(', ')} files are allowed`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Pattern Validation Error Message */}
                {(selectedField.type === 'text' || selectedField.type === 'longtext') && validation.pattern && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Pattern Validation Error</label>
                    <input
                      type="text"
                      value={validation.patternMessage || ''}
                      onChange={(e) => updateValidation({ patternMessage: e.target.value })}
                      placeholder="Please enter a valid format"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h5 className="text-xs font-medium text-yellow-800 mb-1">💡 Tip</h5>
                <p className="text-xs text-yellow-700">
                  Leave fields empty to use default error messages. Custom messages will override the defaults.
                </p>
              </div>
            </div>

            {/* Conditional Logic */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Conditional Logic</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="enable-conditional"
                    type="checkbox"
                    checked={!!selectedField.conditionalLogic}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onUpdateField({
                          conditionalLogic: {
                            dependsOn: '',
                            condition: 'equals',
                            value: ''
                          }
                        });
                      } else {
                        onUpdateField({ conditionalLogic: undefined });
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-conditional" className="ml-2 block text-sm font-medium text-gray-700">
                    Show this field conditionally
                  </label>
                </div>
                <p className="text-xs text-gray-500">Hide or show this field based on other field values</p>

                {selectedField.conditionalLogic && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    {/* Depends On Field */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Show when field</label>
                      <select
                        value={selectedField.conditionalLogic.dependsOn || ''}
                        onChange={(e) => onUpdateField({
                          conditionalLogic: {
                            ...selectedField.conditionalLogic!,
                            dependsOn: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select a field...</option>
                        {allFields
                          .filter(field => field.id !== selectedField.id && 
                                          ['checkbox', 'radio', 'dropdown', 'text', 'email', 'phone'].includes(field.type))
                          .map(field => (
                            <option key={field.id} value={field.id}>
                              {field.label || `${field.type} field`}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                      <select
                        value={selectedField.conditionalLogic.condition}
                        onChange={(e) => onUpdateField({
                          conditionalLogic: {
                            ...selectedField.conditionalLogic!,
                            condition: e.target.value as 'equals' | 'not_equals' | 'contains' | 'checked' | 'not_checked'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="equals">equals</option>
                        <option value="not_equals">does not equal</option>
                        <option value="contains">contains</option>
                        <option value="checked">is checked</option>
                        <option value="not_checked">is not checked</option>
                      </select>
                    </div>

                    {/* Value (only for non-checkbox conditions) */}
                    {!['checked', 'not_checked'].includes(selectedField.conditionalLogic.condition) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                        {(() => {
                          const dependentField = allFields.find(f => f.id === selectedField.conditionalLogic?.dependsOn);
                          
                          if (dependentField?.type === 'radio' || dependentField?.type === 'dropdown') {
                            return (
                              <select
                                value={selectedField.conditionalLogic.value as string || ''}
                                onChange={(e) => onUpdateField({
                                  conditionalLogic: {
                                    ...selectedField.conditionalLogic!,
                                    value: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                <option value="">Select an option...</option>
                                {('options' in dependentField ? dependentField.options : [])?.map(option => (
                                  <option key={option.id} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            );
                          } else {
                            return (
                              <input
                                type="text"
                                value={selectedField.conditionalLogic.value as string || ''}
                                onChange={(e) => onUpdateField({
                                  conditionalLogic: {
                                    ...selectedField.conditionalLogic!,
                                    value: e.target.value
                                  }
                                })}
                                placeholder="Enter value..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            );
                          }
                        })()}
                      </div>
                    )}

                    {/* Preview */}
                    {selectedField.conditionalLogic.dependsOn && (
                      <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                        <strong>Preview:</strong> Show this field when{' '}
                        <span className="font-medium">
                          {allFields.find(f => f.id === selectedField.conditionalLogic?.dependsOn)?.label || 'selected field'}
                        </span>{' '}
                        <span className="font-medium">
                          {selectedField.conditionalLogic.condition === 'equals' && 'equals'}
                          {selectedField.conditionalLogic.condition === 'not_equals' && 'does not equal'}
                          {selectedField.conditionalLogic.condition === 'contains' && 'contains'}
                          {selectedField.conditionalLogic.condition === 'checked' && 'is checked'}
                          {selectedField.conditionalLogic.condition === 'not_checked' && 'is not checked'}
                        </span>
                        {!['checked', 'not_checked'].includes(selectedField.conditionalLogic.condition) && (
                          <span className="font-medium"> &quot;{selectedField.conditionalLogic.value}&quot;</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
