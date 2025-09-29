'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { FormFieldData, FormFieldType, FormSchema } from '@/types/form';
import { FieldInspector } from './inspector/FieldInspector';
import { FormPreview } from './preview/FormPreview';

type ViewMode = 'builder' | 'preview';

export function SimpleFormBuilder() {
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');

  const addField = useCallback((type: FormFieldType) => {
    const newField: FormFieldData = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'separator' ? '' : `Enter ${type}...`,
      required: false,
      validation: {},
      ...(type === 'dropdown' || type === 'radio' ? {
        options: [
          { id: '1', label: 'Option 1', value: 'option1' },
          { id: '2', label: 'Option 2', value: 'option2' },
        ]
      } : {}),
      ...(type === 'longtext' ? { rows: 4 } : {}),
    } as FormFieldData;

    setFields(prev => [...prev, newField]);
    setSelectedField(newField);
  }, []);

  const updateField = useCallback((fieldId: string, updates: Partial<FormFieldData>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } as FormFieldData : field
    ));
    
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } as FormFieldData : null);
    }
  }, [selectedField]);

  const deleteField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [selectedField]);

  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    setFields(prev => {
      const newFields = [...prev];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return newFields;
    });
  }, []);

  const handlePreview = useCallback(() => {
    const schema: FormSchema = {
      id: `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields,
      layout: { type: 'single' },
    };
    setFormSchema(schema);
    setViewMode('preview');
  }, [fields, formTitle, formDescription]);

  const handleExportSchema = useCallback(() => {
    const schema: FormSchema = {
      id: `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields,
      layout: { type: 'single' },
    };
    console.log('Form Schema:', JSON.stringify(schema, null, 2));
    alert('Form schema exported to console!');
  }, [fields, formTitle, formDescription]);

  const renderField = (field: FormFieldData, index: number) => {
    const isSelected = selectedField?.id === field.id;

    return (
      <div
        key={field.id}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 cursor-pointer transition-colors ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={() => setSelectedField(field)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {field.type.toUpperCase()}
            </span>
            {isSelected && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                SELECTED
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (index > 0) moveField(index, index - 1);
              }}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (index < fields.length - 1) moveField(index, index + 1);
              }}
              disabled={index === fields.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteField(field.id);
              }}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>

        {/* Field Preview */}
        <div className="space-y-2">
          {field.type === 'separator' ? (
            <div>
              {field.label && field.label !== 'Separator' && (
                <h3 className="text-lg font-medium text-gray-900 mb-2">{field.label}</h3>
              )}
              {field.description && (
                <p className="text-sm text-gray-600 mb-3">{field.description}</p>
              )}
              <hr className="border-gray-300" />
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.description && (
                <p className="text-sm text-gray-500">{field.description}</p>
              )}
              
              {field.type === 'text' || field.type === 'email' || field.type === 'phone' ? (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  disabled
                />
              ) : field.type === 'longtext' ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={(field as any).rows || 4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  disabled
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  disabled
                />
              ) : field.type === 'dropdown' ? (
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" disabled>
                  <option>{field.placeholder || 'Select an option...'}</option>
                  {(field.type === 'dropdown' && 'options' in field ? field.options : [])?.map((option) => (
                    <option key={option.id}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === 'radio' ? (
                <div className="space-y-2">
                  {(field.type === 'radio' && 'options' in field ? field.options : [])?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <input type="radio" disabled className="h-4 w-4" />
                      <label className="text-sm">{option.label}</label>
                    </div>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled className="h-4 w-4" />
                  <span className="text-sm">Checkbox option</span>
                </div>
              ) : field.type === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  };

  if (viewMode === 'preview' && formSchema) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Form Preview</h1>
            <button
              onClick={() => setViewMode('builder')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              ← Back to Builder
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <FormPreview schema={formSchema} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Form Builder</h1>
            <p className="text-sm text-gray-500">Create beautiful forms with drag-and-drop</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Preview Form
            </button>
            <button
              onClick={handleExportSchema}
              className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Export Schema
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4 bg-white">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addField('text')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Text Field
              </button>
              <button
                onClick={() => addField('longtext')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Long Text
              </button>
              <button
                onClick={() => addField('email')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Email
              </button>
              <button
                onClick={() => addField('number')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Number
              </button>
              <button
                onClick={() => addField('dropdown')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Dropdown
              </button>
              <button
                onClick={() => addField('radio')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Radio
              </button>
              <button
                onClick={() => addField('phone')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Phone
              </button>
              <button
                onClick={() => addField('checkbox')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + Checkbox
              </button>
              <button
                onClick={() => addField('file')}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              >
                + File Upload
              </button>
              <button
                onClick={() => addField('separator')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                + Separator
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="max-w-4xl mx-auto py-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px] p-6">
                {/* Form Header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                    placeholder="Form Title"
                  />
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="mt-2 text-gray-600 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none"
                    placeholder="Form description (optional)"
                    rows={2}
                  />
                </div>

                {fields.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
                    <p className="text-sm text-gray-500">
                      Click on the buttons above to add form fields to your form.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => renderField(field, index))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inspector Sidebar */}
        <FieldInspector 
          selectedField={selectedField}
          onUpdateField={(updates) => {
            if (selectedField) {
              updateField(selectedField.id, updates);
            }
          }}
        />
      </div>
    </div>
  );
}
