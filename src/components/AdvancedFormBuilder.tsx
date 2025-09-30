'use client';

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { FormFieldData, FormFieldType, FormSchema, FormDesign, LayoutContainer, FieldOption } from '@/types/form';
import { StructurePalette } from './structure/StructurePalette';
import { ThemeInspector } from './design/ThemeInspector';
import { FieldDesignInspector } from './design/FieldDesignInspector';
import { FormPreviewLive } from './FormPreviewLive';
import { convertFieldStyleToCSS, convertFormDesignToCSS } from '@/utils/tailwindToCss';

type ViewMode = 'builder' | 'preview';
type InspectorMode = 'field' | 'theme';

export function AdvancedFormBuilder() {
  const idCounterRef = useRef(0);
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [containers, setContainers] = useState<LayoutContainer[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [inspectorMode, setInspectorMode] = useState<InspectorMode>('field');
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [formDesign, setFormDesign] = useState<FormDesign>({
    backgroundColor: 'bg-white',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    spacing: {
      container: 'p-6',
      fields: 'space-y-6',
    },
  });

  const addField = useCallback((type: FormFieldType) => {
    const newField: FormFieldData = {
      id: `field_${++idCounterRef.current}`,
      name: `${type}_${idCounterRef.current}`, // Generate unique name
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'separator' ? '' : `Enter ${type}...`,
      required: false,
      validation: {},
      layout: 'standalone',
      width: 'w-full', // Default to full width
      style: {
        labelColor: 'text-gray-700',
        labelWeight: 'medium',
        labelAlignment: 'left',
        inputBorderColor: 'border-gray-300',
        inputBorderRadius: 'rounded-md',
        inputBackgroundColor: 'bg-white',
        inputFocusColor: 'focus:ring-blue-500',
      },
      ...(type === 'dropdown' || type === 'radio' ? {
        options: [
          { id: '1', label: 'Option 1', value: 'option1' },
          { id: '2', label: 'Option 2', value: 'option2' },
        ]
      } : {}),
      ...(type === 'longtext' ? { rows: 4 } : {}),
      ...(type === 'richtext' ? { 
        minHeight: '120px', 
        maxHeight: '400px', 
        toolbar: 'basic',
        allowLinks: true,
        allowFormatting: true 
      } : {}),
      ...(type === 'checkbox' ? {
        useRichText: false,
        richTextContent: '',
        linkText: '',
        linkUrl: ''
      } : {}),
    } as FormFieldData;

    setFields(prev => [...prev, newField]);
    setSelectedField(newField);
    setInspectorMode('field');
  }, []);

  const addSingleColumn = useCallback(() => {
    const newContainer: LayoutContainer = {
      id: `single_${++idCounterRef.current}`,
      type: 'single-column',
      fields: [],
      style: {
        backgroundColor: 'bg-gray-50',
        padding: 'p-4',
        margin: 'my-4',
        borderRadius: 'rounded-lg',
        borderColor: 'border-gray-300',
        borderWidth: 'border-2',
      },
    };
    setContainers(prev => [...prev, newContainer]);
  }, []);

  const addTwoColumn = useCallback(() => {
    const newContainer: LayoutContainer = {
      id: `two_${++idCounterRef.current}`,
      type: 'two-column',
      fields: [],
      leftFields: [],
      rightFields: [],
      style: {
        backgroundColor: 'bg-gray-50',
        padding: 'p-4',
        margin: 'my-4',
        borderRadius: 'rounded-lg',
        borderColor: 'border-gray-300',
        borderWidth: 'border-2',
      },
    };
    setContainers(prev => [...prev, newContainer]);
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

  const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    setFields(prev => {
      const index = prev.findIndex(field => field.id === fieldId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newFields = [...prev];
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      return newFields;
    });
  }, []);

  const updateDesign = useCallback((updates: Partial<FormDesign>) => {
    setFormDesign(prev => ({ ...prev, ...updates }));
  }, []);

  const handlePreview = useCallback(() => {
    setViewMode('preview');
  }, []);

  const handleExportSchema = useCallback(() => {
    // Convert fields to SDK-friendly format with CSS properties
    const fieldsWithCSS = fields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      validation: field.validation,
      width: field.width,
      style: {
        label: {
          color: field.style?.labelColor || '#111827',
          'font-weight': field.style?.labelWeight === 'medium' ? '500' : 
                        field.style?.labelWeight === 'semibold' ? '600' : 
                        field.style?.labelWeight === 'bold' ? '700' : '400',
          'font-size': field.style?.labelFontSize || '14px',
          'text-align': field.style?.labelAlignment || 'left',
          'margin-bottom': '4px'
        },
        input: {
          'background-color': field.style?.inputBackgroundColor || '#ffffff',
          'border-color': field.style?.inputBorderColor || '#d1d5db',
          'border-radius': field.style?.inputBorderRadius || '6px',
          'border-width': field.style?.inputBorderWidth || '1px',
          padding: field.style?.inputPadding || '12px 16px',
          'font-size': field.style?.inputFontSize || '16px',
          height: field.style?.inputHeight || '48px',
          color: field.style?.inputTextColor || '#111827'
        }
      },
      // Include field-specific properties
      ...(field.type === 'dropdown' || field.type === 'radio' ? { options: (field as any).options } : {}),
      ...(field.type === 'longtext' ? { rows: (field as any).rows } : {}),
      ...(field.type === 'richtext' ? { 
        minHeight: (field as any).minHeight,
        maxHeight: (field as any).maxHeight,
        toolbar: (field as any).toolbar
      } : {}),
      ...(field.type === 'checkbox' ? {
        checkboxText: (field as any).checkboxText,
        checkboxAlignment: (field as any).checkboxAlignment
      } : {}),
      ...(field.type === 'terms' ? {
        mode: (field as any).mode,
        content: (field as any).content,
        links: (field as any).links
      } : {}),
      ...(field.type === 'file' ? {
        accept: (field as any).accept,
        multiple: (field as any).multiple
      } : {}),
    }));

    const formId = ++idCounterRef.current;
    const schema = {
      id: `form_${formId}`,
      name: `form_${formId}`,
      title: formTitle,
      description: formDescription,
      fields: fieldsWithCSS,
      design: {
        'background-color': formDesign.backgroundColor,
        'font-family': formDesign.fontFamily,
        'font-size': formDesign.fontSize,
        padding: formDesign.padding,
        'max-width': formDesign.maxWidth,
        'border-radius': formDesign.borderRadius,
        'box-shadow': formDesign.boxShadow,
        'logo-url': formDesign.logoUrl,
        'submit-button': {
          text: formDesign.submitButton?.text || 'Submit',
          'background-color': formDesign.submitButton?.backgroundColor || '#2563eb',
          'text-color': formDesign.submitButton?.textColor || '#ffffff',
          padding: formDesign.submitButton?.padding || '14px 32px',
          'border-radius': formDesign.submitButton?.borderRadius || '6px',
          'font-size': formDesign.submitButton?.fontSize || '16px',
          'font-weight': formDesign.submitButton?.fontWeight || 'semibold',
          width: formDesign.submitButton?.width || 'auto',
          alignment: formDesign.submitButton?.alignment || 'center'
        },
        spacing: formDesign.spacing,
        // Generate font family link if custom font is used
        'font-link': formDesign.fontFamily && !formDesign.fontFamily.startsWith('font-') 
          ? `https://fonts.googleapis.com/css2?family=${formDesign.fontFamily.replace(/\s+/g, '+')}&display=swap`
          : null
      }
    };
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(schema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `advanced_form_${formTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('Enhanced Form Schema with CSS:', schema);
    alert('Enhanced form schema exported with exact CSS properties!');
  }, [fields, formTitle, formDescription, formDesign]);

  const renderField = (field: FormFieldData) => {
    const isSelected = selectedField?.id === field.id;
    const fieldStyle = field.style || {};

    // Apply dynamic Tailwind classes based on field style
    const labelClasses = [
      'block text-sm mb-1',
      fieldStyle.labelColor || 'text-gray-700',
      fieldStyle.labelWeight || 'font-medium',
      fieldStyle.labelAlignment === 'center' ? 'text-center' : 
      fieldStyle.labelAlignment === 'right' ? 'text-right' : 'text-left',
    ].filter(Boolean).join(' ');

    const inputClasses = [
      'w-full shadow-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 border',
      fieldStyle.inputBorderColor || 'border-gray-300',
      fieldStyle.inputBorderRadius || 'rounded-md',
      fieldStyle.inputBackgroundColor || 'bg-white',
      fieldStyle.inputFocusColor || 'focus:ring-blue-500',
      fieldStyle.inputPadding || 'px-3 py-2',
    ].filter(Boolean).join(' ');

    return (
      <div
        key={field.id}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 cursor-pointer transition-colors ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={() => {
          setSelectedField(field);
          setInspectorMode('field');
        }}
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
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveField(field.id, 'up');
              }}
              className="text-blue-400 hover:text-blue-600 text-sm p-1"
              title="Move Up"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveField(field.id, 'down');
              }}
              className="text-blue-400 hover:text-blue-600 text-sm p-1"
              title="Move Down"
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteField(field.id);
              }}
              className="text-red-400 hover:text-red-600 p-1"
              title="Delete Field"
            >
              ×
            </button>
          </div>
        </div>

        {/* Field Preview with Applied Styles */}
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
              <label className={labelClasses}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.description && (
                <p className="text-sm text-gray-500">{field.description}</p>
              )}
              
              {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
                <div className="relative">
                  {fieldStyle.icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">📧</span>
                    </div>
                  )}
                  <input
                    type={field.type === 'phone' ? 'tel' : field.type}
                    placeholder={field.placeholder}
                    className={`${inputClasses} ${fieldStyle.icon ? 'pl-10' : ''}`}
                    disabled
                  />
                </div>
              )}

              {field.type === 'longtext' && (
                <textarea
                  placeholder={field.placeholder}
                  rows={field.type === 'longtext' && 'rows' in field ? field.rows : 4}
                  className={`${inputClasses} resize-vertical`}
                  disabled
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className={inputClasses}
                  disabled
                />
              )}

              {field.type === 'dropdown' && (
                <select className={inputClasses} disabled>
                  <option>{field.placeholder || 'Select an option...'}</option>
                  {field.type === 'dropdown' && 'options' in field && field.options?.map((option: FieldOption) => (
                    <option key={option.id}>{option.label}</option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled className="h-4 w-4" />
                  <span className="text-sm">Checkbox option</span>
                </div>
              )}

              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.type === 'radio' && 'options' in field && field.options?.map((option: FieldOption) => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input type="radio" disabled className="h-4 w-4" />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'file' && (
                <input
                  type="file"
                  className={inputClasses}
                  disabled
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (viewMode === 'preview') {
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
          <FormPreviewLive
            fields={fields}
            containers={containers}
            formTitle={formTitle}
            formDescription={formDescription}
            formDesign={formDesign}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Structure Palette */}
      <StructurePalette
        onInsertSingleColumn={addSingleColumn}
        onInsertTwoColumn={addTwoColumn}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Advanced Form Builder</h1>
              <p className="text-sm text-gray-500">Create beautiful forms with advanced layouts and styling</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInspectorMode('theme')}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  inspectorMode === 'theme'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎨 Theme
              </button>
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

        {/* Form Fields Toolbar */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-4">Add Fields:</span>
            {[
              { type: 'text', label: 'Text' },
              { type: 'longtext', label: 'Long Text' },
              { type: 'email', label: 'Email' },
              { type: 'phone', label: 'Phone' },
              { type: 'number', label: 'Number' },
              { type: 'dropdown', label: 'Dropdown' },
              { type: 'radio', label: 'Radio' },
              { type: 'checkbox', label: 'Checkbox' },
              { type: 'file', label: 'File' },
              { type: 'separator', label: 'Separator' },
            ].map((field) => (
              <button
                key={field.type}
                onClick={() => addField(field.type as FormFieldType)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                + {field.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-4xl mx-auto py-8">
            <div className={`rounded-lg shadow-sm border border-gray-200 min-h-[500px] ${
              formDesign.backgroundColor || 'bg-white'
            } ${formDesign.spacing?.container || 'p-6'} ${formDesign.fontFamily || 'font-sans'} ${formDesign.fontSize || 'text-base'}`}>
              {/* Form Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                {formDesign.logoUrl && (
                  <div className="mb-4">
                    <Image
                      src={formDesign.logoUrl}
                      alt="Form logo"
                      width={200}
                      height={64}
                      className="h-16 object-contain"
                    />
                  </div>
                )}
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

              {/* Layout Containers */}
              {containers.map((container) => (
                <div
                  key={container.id}
                  className={`${container.style?.backgroundColor || 'bg-gray-50'} ${
                    container.style?.padding || 'p-4'
                  } ${container.style?.margin || 'my-4'} ${
                    container.style?.borderRadius || 'rounded-lg'
                  } border-2 border-dashed ${container.style?.borderColor || 'border-gray-300'}`}
                >
                  <div className="text-xs text-purple-600 mb-2">
                    {container.type === 'single-column' ? 'SINGLE COLUMN' : 'TWO COLUMN'}
                  </div>
                  {container.type === 'two-column' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-dashed border-gray-200 rounded p-3 min-h-[100px]">
                        <div className="text-xs text-gray-400 mb-2">Left Column</div>
                      </div>
                      <div className="border border-dashed border-gray-200 rounded p-3 min-h-[100px]">
                        <div className="text-xs text-gray-400 mb-2">Right Column</div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded p-3 min-h-[100px]">
                      <div className="text-xs text-gray-400">Drop fields here</div>
                    </div>
                  )}
                </div>
              ))}

              {/* Standalone Fields */}
              {fields.length === 0 && containers.length === 0 ? (
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
                    Add layout structures from the left panel or form fields from the toolbar above.
                  </p>
                </div>
              ) : (
                <div className={formDesign.spacing?.fields || 'space-y-6'}>
                  {fields.map((field) => renderField(field))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inspector Sidebar */}
      {inspectorMode === 'theme' ? (
        <ThemeInspector design={formDesign} onUpdateDesign={updateDesign} />
      ) : (
        <FieldDesignInspector
          selectedField={selectedField}
          allFields={fields}
          onUpdateField={(updates) => {
            if (selectedField) {
              updateField(selectedField.id, updates);
            }
          }}
        />
      )}
    </div>
  );
}
