'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FormSchema, FormFieldData } from '@/types/form';
import Image from 'next/image';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { RichTextCheckbox } from '@/components/ui/RichTextCheckbox';
import { TermsAndConditions } from '@/components/ui/TermsAndConditions';

interface FormPreviewProps {
  schema: FormSchema;
}

export function FormPreview({ schema }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateField = (field: FormFieldData, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { validation } = field;
      
      if (field.type === 'text' || field.type === 'longtext' || field.type === 'richtext') {
        // For rich text, we need to strip HTML tags to get actual text length
        const textLength = field.type === 'richtext' && value ? 
          value.replace(/<[^>]*>/g, '').trim().length : 
          (value ? value.length : 0);
          
        if (validation.minLength && textLength < validation.minLength) {
          return validation.message || `${field.label} must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && textLength > validation.maxLength) {
          return validation.message || `${field.label} must be no more than ${validation.maxLength} characters`;
        }
      }

      if (field.type === 'number') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (validation.min !== undefined && numValue < validation.min) {
            return validation.message || `${field.label} must be at least ${validation.min}`;
          }
          if (validation.max !== undefined && numValue > validation.max) {
            return validation.message || `${field.label} must be no more than ${validation.max}`;
          }
        }
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return validation.message || 'Please enter a valid email address';
        }
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    schema.fields.forEach(field => {
      if (field.type !== 'separator') {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully!', formData);
      alert('Form submitted successfully! Check the console for form data.');
    }
  };

  const renderField = (field: FormFieldData) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const fieldStyle = field.style || {};

    // Apply dynamic Tailwind classes based on field style
    const labelClasses = [
      'block text-sm font-medium mb-1',
      fieldStyle.labelColor || 'text-gray-700',
      fieldStyle.labelWeight || 'font-medium',
      fieldStyle.labelAlignment === 'center' ? 'text-center' : 
      fieldStyle.labelAlignment === 'right' ? 'text-right' : 'text-left',
    ].join(' ');

    const inputClasses = [
      'w-full px-3 py-2 shadow-sm focus:outline-none focus:ring-2',
      fieldStyle.inputBorderColor || 'border-gray-300',
      fieldStyle.inputBorderRadius || 'rounded-md',
      fieldStyle.inputBackgroundColor || 'bg-white',
      fieldStyle.inputFocusColor || 'focus:ring-blue-500',
      'border',
      error ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500',
    ].join(' ');

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <div className="relative">
              {fieldStyle.icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">
                    {fieldStyle.icon === 'mail' ? '📧' : 
                     fieldStyle.icon === 'phone' ? '📱' : 
                     fieldStyle.icon === 'user' ? '👤' : 
                     fieldStyle.icon === 'lock' ? '🔒' : ''}
                  </span>
                </div>
              )}
              <input
                type={field.type === 'phone' ? 'tel' : field.type}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`${inputClasses} ${fieldStyle.icon ? 'pl-10' : ''}`}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'longtext':
        return (
          <div key={field.id} className="space-y-2">
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={(field as any).rows || 4}
              className={`${inputClasses} resize-vertical`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'richtext':
        return (
          <div key={field.id} className="space-y-2">
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <RichTextEditor
              value={value || ''}
              onChange={(newValue) => handleInputChange(field.id, newValue)}
              placeholder={field.placeholder || 'Start typing...'}
              minHeight={(field as any).minHeight || '120px'}
              maxHeight={(field as any).maxHeight || '400px'}
              toolbar={(field as any).toolbar || 'basic'}
              allowLinks={(field as any).allowLinks !== false}
              allowFormatting={(field as any).allowFormatting !== false}
              error={!!error}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className={inputClasses}
            />
            {(field.validation?.min !== undefined || field.validation?.max !== undefined) && (
              <p className="text-xs text-gray-400">
                Range: {field.validation?.min ?? '∞'} - {field.validation?.max ?? '∞'}
              </p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'dropdown':
        return (
          <div key={field.id} className="space-y-2">
            <label className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <select
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
            >
              <option value="">{field.placeholder || 'Select an option...'}</option>
              {(field as any).options?.map((option: any) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <div className="space-y-2">
              {(field as any).options?.map((option: any) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label className="text-sm text-gray-700">{option.label}</label>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <RichTextCheckbox
            key={field.id}
            id={field.id}
            checked={value || false}
            onChange={(checked) => handleInputChange(field.id, checked)}
            label={field.label}
            description={field.description}
            richTextContent={(field as any).richTextContent}
            linkText={(field as any).linkText}
            linkUrl={(field as any).linkUrl}
            useRichText={(field as any).useRichText || false}
            required={field.required}
            error={error}
          />
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              error ? 'border-red-300' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <input
                type="file"
                onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
                className="hidden"
                id={`file-${field.id}`}
                accept={(field as any).accept}
                multiple={(field as any).multiple}
              />
              <label htmlFor={`file-${field.id}`} className="cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {value ? `Selected: ${(value as File).name}` : 'No file selected'}
                  </p>
                </div>
              </label>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'separator':
        return (
          <div key={field.id} className="space-y-2">
            {field.label && field.label !== 'Separator' && (
              <h3 className="text-lg font-medium text-gray-900">{field.label}</h3>
            )}
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <hr className="border-gray-300" />
          </div>
        );

      case 'terms':
        return (
          <TermsAndConditions
            key={field.id}
            id={field.id}
            mode={(field as any).mode || 'checkbox'}
            content={(field as any).content || ''}
            links={(field as any).links || []}
            checked={value || false}
            onChange={(checked) => handleInputChange(field.id, checked)}
            required={field.required}
            error={error}
          />
        );

      default:
        return null;
    }
  };

  const formClasses = [
    'rounded-lg shadow-sm border border-gray-200 p-8',
    schema.design?.backgroundColor || 'bg-white',
    schema.design?.fontFamily || 'font-sans',
    schema.design?.fontSize || 'text-base',
  ].join(' ');

  const containerClasses = [
    'max-w-2xl mx-auto p-8',
    schema.design?.spacing?.container || 'p-8',
  ].join(' ');

  const fieldsSpacing = schema.design?.spacing?.fields || 'space-y-6';

  return (
    <div className={containerClasses}>
      <div className={formClasses}>
        <div className="mb-8">
          {schema.design?.logoUrl && (
            <div className="mb-6">
              <Image
                src={schema.design.logoUrl}
                alt="Form logo"
                width={200}
                height={64}
                className="h-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{schema.title}</h1>
          {schema.description && (
            <p className="text-gray-600">{schema.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className={fieldsSpacing}>
          {schema.fields.map(renderField)}

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
