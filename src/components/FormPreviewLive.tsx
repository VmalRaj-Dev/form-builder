'use client';

import React, { useState, useEffect } from 'react';
import { FormFieldData, FormDesign, FieldOption } from '@/types/form';
import { tailwindToCSS } from '@/utils/tailwindToCss';
import { formatDateValue, parseDateValue, getDatePlaceholder } from '@/utils/dateFormatting';
import { loadCustomFonts } from '@/utils/fontLoader';
import { 
  fieldContainerToCSS, 
  fieldLabelToCSS, 
  fieldInputToCSS, 
  generateInputFocusCSS,
  mergeFieldStyles,
  parsePadding
} from '@/utils/fieldStyleUtils';
import { validateField, validateForm } from '@/utils/fieldValidation';
import { DatePicker } from '@/components/ui/DatePicker';

interface LayoutContainer {
  id: string;
  type: 'single' | 'two-column';
  leftFields: string[];
  rightFields: string[];
}

interface FormPreviewLiveProps {
  fields: FormFieldData[];
  containers: LayoutContainer[];
  formTitle: string;
  formDescription: string;
  formDesign: FormDesign;
}

export function FormPreviewLive({ 
  fields, 
  containers, 
  formTitle, 
  formDescription, 
  formDesign 
}: FormPreviewLiveProps) {
  const [formData, setFormData] = useState<Record<string, string | boolean | File | null>>({});

  // Load custom fonts when they change
  useEffect(() => {
    if (formDesign.customFonts && formDesign.customFonts.length > 0) {
      loadCustomFonts(formDesign.customFonts).catch(error => {
        console.error('Failed to load custom fonts:', error);
      });
    }
  }, [formDesign.customFonts]);

  // Generate focus styles for all fields (moved here to avoid conditional hooks)
  useEffect(() => {
    fields.forEach(field => {
      const fieldStyle = mergeFieldStyles({}, field.style || {});
      const focusCSS = generateInputFocusCSS(field.id, fieldStyle);
      const styleId = `field-focus-${field.id}`;
      
      // Remove existing style if it exists
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add new style
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = focusCSS;
      document.head.appendChild(styleElement);
    });
    
    // Cleanup function
    return () => {
      fields.forEach(field => {
        const styleId = `field-focus-${field.id}`;
        const style = document.getElementById(styleId);
        if (style) {
          style.remove();
        }
      });
    };
  }, [fields]);

  // Generate dropdown option styles for all dropdown fields (moved here to avoid conditional hooks)
  useEffect(() => {
    fields.forEach(field => {
      if (field.type === 'dropdown') {
        const fieldStyle = mergeFieldStyles({}, field.style || {});
        const dropdownId = `dropdown-${field.id}`;
        const styleId = `dropdown-styles-${field.id}`;
        
        // Remove existing style if it exists
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = styleId;
        
        const optionStyles = `
          #${dropdownId} option {
            background-color: ${fieldStyle.inputBackgroundColor || '#ffffff'} !important;
            color: ${fieldStyle.dropdownOptionTextColor || '#374151'} !important;
            padding: ${fieldStyle.dropdownOptionPadding || '8px 12px'} !important;
          }
          
          #${dropdownId} option:hover {
            background-color: ${fieldStyle.dropdownHoverColor || '#f3f4f6'} !important;
          }
          
          #${dropdownId} option:checked,
          #${dropdownId} option:focus {
            background-color: ${fieldStyle.dropdownSelectedColor || '#dbeafe'} !important;
            color: ${fieldStyle.dropdownOptionTextColor || '#374151'} !important;
          }
        `;
        
        style.textContent = optionStyles;
        document.head.appendChild(style);
      }
    });
    
    // Cleanup function
    return () => {
      fields.forEach(field => {
        if (field.type === 'dropdown') {
          const styleId = `dropdown-styles-${field.id}`;
          const style = document.getElementById(styleId);
          if (style) {
            style.remove();
          }
        }
      });
    };
  }, [fields]);

  // Debug logging
  console.log('FormPreviewLive rendered:', {
    fieldsCount: fields.length,
    containersCount: containers.length,
    formTitle,
    formDesign
  });

  const handleInputChange = (fieldId: string, value: string | boolean | File | null, field?: FormFieldData) => {
    // Handle date formatting
    if (field?.type === 'date' && typeof value === 'string' && value) {
      const dateFormat = field.validation?.dateFormat || 'YYYY-MM-DD';
      if (dateFormat !== 'YYYY-MM-DD') {
        // Store the formatted value for display
        const formattedValue = formatDateValue(value, dateFormat, field.validation?.customDateFormat);
        setFormData(prev => ({ 
          ...prev, 
          [fieldId]: value, // Store ISO format for validation
          [`${fieldId}_display`]: formattedValue // Store formatted for display
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Conditional logic evaluation
  const isFieldVisible = (field: FormFieldData): boolean => {
    if (!field.conditionalLogic) return true;
    
    const { dependsOn, condition, value: conditionValue } = field.conditionalLogic;
    const dependentFieldValue = formData[dependsOn];
    
    switch (condition) {
      case 'equals':
        return dependentFieldValue === conditionValue;
      case 'not_equals':
        return dependentFieldValue !== conditionValue;
      case 'checked':
        return dependentFieldValue === true;
      case 'not_checked':
        return dependentFieldValue !== true;
      case 'contains':
        return typeof dependentFieldValue === 'string' && 
               typeof conditionValue === 'string' && 
               dependentFieldValue.includes(conditionValue);
      default:
        return true;
    }
  };

  // Postal code validation patterns
  const getPostalPattern = (format: string): string => {
    switch (format) {
      case 'US': return '^[0-9]{5}(-[0-9]{4})?$';
      case 'UK': return '^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$';
      case 'IN': return '^[0-9]{6}$';
      default: return '';
    }
  };

  // Note: Using comprehensive validation from fieldValidation.ts

  const getFieldsInContainer = (containerId: string, column?: 'left' | 'right') => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return [];
    
    const fieldIds = column ? container[`${column}Fields` as keyof LayoutContainer] as string[] : container.leftFields;
    return fields.filter(field => fieldIds.includes(field.id));
  };

  const getStandaloneFields = () => {
    const containerFieldIds = containers.flatMap(c => [...c.leftFields, ...c.rightFields]);
    return fields.filter(field => !containerFieldIds.includes(field.id));
  };

  const renderField = (field: FormFieldData) => {
    // Check conditional logic
    if (!isFieldVisible(field)) return null;

    const value = formData[field.id] || '';
    const fieldStyle = mergeFieldStyles({}, field.style || {});
    const labelPosition = fieldStyle.labelPosition || 'outside';
    const error = validateField(field, value);

    // Generate CSS styles using our utility functions
    const containerStyle = { ...fieldContainerToCSS(fieldStyle), ...globalStyle };
    const labelStyle = { ...fieldLabelToCSS(fieldStyle), ...globalStyle };
    const inputStyle = { ...fieldInputToCSS(fieldStyle), ...globalStyle };
    
    // Generate unique class name for focus styles
    const inputClassName = `field-input-${field.id}`;

    if (field.type === 'separator') {
      return (
        <div key={field.id} style={containerStyle}>
          <div className="my-6">
            {field.label && field.label !== 'Separator' && (
              <h3 className="text-lg font-medium text-gray-900 mb-2">{field.label}</h3>
            )}
            {field.description && (
              <p className="text-sm text-gray-600 mb-3">{field.description}</p>
            )}
            <hr className="border-gray-300" />
          </div>
        </div>
      );
    }

    const renderLabel = () => {
      if (labelPosition === 'hidden' || !field.label || field.label.trim() === '') return null;
      return (
        <label style={labelStyle}>
          {field.label}
          {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      );
    };

    const renderInput = () => {
      let placeholder = labelPosition === 'inside' ? field.label : field.placeholder;
      
      // If no label is present but field is required, add asterisk to placeholder
      if ((!field.label || field.label.trim() === '') && field.required && placeholder) {
        placeholder = `${placeholder} *`;
      }
      
      // If no label and no placeholder but field is required, show generic required placeholder
      if ((!field.label || field.label.trim() === '') && (!placeholder || placeholder.trim() === '') && field.required) {
        placeholder = 'Required *';
      }

      switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
          return (
            <div className="relative">
              {fieldStyle.icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">{fieldStyle.icon}</span>
                </div>
              )}
              <input
                type={field.type === 'phone' ? 'tel' : field.type}
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                placeholder={placeholder}
                className={inputClassName}
                style={{
                  ...inputStyle,
                  ...(fieldStyle.icon && { paddingLeft: '40px' }),
                  ...(error && { borderColor: '#ef4444' }),
                }}
              />
            </div>
          );

        case 'longtext':
          return (
            <textarea
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleInputChange(field.id, e.target.value, field)}
              placeholder={placeholder}
              rows={field.rows || 4}
              className={inputClassName}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          );

        case 'number':
          return (
            <input
              type="number"
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleInputChange(field.id, e.target.value, field)}
              placeholder={placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className={inputClassName}
              style={inputStyle}
            />
          );

        case 'date':
          return (
            <DatePicker
              value={typeof value === 'string' ? value : ''}
              onChange={(dateValue) => handleInputChange(field.id, dateValue, field)}
              validation={field.validation}
              placeholder={placeholder}
              className={inputClassName}
              style={inputStyle}
              icon={fieldStyle.icon}
            />
          );

        case 'dropdown':
          // Generate unique ID for this dropdown's styles
          const dropdownId = `dropdown-${field.id}`;
          
          return (
            <select
              id={dropdownId}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleInputChange(field.id, e.target.value, field)}
              className={inputClassName}
              style={{
                ...inputStyle,
                maxHeight: fieldStyle.dropdownMaxHeight || '200px',
                borderColor: fieldStyle.dropdownBorderColor || inputStyle.borderColor,
                boxShadow: fieldStyle.dropdownShadow ? `var(--tw-${fieldStyle.dropdownShadow})` : inputStyle.boxShadow
              }}
            >
              <option value="">
                {placeholder || (field.required ? 'Select an option... *' : 'Select an option...')}
              </option>
              {field.options?.map((option: FieldOption) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'radio':
          const radioStyle = fieldStyle.checkboxStyle || 'default'; // Reuse checkbox style setting
          
          if (radioStyle === 'bordered') {
            const borderStyle = {
              borderColor: fieldStyle.checkboxBorderColor || fieldStyle.inputBorderColor || '#d1d5db',
              borderWidth: fieldStyle.checkboxBorderWidth || fieldStyle.inputBorderWidth || '1px',
              borderRadius: fieldStyle.checkboxBorderRadius || fieldStyle.inputBorderRadius || '6px',
              backgroundColor: fieldStyle.checkboxBackgroundColor || fieldStyle.inputBackgroundColor || '#ffffff',
              padding: fieldStyle.checkboxPadding || fieldStyle.inputPadding || '12px 16px',
            };
            
            return (
              <div className="space-y-2">
                {field.options?.map((option: FieldOption) => (
                  <label 
                    key={option.id} 
                    className="flex items-center border cursor-pointer transition-colors"
                    style={{
                      ...borderStyle,
                      backgroundColor: value === option.value 
                        ? fieldStyle.dropdownSelectedColor || borderStyle.backgroundColor
                        : borderStyle.backgroundColor,
                      color: fieldStyle.dropdownOptionTextColor || '#374151',
                      padding: fieldStyle.dropdownOptionPadding || borderStyle.padding
                    }}
                    onMouseEnter={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.backgroundColor = fieldStyle.dropdownHoverColor || '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.backgroundColor = borderStyle.backgroundColor;
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={option.value}
                      checked={value === option.value}
                      onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span 
                      className="ml-3 text-sm" 
                      style={{
                        ...globalStyle,
                        color: fieldStyle.dropdownOptionTextColor || '#374151'
                      }}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            );
          } else {
            // Default style with enhanced styling options
            return (
              <div className="space-y-2">
                {field.options?.map((option: FieldOption) => (
                  <label 
                    key={option.id} 
                    className="flex items-center cursor-pointer transition-colors rounded"
                    style={{
                      backgroundColor: value === option.value 
                        ? fieldStyle.dropdownSelectedColor || 'transparent'
                        : 'transparent',
                      padding: fieldStyle.dropdownOptionPadding || '8px 12px',
                      color: fieldStyle.dropdownOptionTextColor || '#374151'
                    }}
                    onMouseEnter={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.backgroundColor = fieldStyle.dropdownHoverColor || '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={option.value}
                      checked={value === option.value}
                      onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span 
                      className="ml-2 text-sm" 
                      style={{
                        ...globalStyle,
                        color: fieldStyle.dropdownOptionTextColor || '#374151'
                      }}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            );
          }

        case 'checkbox':
          let checkboxText = fieldStyle.checkboxText || field.label;
          
          // If no label and no custom checkbox text but field is required, add asterisk to checkbox text
          if ((!field.label || field.label.trim() === '') && (!fieldStyle.checkboxText || fieldStyle.checkboxText.trim() === '') && field.required) {
            checkboxText = 'Required *';
          } else if ((!field.label || field.label.trim() === '') && fieldStyle.checkboxText && field.required && !fieldStyle.checkboxText.includes('*')) {
            checkboxText = `${fieldStyle.checkboxText} *`;
          }
          
          const checkboxAlignment = fieldStyle.checkboxAlignment || 'left';
          const checkboxStyle = fieldStyle.checkboxStyle || 'default';
          
          if (checkboxStyle === 'bordered') {
            const borderStyle = {
              borderColor: fieldStyle.checkboxBorderColor || fieldStyle.inputBorderColor || '#d1d5db',
              borderWidth: fieldStyle.checkboxBorderWidth || fieldStyle.inputBorderWidth || '1px',
              borderRadius: fieldStyle.checkboxBorderRadius || fieldStyle.inputBorderRadius || '6px',
              backgroundColor: fieldStyle.checkboxBackgroundColor || fieldStyle.inputBackgroundColor || '#ffffff',
              padding: fieldStyle.checkboxPadding || fieldStyle.inputPadding || '12px 16px',
            };
            
            return (
              <label 
                className={`flex items-center border cursor-pointer transition-colors hover:bg-gray-50 ${
                  checkboxAlignment === 'right' ? 'flex-row-reverse' : ''
                }`}
                style={borderStyle}
              >
                <input
                  type="checkbox"
                  checked={typeof value === 'boolean' ? value : false}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span 
                  className={`text-sm text-gray-900 ${checkboxAlignment === 'right' ? 'mr-3' : 'ml-3'}`}
                  style={globalStyle}
                >
                  {checkboxText}
                </span>
              </label>
            );
          } else {
            // Default style (existing behavior)
            return (
              <label className={`flex items-center ${checkboxAlignment === 'right' ? 'flex-row-reverse' : ''}`}>
                <input
                  type="checkbox"
                  checked={typeof value === 'boolean' ? value : false}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span 
                  className={`text-sm text-gray-900 ${checkboxAlignment === 'right' ? 'mr-2' : 'ml-2'}`}
                  style={globalStyle}
                >
                  {checkboxText}
                </span>
              </label>
            );
          }

        case 'file':
          const fileName = value instanceof File ? value.name : '';
          const fileDisplayText = fileName || placeholder || 'Choose file...';
          
          return (
            <div className="relative">
              <div 
                className={`${inputClassName} cursor-pointer flex items-center justify-between`}
                style={{
                  ...inputStyle,
                  ...(fieldStyle.icon && { paddingLeft: '40px' }),
                  paddingRight: '40px'
                }}
                onClick={() => {
                  const fileInput = document.getElementById(`file-${field.id}`) as HTMLInputElement;
                  fileInput?.click();
                }}
              >
                {fieldStyle.icon && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm" style={globalStyle}>{fieldStyle.icon}</span>
                  </div>
                )}
                <span 
                  className={fileName ? 'text-gray-900' : 'text-gray-500'}
                  style={{
                    ...globalStyle,
                    fontSize: inputStyle.fontSize,
                    color: fileName ? inputStyle.color : '#9ca3af'
                  }}
                >
                  {fileDisplayText}
                </span>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm" style={globalStyle}>📁</span>
                </div>
              </div>
              <input
                id={`file-${field.id}`}
                type="file"
                onChange={(e) => handleInputChange(field.id, e.target.files?.[0] || null)}
                className="hidden"
                accept={field.validation?.fileTypes ? 
                  field.validation.fileTypes.map((type: string) => `.${type.trim()}`).join(',') : 
                  undefined
                }
              />
            </div>
          );

        default:
          // Handle postal and other field types
          if ((field.type as string) === 'postal') {
            return (
              <div className="relative">
                {fieldStyle.icon && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">{fieldStyle.icon}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                  placeholder={placeholder}
                  className={inputClassName}
                  style={inputStyle}
                />
              </div>
            );
          }
          return null;
      }
    };

    return (
      <div key={field.id} style={containerStyle}>
        {labelPosition === 'outside' && renderLabel()}
        {field.description && labelPosition === 'outside' && (
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', ...globalStyle }}>{field.description}</p>
        )}
        {renderInput()}
        {field.description && labelPosition !== 'outside' && (
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', ...globalStyle }}>{field.description}</p>
        )}
        {error && (
          <p style={{ fontSize: '14px', color: '#dc2626', marginTop: '4px', ...globalStyle }}>{error}</p>
        )}
      </div>
    );
  };

  const renderContainer = (container: LayoutContainer) => {
    const containerStyle = {
      gap: formDesign.spacing?.columnGap || '1rem',
    };

    if (container.type === 'two-column') {
      return (
        <div key={container.id} className="mb-8">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            style={containerStyle}
          >
            <div className="space-y-6">
              {getFieldsInContainer(container.id, 'left').map(renderField)}
            </div>
            <div className="space-y-6">
              {getFieldsInContainer(container.id, 'right').map(renderField)}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={container.id} className="mb-8">
          <div className="space-y-6">
            {getFieldsInContainer(container.id).map(renderField)}
          </div>
        </div>
      );
    }
  };

  // Apply custom font family globally
  const globalStyle = formDesign.fontFamily === 'custom' && formDesign.customFontFamily
    ? { fontFamily: `"${formDesign.customFontFamily}", sans-serif` }
    : {};

  // Apply form design with CSS values
  const isHexColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  
  const formStyle: React.CSSProperties = {
    backgroundColor: isHexColor(formDesign.backgroundColor || '') 
      ? formDesign.backgroundColor 
      : undefined,
    border: '1px solid #e5e7eb',
    borderRadius: formDesign.borderRadius?.includes('px') 
      ? formDesign.borderRadius 
      : undefined,
    boxShadow: formDesign.boxShadow?.includes('shadow') 
      ? undefined 
      : formDesign.boxShadow,
    padding: formDesign.padding?.includes('px') 
      ? formDesign.padding 
      : undefined,
    ...globalStyle,
  };

  const formClasses = [
    // Only add Tailwind classes for non-CSS values
    !isHexColor(formDesign.backgroundColor || '') ? (formDesign.backgroundColor || 'bg-white') : '',
    formDesign.fontFamily !== 'custom' ? (formDesign.fontFamily || 'font-sans') : '',
    formDesign.fontSize || 'text-base',
    !formDesign.padding?.includes('px') ? (formDesign.padding || 'p-8') : '',
    !formDesign.borderRadius?.includes('px') ? (formDesign.borderRadius || 'rounded-lg') : '',
    formDesign.boxShadow?.includes('shadow') ? (formDesign.boxShadow || 'shadow-sm') : '',
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'mx-auto',
    formDesign.maxWidth || 'max-w-2xl',
  ].filter(Boolean).join(' ');

  const fieldsSpacing = {
    gap: formDesign.spacing?.rowGap || '1.5rem',
  };

  // Submit button styling with CSS values
  const submitButton = formDesign.submitButton || {};
  const submitButtonPadding = parsePadding(submitButton.padding || '12px 24px');
  
  const submitButtonStyle: React.CSSProperties = {
    backgroundColor: isHexColor(submitButton.backgroundColor || '') 
      ? submitButton.backgroundColor 
      : undefined,
    color: isHexColor(submitButton.textColor || '') 
      ? submitButton.textColor 
      : undefined,
    paddingTop: submitButton.padding?.includes('px') ? submitButtonPadding.top : undefined,
    paddingRight: submitButton.padding?.includes('px') ? submitButtonPadding.right : undefined,
    paddingBottom: submitButton.padding?.includes('px') ? submitButtonPadding.bottom : undefined,
    paddingLeft: submitButton.padding?.includes('px') ? submitButtonPadding.left : undefined,
    borderRadius: submitButton.borderRadius?.includes('px') 
      ? submitButton.borderRadius 
      : undefined,
    fontSize: submitButton.fontSize?.includes('px') 
      ? submitButton.fontSize 
      : undefined,
    fontWeight: ['normal', 'medium', 'semibold', 'bold'].includes(submitButton.fontWeight || '') 
      ? { normal: '400', medium: '500', semibold: '600', bold: '700' }[submitButton.fontWeight as string]
      : undefined,
    width: submitButton.width === 'full' ? '100%' : 'auto',
    display: submitButton.width === 'auto' ? 'inline-block' : 'block',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease-in-out',
  };

  const submitButtonClasses = [
    // Only add Tailwind classes for non-CSS values
    !isHexColor(submitButton.backgroundColor || '') ? (submitButton.backgroundColor || 'bg-blue-600') : '',
    !isHexColor(submitButton.textColor || '') ? (submitButton.textColor || 'text-white') : '',
    !submitButton.padding?.includes('px') ? (submitButton.padding || 'py-3 px-4') : '',
    !submitButton.borderRadius?.includes('px') ? (submitButton.borderRadius || 'rounded-md') : '',
    !submitButton.fontSize?.includes('px') ? (submitButton.fontSize || 'text-base') : '',
    !['normal', 'medium', 'semibold', 'bold'].includes(submitButton.fontWeight || '') 
      ? (submitButton.fontWeight || 'font-medium') : '',
    'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all',
  ].filter(Boolean).join(' ');

  const submitButtonContainerClasses = [
    'pt-6 border-t border-gray-200',
    submitButton.alignment === 'left' ? 'text-left' :
    submitButton.alignment === 'right' ? 'text-right' : 'text-center',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={globalStyle}>
      <div className={formClasses} style={{ ...formStyle, ...globalStyle }}>
        <div className="mb-8">
          {formDesign.logoUrl && (
            <div className="mb-6">
              <img
                src={formDesign.logoUrl}
                alt="Form logo"
                className="h-16 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center" style={globalStyle}>
            {formTitle}
          </h1>
          {formDescription && (
            <p className="text-gray-600 text-center text-lg mb-8" style={globalStyle}>
              {formDescription}
            </p>
          )}
        </div>

        <form className="space-y-8" style={{ ...fieldsSpacing, ...globalStyle }}>
          {/* Layout Containers */}
          {containers.map(renderContainer)}

          {/* Standalone Fields */}
          <div className="space-y-6">
            {getStandaloneFields().map(renderField)}
          </div>

          <div className={submitButtonContainerClasses}>
            <button
              type="submit"
              className={submitButtonClasses}
              style={{ ...submitButtonStyle, ...globalStyle }}
            >
              {submitButton.text || 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
