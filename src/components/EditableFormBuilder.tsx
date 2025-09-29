'use client';

import React, { useState, useCallback } from 'react';
import { FormFieldData, FormFieldType, FormSchema, FormDesign, FieldOption, SubmitButton } from '@/types/form';
import { FormPreviewLive } from './FormPreviewLive';
import { convertFieldStyleToCSS, convertFormDesignToCSS } from '@/utils/tailwindToCss';
import Image from 'next/image';

type ViewMode = 'builder' | 'preview';
type InspectorMode = 'field' | 'theme';

interface LayoutContainer {
  id: string;
  type: 'single' | 'two-column';
  leftFields: string[];
  rightFields: string[];
}

export function EditableFormBuilder() {
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [containers, setContainers] = useState<LayoutContainer[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldData | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [inspectorMode, setInspectorMode] = useState<InspectorMode>('field');
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [formDesign, setFormDesign] = useState<FormDesign>({
    backgroundColor: 'bg-white',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    spacing: { 
      container: 'p-8', 
      fields: 'space-y-6', 
      columnGap: '1rem', 
      rowGap: '1.5rem' 
    },
    logoUrl: '',
    padding: 'p-8',
    maxWidth: 'max-w-2xl',
    borderRadius: 'rounded-lg',
    boxShadow: 'shadow-sm',
    submitButton: {
      text: 'Submit Form',
      backgroundColor: 'bg-blue-600',
      textColor: 'text-white',
      padding: 'py-3 px-4',
      borderRadius: 'rounded-md',
      fontSize: 'text-base',
      fontWeight: 'font-medium',
      width: 'full',
      alignment: 'center',
    },
  });

  // Debug logging
  console.log('EditableFormBuilder rendered:', {
    fieldsCount: fields.length,
    containersCount: containers.length,
    viewMode,
    inspectorMode
  });

  const addField = useCallback((type: FormFieldType, containerId?: string, column?: 'left' | 'right') => {
    const newField: FormFieldData = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'separator' ? '' : `Enter ${type}...`,
      required: false,
      validation: {},
      style: {
        labelColor: 'text-gray-700',
        labelWeight: 'font-medium',
        inputBorderColor: 'border-gray-300',
        inputBorderRadius: 'rounded-md',
        inputBackgroundColor: 'bg-white',
      },
      ...(type === 'dropdown' || type === 'radio' ? {
        options: [
          { id: '1', label: 'Option 1', value: 'option1' },
          { id: '2', label: 'Option 2', value: 'option2' },
        ] as FieldOption[]
      } : {}),
      ...(type === 'date' ? {
        dateFormat: 'MM/DD/YYYY' as const,
        validation: {
          dateFormat: 'MM/DD/YYYY' as const
        }
      } : {}),
    } as FormFieldData;

    setFields(prev => [...prev, newField]);

    // Add to container if specified
    if (containerId) {
      setContainers(prev => prev.map(container => {
        if (container.id === containerId) {
          if (container.type === 'two-column' && column) {
            return {
              ...container,
              [column === 'left' ? 'leftFields' : 'rightFields']: [
                ...container[column === 'left' ? 'leftFields' : 'rightFields'],
                newField.id
              ]
            };
          } else {
            return {
              ...container,
              leftFields: [...container.leftFields, newField.id]
            };
          }
        }
        return container;
      }));
    }

    setSelectedField(newField);
    setInspectorMode('field');
  }, []);

  const addContainer = useCallback((type: 'single' | 'two-column') => {
    const newContainer: LayoutContainer = {
      id: `container_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      leftFields: [],
      rightFields: [],
    };
    setContainers(prev => [...prev, newContainer]);
    setSelectedContainer(newContainer.id);
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
    
    // Remove from containers
    setContainers(prev => prev.map(container => ({
      ...container,
      leftFields: container.leftFields.filter(id => id !== fieldId),
      rightFields: container.rightFields.filter(id => id !== fieldId),
    })));

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

    // Also update container field orders
    setContainers(prev => prev.map(container => {
      const moveInArray = (arr: string[]) => {
        const index = arr.findIndex(id => id === fieldId);
        if (index === -1) return arr;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= arr.length) return arr;
        
        const newArr = [...arr];
        [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
        return newArr;
      };

      return {
        ...container,
        leftFields: moveInArray(container.leftFields),
        rightFields: moveInArray(container.rightFields),
      };
    }));
  }, []);

  const deleteContainer = useCallback((containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    if (container) {
      // Fields remain in the fields array, just not in any container
      console.log('Removing container:', containerId);
    }
    
    setContainers(prev => prev.filter(c => c.id !== containerId));
    setSelectedContainer(null);
  }, [containers]);

  const moveFieldToContainer = useCallback((fieldId: string, containerId: string, column?: 'left' | 'right') => {
    console.log('Moving field', fieldId, 'to container', containerId, 'column', column);
    
    // Remove field from all containers first
    setContainers(prev => prev.map(container => ({
      ...container,
      leftFields: container.leftFields.filter(id => id !== fieldId),
      rightFields: container.rightFields.filter(id => id !== fieldId),
    })));

    // Add to target container
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        if (container.type === 'two-column' && column) {
          const targetField = column === 'left' ? 'leftFields' : 'rightFields';
          return {
            ...container,
            [targetField]: [...container[targetField], fieldId]
          };
        } else {
          return {
            ...container,
            leftFields: [...container.leftFields, fieldId]
          };
        }
      }
      return container;
    }));
  }, []);

  const getFieldsInContainer = useCallback((containerId: string, column?: 'left' | 'right') => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return [];
    
    const fieldIds = column ? container[`${column}Fields` as keyof LayoutContainer] as string[] : container.leftFields;
    return fields.filter(field => fieldIds.includes(field.id));
  }, [containers, fields]);

  const getStandaloneFields = useCallback(() => {
    const containerFieldIds = containers.flatMap(c => [...c.leftFields, ...c.rightFields]);
    return fields.filter(field => !containerFieldIds.includes(field.id));
  }, [containers, fields]);

  const handleExportSchema = useCallback(() => {
    // Convert all Tailwind classes to CSS for export
    const fieldsWithCSS = fields.map(field => ({
      ...field,
      style: convertFieldStyleToCSS(field.style),
    }));

    const designWithCSS = convertFormDesignToCSS(formDesign);

    const schema: FormSchema = {
      id: `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields: fieldsWithCSS,
      layout: { type: 'single' },
      containers: containers.map(c => ({
        id: c.id,
        type: c.type === 'single' ? 'single-column' : 'two-column',
        fields: c.leftFields,
        leftFields: c.leftFields,
        rightFields: c.rightFields,
      })),
      design: designWithCSS,
    };
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(schema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `form_${formTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('Form Schema with CSS:', schema);
    alert('Form schema exported with exact CSS properties!');
  }, [fields, containers, formTitle, formDescription, formDesign]);

  const renderField = (field: FormFieldData, isInContainer = false) => {
    const isSelected = selectedField?.id === field.id;

    return (
      <div
        className={`border rounded-lg p-3 mb-2 cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-blue-400 hover:shadow-sm'
        } ${isInContainer ? 'bg-white' : ''}`}
        onClick={() => {
          setSelectedField(field);
          setInspectorMode('field');
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {field.type.toUpperCase()}
          </span>
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
              className="text-red-400 hover:text-red-600 text-sm p-1"
              title="Delete Field"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="font-medium text-sm text-gray-900">{field.label}</div>
          {field.placeholder && (
            <div className="text-xs text-gray-500">{field.placeholder}</div>
          )}
        </div>
      </div>
    );
  };

  const renderContainer = (container: LayoutContainer) => {
    const isSelected = selectedContainer === container.id;

    return (
      <div
        key={container.id}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={() => setSelectedContainer(container.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded font-medium">
            {container.type === 'single' ? 'SINGLE COLUMN' : 'TWO COLUMN'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteContainer(container.id);
            }}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>

        {container.type === 'two-column' ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div
              className="border border-dashed border-gray-200 rounded p-3 min-h-[120px] bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const data = e.dataTransfer.getData('text/plain');
                console.log('Drop in left column:', data);
                if (data.startsWith('new:')) {
                  const fieldType = data.replace('new:', '') as FormFieldType;
                  addField(fieldType, container.id, 'left');
                } else if (data) {
                  moveFieldToContainer(data, container.id, 'left');
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
              }}
            >
              <div className="text-xs text-gray-400 mb-2 text-center">Left Column</div>
              {getFieldsInContainer(container.id, 'left').map(field =>
                <div
                  key={field.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', field.id);
                    console.log('Dragging field from left column:', field.id);
                  }}
                >
                  {renderField(field, true)}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addField('text', container.id, 'left');
                }}
                className="w-full text-xs text-gray-500 border border-dashed border-gray-300 rounded p-2 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add Field
              </button>
            </div>

            {/* Right Column */}
            <div
              className="border border-dashed border-gray-200 rounded p-3 min-h-[120px] bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const data = e.dataTransfer.getData('text/plain');
                console.log('Drop in right column:', data);
                if (data.startsWith('new:')) {
                  const fieldType = data.replace('new:', '') as FormFieldType;
                  addField(fieldType, container.id, 'right');
                } else if (data) {
                  moveFieldToContainer(data, container.id, 'right');
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
              }}
            >
              <div className="text-xs text-gray-400 mb-2 text-center">Right Column</div>
              {getFieldsInContainer(container.id, 'right').map(field =>
                <div
                  key={field.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', field.id);
                    console.log('Dragging field from right column:', field.id);
                  }}
                >
                  {renderField(field, true)}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addField('text', container.id, 'right');
                }}
                className="w-full text-xs text-gray-500 border border-dashed border-gray-300 rounded p-2 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add Field
              </button>
            </div>
          </div>
        ) : (
          <div
            className="border border-dashed border-gray-200 rounded p-3 min-h-[120px] bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const data = e.dataTransfer.getData('text/plain');
              console.log('Drop in single column:', data);
              if (data.startsWith('new:')) {
                const fieldType = data.replace('new:', '') as FormFieldType;
                addField(fieldType, container.id);
              } else if (data) {
                moveFieldToContainer(data, container.id);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
            }}
          >
            <div className="text-xs text-gray-400 mb-2 text-center">Single Column</div>
            {getFieldsInContainer(container.id).map(field =>
              <div
                key={field.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', field.id);
                  console.log('Dragging field from single column:', field.id);
                }}
              >
                {renderField(field, true)}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addField('text', container.id);
              }}
              className="w-full text-xs text-gray-500 border border-dashed border-gray-300 rounded p-2 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Field
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar - Field Types */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Form Elements</h3>
        
        {/* Layout Structures */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Layout</h4>
          <div className="space-y-2">
            <button
              onClick={() => addContainer('single')}
              className="w-full flex items-center space-x-2 p-2 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
            >
              <span>📄</span>
              <span>Single Column</span>
            </button>
            <button
              onClick={() => addContainer('two-column')}
              className="w-full flex items-center space-x-2 p-2 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
            >
              <span>📊</span>
              <span>Two Column</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fields</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'text', icon: '📝', label: 'Text' },
              { type: 'longtext', icon: '📄', label: 'Long Text' },
              { type: 'email', icon: '📧', label: 'Email' },
              { type: 'phone', icon: '📱', label: 'Phone' },
              { type: 'number', icon: '🔢', label: 'Number' },
              { type: 'date', icon: '📅', label: 'Date' },
              { type: 'postal', icon: '📮', label: 'Postal Code' },
              { type: 'dropdown', icon: '📋', label: 'Dropdown' },
              { type: 'radio', icon: '⚪', label: 'Radio' },
              { type: 'checkbox', icon: '☑️', label: 'Checkbox' },
              { type: 'file', icon: '📎', label: 'File' },
              { type: 'separator', icon: '➖', label: 'Separator' },
            ].map((field) => (
              <button
                key={field.type}
                draggable
                onClick={() => addField(field.type as FormFieldType)}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', `new:${field.type}`);
                  console.log('Dragging new field type:', field.type);
                }}
                className="flex flex-col items-center p-2 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors text-xs cursor-move"
              >
                <span className="text-lg mb-1">{field.icon}</span>
                <span className="text-gray-700">{field.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Form Builder</h1>
              <p className="text-sm text-gray-500">Drag fields into containers or add them directly</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'builder' ? 'preview' : 'builder')}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {viewMode === 'builder' ? '👁️ Preview' : '✏️ Edit'}
              </button>
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
                onClick={handleExportSchema}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                Export Schema
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'preview' ? (
            <FormPreviewLive
              fields={fields}
              containers={containers}
              formTitle={formTitle}
              formDescription={formDescription}
              formDesign={formDesign}
            />
          ) : (
            <div className="max-w-4xl mx-auto">
            {/* Form Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full mb-2"
                placeholder="Form Title"
              />
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-gray-600 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none"
                placeholder="Form description (optional)"
                rows={2}
              />
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
              {/* Layout Containers */}
              {containers.map(renderContainer)}

              {/* Standalone Fields */}
              <div className="space-y-2">
                {getStandaloneFields().map(field =>
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', field.id);
                      console.log('Dragging standalone field:', field.id);
                    }}
                  >
                    {renderField(field, false)}
                  </div>
                )}
              </div>

              {/* Empty State */}
              {fields.length === 0 && containers.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
                  <p className="text-sm text-gray-500">
                    Add layout containers or form fields from the left sidebar to get started.
                  </p>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Inspector */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        {inspectorMode === 'theme' ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h3>
            <div className="space-y-6">
              {/* Appearance */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Appearance</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                    <input
                      type="text"
                      value={formDesign.backgroundColor || ''}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="e.g., bg-gray-50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                    <select
                      value={formDesign.fontFamily || 'font-sans'}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="font-sans">Sans Serif (Default)</option>
                      <option value="font-serif">Serif</option>
                      <option value="font-mono">Monospace</option>
                      <option value="custom">Custom Font</option>
                    </select>
                  </div>
                  {formDesign.fontFamily === 'custom' && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Custom Font Family</label>
                      <input
                        type="text"
                        value={formDesign.customFontFamily || ''}
                        onChange={(e) => setFormDesign(prev => ({ ...prev, customFontFamily: e.target.value }))}
                        placeholder="e.g., 'Roboto', 'Inter', 'Poppins'"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Make sure the font is loaded via Google Fonts or your CSS
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                    <select
                      value={formDesign.fontSize || 'text-base'}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, fontSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="text-sm">Small</option>
                      <option value="text-base">Medium</option>
                      <option value="text-lg">Large</option>
                      <option value="text-xl">Extra Large</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout & Spacing */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Layout & Spacing</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Width</label>
                    <select
                      value={formDesign.maxWidth || 'max-w-2xl'}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, maxWidth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="max-w-md">Small (448px)</option>
                      <option value="max-w-lg">Medium (512px)</option>
                      <option value="max-w-xl">Large (576px)</option>
                      <option value="max-w-2xl">Extra Large (672px)</option>
                      <option value="max-w-4xl">2X Large (896px)</option>
                      <option value="max-w-full">Full Width</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Container Padding</label>
                    <select
                      value={formDesign.padding || 'p-8'}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, padding: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="p-4">Small</option>
                      <option value="p-6">Medium</option>
                      <option value="p-8">Large</option>
                      <option value="p-12">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Field Spacing (Row Gap)</label>
                    <select
                      value={formDesign.spacing?.rowGap || '1.5rem'}
                      onChange={(e) => setFormDesign(prev => ({ 
                        ...prev, 
                        spacing: { ...prev.spacing, rowGap: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="0.5rem">Tight (8px)</option>
                      <option value="1rem">Normal (16px)</option>
                      <option value="1.5rem">Comfortable (24px)</option>
                      <option value="2rem">Spacious (32px)</option>
                      <option value="3rem">Very Spacious (48px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Column Gap (Two-Column)</label>
                    <select
                      value={formDesign.spacing?.columnGap || '1rem'}
                      onChange={(e) => setFormDesign(prev => ({ 
                        ...prev, 
                        spacing: { ...prev.spacing, columnGap: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="0.5rem">Tight (8px)</option>
                      <option value="1rem">Normal (16px)</option>
                      <option value="1.5rem">Comfortable (24px)</option>
                      <option value="2rem">Spacious (32px)</option>
                      <option value="3rem">Very Spacious (48px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Submit Button</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formDesign.submitButton?.text || 'Submit Form'}
                      onChange={(e) => setFormDesign(prev => ({ 
                        ...prev, 
                        submitButton: { ...prev.submitButton, text: e.target.value }
                      }))}
                      placeholder="Submit Form"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                      <input
                        type="text"
                        value={formDesign.submitButton?.backgroundColor || ''}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, backgroundColor: e.target.value }
                        }))}
                        placeholder="bg-blue-600"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                      <input
                        type="text"
                        value={formDesign.submitButton?.textColor || ''}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, textColor: e.target.value }
                        }))}
                        placeholder="text-white"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                      <select
                        value={formDesign.submitButton?.borderRadius || 'rounded-md'}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, borderRadius: e.target.value }
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="rounded-none">None</option>
                        <option value="rounded-sm">Small</option>
                        <option value="rounded-md">Medium</option>
                        <option value="rounded-lg">Large</option>
                        <option value="rounded-xl">Extra Large</option>
                        <option value="rounded-full">Full</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Padding</label>
                      <select
                        value={formDesign.submitButton?.padding || 'py-3 px-4'}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, padding: e.target.value }
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="py-2 px-3">Small</option>
                        <option value="py-3 px-4">Medium</option>
                        <option value="py-4 px-6">Large</option>
                        <option value="py-5 px-8">Extra Large</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                      <select
                        value={formDesign.submitButton?.fontSize || 'text-base'}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, fontSize: e.target.value }
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="text-sm">Small</option>
                        <option value="text-base">Medium</option>
                        <option value="text-lg">Large</option>
                        <option value="text-xl">Extra Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
                      <select
                        value={formDesign.submitButton?.fontWeight || 'font-medium'}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, fontWeight: e.target.value }
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="font-normal">Normal</option>
                        <option value="font-medium">Medium</option>
                        <option value="font-semibold">Semibold</option>
                        <option value="font-bold">Bold</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Width</label>
                      <select
                        value={formDesign.submitButton?.width || 'full'}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, width: e.target.value as 'full' | 'auto' }
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="full">Full Width</option>
                        <option value="auto">Auto Width</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alignment</label>
                      <select
                        value={formDesign.submitButton?.alignment || 'center'}
                        onChange={(e) => setFormDesign(prev => ({ 
                          ...prev, 
                          submitButton: { ...prev.submitButton, alignment: e.target.value as 'left' | 'center' | 'right' }
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branding */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Branding</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Logo URL</label>
                    <input
                      type="url"
                      value={formDesign.logoUrl || ''}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                    <select
                      value={formDesign.borderRadius || 'rounded-lg'}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, borderRadius: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="rounded-none">None</option>
                      <option value="rounded-sm">Small</option>
                      <option value="rounded-md">Medium</option>
                      <option value="rounded-lg">Large</option>
                      <option value="rounded-xl">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Shadow</label>
                    <select
                      value={formDesign.boxShadow || 'shadow-sm'}
                      onChange={(e) => setFormDesign(prev => ({ ...prev, boxShadow: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="shadow-none">None</option>
                      <option value="shadow-sm">Small</option>
                      <option value="shadow-md">Medium</option>
                      <option value="shadow-lg">Large</option>
                      <option value="shadow-xl">Extra Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedField ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Field Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {selectedField.type !== 'separator' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={selectedField.description || ''}
                  onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {selectedField.type !== 'separator' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={selectedField.required || false}
                    onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                    Required field
                  </label>
                </div>
              )}

              {/* Validation Settings */}
              {selectedField.type !== 'separator' && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Validation</h4>
                  <div className="space-y-3">
                    {/* Text/Email/Phone/Postal validation */}
                    {['text', 'email', 'phone', 'postal', 'longtext'].includes(selectedField.type) && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Min Length</label>
                            <input
                              type="number"
                              value={selectedField.validation?.minLength || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, minLength: parseInt(e.target.value) || undefined }
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Max Length</label>
                            <input
                              type="number"
                              value={selectedField.validation?.maxLength || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, maxLength: parseInt(e.target.value) || undefined }
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Number validation */}
                    {selectedField.type === 'number' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Min Value</label>
                          <input
                            type="number"
                            value={selectedField.validation?.min || ''}
                            onChange={(e) => updateField(selectedField.id, { 
                              validation: { ...selectedField.validation, min: parseInt(e.target.value) || undefined }
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Max Value</label>
                          <input
                            type="number"
                            value={selectedField.validation?.max || ''}
                            onChange={(e) => updateField(selectedField.id, { 
                              validation: { ...selectedField.validation, max: parseInt(e.target.value) || undefined }
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    )}

                    {/* Postal Code validation */}
                    {(selectedField.type as string) === 'postal' && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Postal Format</label>
                        <select
                          value={selectedField.validation?.postalFormat || 'US'}
                          onChange={(e) => updateField(selectedField.id, { 
                            validation: { ...selectedField.validation, postalFormat: e.target.value as 'US' | 'UK' | 'CA' | 'IN' | 'custom' }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="US">US (12345 or 12345-6789)</option>
                          <option value="UK">UK (SW1A 1AA)</option>
                          <option value="CA">Canada (K1A 0A6)</option>
                          <option value="IN">India (110001)</option>
                          <option value="custom">Custom Pattern</option>
                        </select>
                        {selectedField.validation?.postalFormat === 'custom' && (
                          <div className="mt-2">
                            <label className="block text-xs text-gray-600 mb-1">Custom Pattern (Regex)</label>
                            <input
                              type="text"
                              value={selectedField.validation?.customPattern || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, customPattern: e.target.value }
                              })}
                              placeholder="^[0-9]{5}$"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Date validation */}
                    {selectedField.type === 'date' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Date Format</label>
                          <select
                            value={selectedField.validation?.dateFormat || 'MM/DD/YYYY'}
                            onChange={(e) => updateField(selectedField.id, { 
                              validation: { ...selectedField.validation, dateFormat: e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'custom' }
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY (European Format)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                            <option value="custom">Custom Format</option>
                          </select>
                          {selectedField.validation?.dateFormat === 'custom' && (
                            <div className="mt-2">
                              <label className="block text-xs text-gray-600 mb-1">Custom Date Format</label>
                              <input
                                type="text"
                                value={selectedField.validation?.customDateFormat || ''}
                                onChange={(e) => updateField(selectedField.id, { 
                                  validation: { ...selectedField.validation, customDateFormat: e.target.value }
                                })}
                                placeholder="DD/MM/YYYY, MM-DD-YY, etc."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Use DD for day, MM for month, YYYY for year
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Min Age (years)</label>
                            <input
                              type="number"
                              value={selectedField.validation?.minAge || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, minAge: parseInt(e.target.value) || undefined }
                              })}
                              placeholder="18"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Max Age (years)</label>
                            <input
                              type="number"
                              value={selectedField.validation?.maxAge || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, maxAge: parseInt(e.target.value) || undefined }
                              })}
                              placeholder="65"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Min Date</label>
                            <input
                              type="date"
                              value={selectedField.validation?.minDate || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, minDate: e.target.value }
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Max Date</label>
                            <input
                              type="date"
                              value={selectedField.validation?.maxDate || ''}
                              onChange={(e) => updateField(selectedField.id, { 
                                validation: { ...selectedField.validation, maxDate: e.target.value }
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* File validation */}
                    {selectedField.type === 'file' && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Allowed File Types</label>
                          <input
                            type="text"
                            value={selectedField.validation?.fileTypes?.join(', ') || ''}
                            onChange={(e) => updateField(selectedField.id, { 
                              validation: { ...selectedField.validation, fileTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                            })}
                            placeholder="jpg, png, pdf, doc"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Max File Size (MB)</label>
                          <input
                            type="number"
                            value={selectedField.validation?.maxFileSize || ''}
                            onChange={(e) => updateField(selectedField.id, { 
                              validation: { ...selectedField.validation, maxFileSize: parseInt(e.target.value) || undefined }
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Conditional Logic */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Conditional Logic</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Show this field when</label>
                    <select
                      value={selectedField.conditionalLogic?.dependsOn || ''}
                      onChange={(e) => updateField(selectedField.id, { 
                        conditionalLogic: e.target.value ? { 
                          dependsOn: e.target.value,
                          condition: 'equals' as const,
                          value: ''
                        } : undefined
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="">Always show (no condition)</option>
                      {fields.filter(f => f.id !== selectedField.id && ['checkbox', 'radio', 'dropdown'].includes(f.type)).map(field => (
                        <option key={field.id} value={field.id}>{field.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedField.conditionalLogic?.dependsOn && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Condition</label>
                        <select
                          value={selectedField.conditionalLogic?.condition || 'equals'}
                          onChange={(e) => updateField(selectedField.id, { 
                            conditionalLogic: { 
                              ...selectedField.conditionalLogic!, 
                              condition: e.target.value as 'equals' | 'not_equals' | 'contains' | 'checked' | 'not_checked'
                            }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="checked">Is Checked</option>
                          <option value="not_checked">Is Not Checked</option>
                          <option value="contains">Contains</option>
                        </select>
                      </div>
                      
                      {!['checked', 'not_checked'].includes(selectedField.conditionalLogic?.condition || '') && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Value</label>
                          <input
                            type="text"
                            value={selectedField.conditionalLogic?.value?.toString() || ''}
                            onChange={(e) => updateField(selectedField.id, { 
                              conditionalLogic: { 
                                ...selectedField.conditionalLogic!, 
                                value: e.target.value 
                              }
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Style Settings */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Field Styling</h4>
                <div className="space-y-4">
                  {/* Label Settings */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Label</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Position</label>
                        <select
                          value={selectedField.style?.labelPosition || 'outside'}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, labelPosition: e.target.value as 'outside' | 'inside' | 'hidden' }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="outside">Outside (Above)</option>
                          <option value="inside">Inside (Placeholder)</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color</label>
                        <input
                          type="text"
                          value={selectedField.style?.labelColor || ''}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, labelColor: e.target.value }
                          })}
                          placeholder="e.g., text-blue-600"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight</label>
                        <select
                          value={selectedField.style?.labelWeight || 'font-medium'}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, labelWeight: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="font-normal">Normal</option>
                          <option value="font-medium">Medium</option>
                          <option value="font-semibold">Semibold</option>
                          <option value="font-bold">Bold</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Input Settings */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Input</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                        <select
                          value={selectedField.style?.inputBorderRadius || 'rounded-md'}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, inputBorderRadius: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="rounded-none">None</option>
                          <option value="rounded-sm">Small</option>
                          <option value="rounded-md">Medium</option>
                          <option value="rounded-lg">Large</option>
                          <option value="rounded-xl">Extra Large</option>
                          <option value="rounded-full">Full</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Height</label>
                        <select
                          value={selectedField.style?.inputHeight || ''}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, inputHeight: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="">Default</option>
                          <option value="h-8">Small (32px)</option>
                          <option value="h-10">Medium (40px)</option>
                          <option value="h-12">Large (48px)</option>
                          <option value="h-14">Extra Large (56px)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Padding</label>
                        <select
                          value={selectedField.style?.inputPadding || 'px-3 py-2'}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, inputPadding: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="px-2 py-1">Small</option>
                          <option value="px-3 py-2">Medium</option>
                          <option value="px-4 py-3">Large</option>
                          <option value="px-6 py-4">Extra Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Border Color</label>
                        <input
                          type="text"
                          value={selectedField.style?.inputBorderColor || ''}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, inputBorderColor: e.target.value }
                          })}
                          placeholder="e.g., border-blue-300"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Background</label>
                        <input
                          type="text"
                          value={selectedField.style?.inputBackgroundColor || ''}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, inputBackgroundColor: e.target.value }
                          })}
                          placeholder="e.g., bg-gray-50"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Layout Settings */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Layout</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Width</label>
                        <select
                          value={selectedField.style?.width || 'w-full'}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, width: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="w-full">Full Width</option>
                          <option value="w-1/2">Half Width</option>
                          <option value="w-1/3">One Third</option>
                          <option value="w-2/3">Two Thirds</option>
                          <option value="w-1/4">Quarter Width</option>
                          <option value="w-3/4">Three Quarters</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Bottom Margin</label>
                        <select
                          value={selectedField.style?.marginBottom || 'mb-4'}
                          onChange={(e) => updateField(selectedField.id, { 
                            style: { ...selectedField.style, marginBottom: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="mb-2">Small</option>
                          <option value="mb-4">Medium</option>
                          <option value="mb-6">Large</option>
                          <option value="mb-8">Extra Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Selection</h3>
            <p className="text-sm text-gray-500">
              Select a field or click the Theme button to configure settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
