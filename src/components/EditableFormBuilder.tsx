'use client';

import React, { useState, useCallback, useRef } from 'react';
import { FormFieldData, FormFieldType, FormDesign, FieldOption, LayoutContainer } from '@/types/form';
import { FormPreviewLive } from './FormPreviewLive';
import { ThemeInspector } from './design/ThemeInspector';
import { FieldDesignInspector } from './design/FieldDesignInspector';

type ViewMode = 'builder' | 'preview';
type InspectorMode = 'field' | 'theme';
export function EditableFormBuilder() {
  const idCounterRef = useRef(0);
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [containers, setContainers] = useState<LayoutContainer[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldData | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [inspectorMode, setInspectorMode] = useState<InspectorMode>('field');
  const [formTitle, setFormTitle] = useState('Contact Form');
  const [formDescription, setFormDescription] = useState('Please fill out this form and we\'ll get back to you.');
  const [formDesign, setFormDesign] = useState<FormDesign>({
    backgroundColor: '#ffffff',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    spacing: { 
      container: 'p-8',
      fields: 'space-y-6', 
      columnGap: '1.5rem', 
      rowGap: '1.5rem' 
    },
    logoUrl: '',
    padding: 'p-8',
    maxWidth: 'max-w-4xl',
    borderRadius: 'rounded-lg',
    boxShadow: 'shadow-lg',
    submitButton: {
      text: 'Submit',
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      padding: '14px 32px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'semibold',
      width: 'auto',
      alignment: 'center',
    },
  });

  const addField = useCallback((type: FormFieldType, containerId?: string, column?: 'left' | 'right') => {
    const fieldId = ++idCounterRef.current;
    const newField: FormFieldData = {
      id: `field_${fieldId}`,
      name: `${type}_${fieldId}`, // Generate unique name
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'separator' ? '' : `Enter ${type}...`,
      required: false,
      validation: {},
      width: containerId && containers.find(c => c.id === containerId)?.type === 'two-column' ? 'w-1/2' : 'w-full', // Set width based on container
      style: {
        labelColor: '#111827',
        labelWeight: 'medium',
        inputBorderColor: '#374151',
        inputBorderRadius: '4px',
        inputBackgroundColor: '#ffffff',
        inputBorderWidth: '2px',
        inputPadding: '12px 16px',
        inputHeight: '48px',
        labelFontSize: '16px',
        inputFontSize: '16px',
        marginBottom: '20px',
      },
      ...(type === 'dropdown' || type === 'radio' ? {
        options: [
          { id: '1', label: 'Option 1', value: 'option1' },
          { id: '2', label: 'Option 2', value: 'option2' },
        ] as FieldOption[]
      } : {}),
      ...(type === 'checkbox' ? {
        style: {
          ...{
            labelColor: '#111827',
            labelWeight: 'medium',
            inputBorderColor: '#374151',
            inputBorderRadius: '4px',
            inputBackgroundColor: '#ffffff',
            inputBorderWidth: '2px',
            inputPadding: '12px 16px',
            inputHeight: '48px',
            labelFontSize: '16px',
            inputFontSize: '16px',
            marginBottom: '20px',
          },
          checkboxAlignment: 'left' as const,
          checkboxText: 'Yes', // Better default to avoid duplicate text
        }
      } : {}),
      ...(type === 'date' ? {
        dateFormat: 'MM/DD/YYYY' as const,
        validation: {
          dateFormat: 'MM/DD/YYYY' as const
        }
      } : {}),
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
      ...(type === 'terms' ? {
        mode: 'checkbox',
        content: 'I agree to the Terms & Conditions and Privacy Policy. By checking this box, I acknowledge that I have read and understood the terms.',
        links: [
          { id: 'terms_link', text: 'Terms & Conditions', url: 'https://example.com/terms' },
          { id: 'privacy_link', text: 'Privacy Policy', url: 'https://example.com/privacy' }
        ]
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
                ...(container[column === 'left' ? 'leftFields' : 'rightFields'] || []),
                newField.id
              ]
            };
          } else {
            return {
              ...container,
              leftFields: [...(container.leftFields || []), newField.id]
            };
          }
        }
        return container;
      }));
    }

    setSelectedField(newField);
    setInspectorMode('field');
  }, [containers]);

  const addContainer = useCallback((type: 'single-column' | 'two-column') => {
    const newContainer: LayoutContainer = {
      id: `container_${++idCounterRef.current}`,
      type,
      fields: [],
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
      leftFields: (container.leftFields || []).filter(id => id !== fieldId),
      rightFields: (container.rightFields || []).filter(id => id !== fieldId),
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
        leftFields: moveInArray(container.leftFields || []),
        rightFields: moveInArray(container.rightFields || []),
      };
    }));
  }, []);

  const deleteContainer = useCallback((containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    if (container) {
      // Update width of fields that were in this container back to full width
      const allFieldIds = [...(container.leftFields || []), ...(container.rightFields || [])];
      setFields(prev => prev.map(field => 
        allFieldIds.includes(field.id) ? { ...field, width: 'w-full' } : field
      ));
      console.log('Removing container:', containerId);
    }
    
    setContainers(prev => prev.filter(c => c.id !== containerId));
    setSelectedContainer(null);
  }, [containers]);

  const moveFieldToContainer = useCallback((fieldId: string, containerId: string, column?: 'left' | 'right') => {
    console.log('Moving field', fieldId, 'to container', containerId, 'column', column);
    
    // Find the target container to determine width
    const targetContainer = containers.find(c => c.id === containerId);
    const newWidth = targetContainer?.type === 'two-column' ? 'w-1/2' : 'w-full';
    
    console.log('Container type:', targetContainer?.type, 'New width:', newWidth);
    
    // Update field width based on container type
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, width: newWidth } : field
    ));
    
    // Remove field from all containers first
    setContainers(prev => prev.map(container => ({
      ...container,
      leftFields: (container.leftFields || []).filter(id => id !== fieldId),
      rightFields: (container.rightFields || []).filter(id => id !== fieldId),
    })));

    // Add to target container
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        if (container.type === 'two-column' && column) {
          const targetField = column === 'left' ? 'leftFields' : 'rightFields';
          return {
            ...container,
            [targetField]: [...(container[targetField] || []), fieldId]
          };
        } else {
          return {
            ...container,
            leftFields: [...(container.leftFields || []), fieldId]
          };
        }
      }
      return container;
    }));
  }, [containers]);

  const moveFieldToStandalone = useCallback((fieldId: string) => {
    console.log('Moving field to standalone:', fieldId);
    
    // Update field width to full when moved to standalone
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, width: 'w-full' } : field
    ));
    
    // Remove field from all containers
    setContainers(prev => prev.map(container => ({
      ...container,
      leftFields: (container.leftFields || []).filter(id => id !== fieldId),
      rightFields: (container.rightFields || []).filter(id => id !== fieldId),
    })));
  }, []);

  const moveContainer = useCallback((containerId: string, direction: 'up' | 'down') => {
    setContainers(prev => {
      const index = prev.findIndex(container => container.id === containerId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newContainers = [...prev];
      [newContainers[index], newContainers[newIndex]] = [newContainers[newIndex], newContainers[index]];
      return newContainers;
    });
  }, []);

  const getFieldsInContainer = useCallback((containerId: string, column?: 'left' | 'right') => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return [];
    
    const fieldIds = column ? (container[`${column}Fields` as keyof LayoutContainer] as string[] || []) : (container.leftFields || []);
    return fields.filter(field => fieldIds.includes(field.id));
  }, [containers, fields]);

  const getStandaloneFields = useCallback(() => {
    const containerFieldIds = containers.flatMap(c => [...(c.leftFields || []), ...(c.rightFields || [])]);
    return fields.filter(field => !containerFieldIds.includes(field.id));
  }, [containers, fields]);

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
      ...(field.type === 'date' ? {
        dateFormat: (field as any).dateFormat,
        customDateFormat: (field as any).customDateFormat
      } : {}),
      ...(field.type === 'postal' ? {
        postalFormat: (field as any).postalFormat,
        customPattern: (field as any).customPattern
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
    const exportFileDefaultName = `form_${formTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('Form Schema with CSS:', schema);
    alert('Form schema exported with exact CSS properties!');
  }, [fields, formTitle, formDescription, formDesign]);

  const renderField = (field: FormFieldData, isInContainer = false) => {
    const isSelected = selectedField?.id === field.id;

    return (
      <div
        className={`border rounded-lg p-3 mb-2 cursor-pointer transition-all duration-200 ${
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

  const renderContainer = (container: LayoutContainer, index: number) => {
    const isSelected = selectedContainer === container.id;

    return (
      <div
        key={container.id}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', `container:${container.id}`);
          console.log('Dragging container:', container.id);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const data = e.dataTransfer.getData('text/plain');
          if (data.startsWith('container:')) {
            const draggedContainerId = data.replace('container:', '');
            if (draggedContainerId !== container.id) {
              // Reorder containers
              const draggedIndex = containers.findIndex(c => c.id === draggedContainerId);
              const targetIndex = index;
              if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
                setContainers(prev => {
                  const newContainers = [...prev];
                  const [draggedContainer] = newContainers.splice(draggedIndex, 1);
                  newContainers.splice(targetIndex, 0, draggedContainer);
                  return newContainers;
                });
              }
            }
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-all duration-200 cursor-move ${
          isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-blue-400 hover:shadow-sm'
        }`}
        onClick={() => setSelectedContainer(container.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded font-medium">
              {container.type === 'single-column' ? 'SINGLE COLUMN' : 'TWO COLUMN'}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveContainer(container.id, 'up');
                }}
                className="text-blue-400 hover:text-blue-600 text-sm p-1"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveContainer(container.id, 'down');
                }}
                className="text-blue-400 hover:text-blue-600 text-sm p-1"
                title="Move Down"
              >
                ↓
              </button>
            </div>
          </div>
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
              {/* Drag & drop only - no add field button to avoid text-only limitation */}
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
              {/* Drag & drop only - no add field button to avoid text-only limitation */}
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">Layout Containers</h4>
          <div className="space-y-2">
            <button
              onClick={() => addContainer('two-column')}
              className="w-full flex items-center space-x-2 p-3 border-2 border-blue-300 bg-blue-50 rounded-lg hover:border-blue-400 hover:bg-blue-100 transition-colors text-sm font-medium text-blue-800"
            >
              <span>📊</span>
              <div className="text-left">
                <div>Two Column Layout</div>
                <div className="text-xs text-blue-600">Recommended for professional forms</div>
              </div>
            </button>
            <button
              onClick={() => addContainer('single-column')}
              className="w-full flex items-center space-x-2 p-2 border border-gray-200 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            >
              <span>📄</span>
              <span>Single Column</span>
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
              { type: 'richtext', icon: '✏️', label: 'Rich Text' },
              { type: 'email', icon: '📧', label: 'Email' },
              { type: 'phone', icon: '📱', label: 'Phone' },
              { type: 'number', icon: '🔢', label: 'Number' },
              { type: 'date', icon: '📅', label: 'Date' },
              { type: 'postal', icon: '📮', label: 'Postal Code' },
              { type: 'dropdown', icon: '📋', label: 'Dropdown' },
              { type: 'radio', icon: '⚪', label: 'Radio' },
              { type: 'checkbox', icon: '☑️', label: 'Checkbox' },
              { type: 'terms', icon: '📋', label: 'Terms & Conditions' },
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
                💾 Export
              </button>
            </div>
          </div>
        </div>
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
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]"
              onDrop={(e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('text/plain');
                console.log('Drop in main area:', data);
                if (data && !data.startsWith('new:') && !data.startsWith('container:')) {
                  // Move field to standalone
                  moveFieldToStandalone(data);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              {/* Layout Containers */}
              {containers.map((container, index) => renderContainer(container, index))}

              {/* Standalone Fields */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-2">Standalone Fields</div>
                {getStandaloneFields().map(field =>
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', field.id);
                      console.log('Dragging standalone field:', field.id);
                    }}
                    className="transition-all duration-200 hover:shadow-sm hover:z-10"
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
          <ThemeInspector 
            design={formDesign} 
            onUpdateDesign={(updates) => setFormDesign(prev => ({ ...prev, ...updates }))} 
          />
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
    </div>
  );
}
