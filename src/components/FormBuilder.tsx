'use client';

import React, { useState, useCallback } from 'react';
import { FormBuilderEditor } from './tiptap/FormBuilderEditor';
import { FieldInspector } from './inspector/FieldInspector';
import { FormPreview } from './preview/FormPreview';
import { FormFieldData, FormSchema } from '@/types/form';

type ViewMode = 'builder' | 'preview';

export function FormBuilder() {
  const [selectedField, setSelectedField] = useState<FormFieldData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);

  const handleFieldSelect = useCallback((field: FormFieldData | null) => {
    setSelectedField(field);
  }, []);

  const handleFieldUpdate = useCallback((updates: Partial<FormFieldData>) => {
    if (!selectedField) return;
    
    // Update the selected field state
    setSelectedField(prev => {
      if (!prev) return null;
      return { ...prev, ...updates } as FormFieldData;
    });
    
    // Note: The actual update to the TipTap editor will be handled by the FormBuilderEditor
    // through the updateSelectedField callback
  }, [selectedField]);

  const handlePreview = useCallback((schema: FormSchema) => {
    setFormSchema(schema);
    setViewMode('preview');
  }, []);

  const handleBackToBuilder = useCallback(() => {
    setViewMode('builder');
  }, []);

  if (viewMode === 'preview' && formSchema) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Form Preview</h1>
            <button
              onClick={handleBackToBuilder}
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
              onClick={() => {
                // This will be implemented to trigger preview from the editor
                console.log('Preview mode will be implemented');
              }}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Preview Form
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1">
          <FormBuilderEditor 
            onFieldSelect={handleFieldSelect}
            selectedFieldId={selectedField?.id || null}
          />
        </div>

        {/* Inspector Sidebar */}
        <FieldInspector 
          selectedField={selectedField}
          onUpdateField={handleFieldUpdate}
        />
      </div>
    </div>
  );
}
