'use client';

import React, { useState } from 'react';
import { FormFieldData, FormDesign, FieldOption } from '@/types/form';
import { tailwindToCSS } from '@/utils/tailwindToCss';
import { formatDateValue, parseDateValue, getDatePlaceholder } from '@/utils/dateFormatting';

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
      case 'CA': return '^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$';
      case 'IN': return '^[0-9]{6}$';
      default: return '';
    }
  };

  // Enhanced validation
  const validateField = (field: FormFieldData, value: string | boolean | File | null): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (typeof value === 'string' && value) {
      const validation = field.validation;
      if (!validation) return null;

      // Length validation
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`;
      }

      // Postal code validation
      if ((field.type as string) === 'postal' && validation.postalFormat) {
        const pattern = validation.postalFormat === 'custom' 
          ? validation.customPattern 
          : getPostalPattern(validation.postalFormat);
        
        if (pattern && !new RegExp(pattern).test(value)) {
          return `Please enter a valid postal code`;
        }
      }

      // Email validation
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }

      // Phone validation
      if (field.type === 'phone' && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    // Number validation
    if (field.type === 'number' && typeof value === 'string' && value) {
      const numValue = parseFloat(value);
      const validation = field.validation;
      if (validation?.min !== undefined && numValue < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation?.max !== undefined && numValue > validation.max) {
        return `${field.label} must be no more than ${validation.max}`;
      }
    }

    // File validation
    if (field.type === 'file' && value instanceof File) {
      const validation = field.validation;
      if (validation?.maxFileSize && value.size > validation.maxFileSize * 1024 * 1024) {
        return `File size must be less than ${validation.maxFileSize}MB`;
      }
      if (validation?.fileTypes?.length) {
        const fileExt = value.name.split('.').pop()?.toLowerCase();
        if (fileExt && !validation.fileTypes.includes(fileExt)) {
          return `File type must be one of: ${validation.fileTypes.join(', ')}`;
        }
      }
    }

    // Date validation
    if (field.type === 'date' && typeof value === 'string' && value) {
      const validation = field.validation;
      if (!validation) return null;

      const selectedDate = new Date(value);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(selectedDate.getTime())) {
        return 'Please enter a valid date';
      }

      // Min/Max date validation
      if (validation.minDate) {
        const minDate = new Date(validation.minDate);
        if (selectedDate < minDate) {
          return `Date must be on or after ${minDate.toLocaleDateString()}`;
        }
      }
      
      if (validation.maxDate) {
        const maxDate = new Date(validation.maxDate);
        if (selectedDate > maxDate) {
          return `Date must be on or before ${maxDate.toLocaleDateString()}`;
        }
      }

      // Age validation
      if (validation.minAge !== undefined || validation.maxAge !== undefined) {
        const birthDate = selectedDate;
        const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        
        if (validation.minAge !== undefined && age < validation.minAge) {
          return `You must be at least ${validation.minAge} years old`;
        }
        
        if (validation.maxAge !== undefined && age > validation.maxAge) {
          return `You must be no more than ${validation.maxAge} years old`;
        }
      }
    }

    return null;
  };

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
    const fieldStyle = field.style || {};
    const labelPosition = fieldStyle.labelPosition || 'outside';
    const error = validateField(field, value);

    // Build dynamic classes
    const fieldWrapperClasses = [
      'mb-4',
      fieldStyle.marginBottom || '',
      fieldStyle.width || 'w-full',
    ].filter(Boolean).join(' ');

    // Build CSS classes and inline styles
    const labelClasses = [
      'block text-sm mb-1',
      fieldStyle.labelAlignment === 'center' ? 'text-center' :
      fieldStyle.labelAlignment === 'right' ? 'text-right' : 'text-left',
    ].filter(Boolean).join(' ');

    const inputClasses = [
      'w-full border focus:outline-none focus:ring-2 transition-colors',
    ].filter(Boolean).join(' ');

    // Convert Tailwind classes to inline styles for proper application
    const labelStyle = {
      ...tailwindToCSS(fieldStyle.labelColor || 'text-gray-700'),
      ...tailwindToCSS(fieldStyle.labelWeight || 'font-medium'),
      ...tailwindToCSS(fieldStyle.fontSize || 'text-base'),
    };

    const inputStyle = {
      ...tailwindToCSS(fieldStyle.inputBorderColor || 'border-gray-300'),
      ...tailwindToCSS(fieldStyle.inputBorderRadius || 'rounded-md'),
      ...tailwindToCSS(fieldStyle.inputBackgroundColor || 'bg-white'),
      ...tailwindToCSS(fieldStyle.inputPadding || 'px-3 py-2'),
      ...tailwindToCSS(fieldStyle.inputHeight || ''),
      ...tailwindToCSS(fieldStyle.fontSize || 'text-base'),
    };

    if (field.type === 'separator') {
      return (
        <div key={field.id} className={fieldWrapperClasses}>
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
      if (labelPosition === 'hidden') return null;
      return (
        <label className={labelClasses} style={labelStyle}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      );
    };

    const renderInput = () => {
      const placeholder = labelPosition === 'inside' ? field.label : field.placeholder;

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
                className={`${inputClasses} ${fieldStyle.icon ? 'pl-10' : ''} ${error ? 'border-red-300' : ''}`}
                style={inputStyle}
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
              className={`${inputClasses} resize-vertical`}
              style={inputStyle}
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
              className={inputClasses}
              style={inputStyle}
            />
          );

        case 'date':
          const dateFormat = field.validation?.dateFormat || 'YYYY-MM-DD';
          const customDateFormat = field.validation?.customDateFormat;
          const displayValue = formData[`${field.id}_display`] as string || '';
          const actualValue = typeof value === 'string' ? value : '';
          
          if (dateFormat === 'YYYY-MM-DD') {
            // Standard HTML date input
            return (
              <div className="relative">
                {fieldStyle.icon && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">{fieldStyle.icon}</span>
                  </div>
                )}
                <input
                  type="date"
                  value={actualValue}
                  onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                  min={field.validation?.minDate}
                  max={field.validation?.maxDate}
                  className={`${inputClasses} ${fieldStyle.icon ? 'pl-10' : ''} ${error ? 'border-red-300' : ''}`}
                  style={inputStyle}
                />
              </div>
            );
          } else {
            // Custom formatted date input
            return (
              <div className="relative">
                {fieldStyle.icon && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">{fieldStyle.icon}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={displayValue}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isoValue = parseDateValue(inputValue, dateFormat, customDateFormat);
                    setFormData(prev => ({ 
                      ...prev, 
                      [field.id]: isoValue,
                      [`${field.id}_display`]: inputValue
                    }));
                  }}
                  placeholder={getDatePlaceholder(dateFormat, customDateFormat)}
                  className={`${inputClasses} ${fieldStyle.icon ? 'pl-10' : ''} ${error ? 'border-red-300' : ''}`}
                  style={inputStyle}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: {customDateFormat || dateFormat}
                </p>
              </div>
            );
          }

        case 'dropdown':
          return (
            <select
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleInputChange(field.id, e.target.value, field)}
              className={inputClasses}
              style={inputStyle}
            >
              <option value="">{placeholder || 'Select an option...'}</option>
              {field.options?.map((option: FieldOption) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option: FieldOption) => (
                <label key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          );

        case 'checkbox':
          return (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={typeof value === 'boolean' ? value : false}
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">{field.label}</span>
            </label>
          );

        case 'file':
          return (
            <input
              type="file"
              onChange={(e) => handleInputChange(field.id, e.target.files?.[0] || null)}
              className={inputClasses}
              style={inputStyle}
            />
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
                  className={`${inputClasses} ${fieldStyle.icon ? 'pl-10' : ''} ${error ? 'border-red-300' : ''}`}
                  style={inputStyle}
                />
              </div>
            );
          }
          return null;
      }
    };

    return (
      <div key={field.id} className={fieldWrapperClasses}>
        {labelPosition === 'outside' && renderLabel()}
        {field.description && labelPosition === 'outside' && (
          <p className="text-sm text-gray-500 mb-2">{field.description}</p>
        )}
        {renderInput()}
        {field.description && labelPosition !== 'outside' && (
          <p className="text-sm text-gray-500 mt-1">{field.description}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
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
        <div key={container.id} className="mb-6">
          <div 
            className="grid grid-cols-2"
            style={containerStyle}
          >
            <div className="space-y-4">
              {getFieldsInContainer(container.id, 'left').map(renderField)}
            </div>
            <div className="space-y-4">
              {getFieldsInContainer(container.id, 'right').map(renderField)}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={container.id} className="mb-6">
          <div className="space-y-4">
            {getFieldsInContainer(container.id).map(renderField)}
          </div>
        </div>
      );
    }
  };

  // Apply custom font family globally
  const globalStyle = formDesign.fontFamily === 'custom' && formDesign.customFontFamily
    ? { fontFamily: formDesign.customFontFamily }
    : {};

  // Apply form design
  const formClasses = [
    'border border-gray-200',
    formDesign.backgroundColor || 'bg-white',
    formDesign.fontFamily !== 'custom' ? (formDesign.fontFamily || 'font-sans') : '',
    formDesign.fontSize || 'text-base',
    formDesign.padding || 'p-8',
    formDesign.borderRadius || 'rounded-lg',
    formDesign.boxShadow || 'shadow-sm',
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'mx-auto',
    formDesign.maxWidth || 'max-w-2xl',
  ].filter(Boolean).join(' ');

  const fieldsSpacing = {
    gap: formDesign.spacing?.rowGap || '1.5rem',
  };

  // Submit button styling
  const submitButton = formDesign.submitButton || {};
  const submitButtonClasses = [
    submitButton.width === 'auto' ? 'inline-block' : 'w-full',
    submitButton.backgroundColor || 'bg-blue-600',
    submitButton.textColor || 'text-white',
    submitButton.padding || 'py-3 px-4',
    submitButton.borderRadius || 'rounded-md',
    submitButton.fontSize || 'text-base',
    submitButton.fontWeight || 'font-medium',
    'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer',
  ].filter(Boolean).join(' ');

  const submitButtonContainerClasses = [
    'pt-6 border-t border-gray-200',
    submitButton.alignment === 'left' ? 'text-left' :
    submitButton.alignment === 'right' ? 'text-right' : 'text-center',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={globalStyle}>
      <div className={formClasses} style={globalStyle}>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={globalStyle}>
            {formTitle}
          </h1>
          {formDescription && (
            <p className="text-gray-600" style={globalStyle}>
              {formDescription}
            </p>
          )}
        </div>

        <form className="space-y-6" style={{ ...fieldsSpacing, ...globalStyle }}>
          {/* Layout Containers */}
          {containers.map(renderContainer)}

          {/* Standalone Fields */}
          <div className="space-y-4">
            {getStandaloneFields().map(renderField)}
          </div>

          <div className={submitButtonContainerClasses}>
            <button
              type="submit"
              className={submitButtonClasses}
              style={globalStyle}
            >
              {submitButton.text || 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
