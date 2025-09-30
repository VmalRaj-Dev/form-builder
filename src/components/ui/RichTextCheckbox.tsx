'use client';

import React from 'react';

interface RichTextCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  richTextContent?: string;
  linkText?: string;
  linkUrl?: string;
  useRichText?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export function RichTextCheckbox({
  id,
  checked,
  onChange,
  label,
  description,
  richTextContent,
  linkText,
  linkUrl,
  useRichText = false,
  required = false,
  error,
  className = ''
}: RichTextCheckboxProps) {
  const renderContent = () => {
    if (useRichText && richTextContent) {
      return (
        <div 
          className="text-sm text-gray-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: richTextContent }}
        />
      );
    }

    // Fallback to simple text with optional link
    return (
      <div className="text-sm text-gray-700">
        <span>{label}</span>
        {linkText && linkUrl && (
          <>
            {' '}
            <a 
              href={linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {linkText}
            </a>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1">
          <label htmlFor={id} className="cursor-pointer">
            {!useRichText && (
              <span className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            )}
            <div className="mt-1">
              {renderContent()}
            </div>
            {description && !useRichText && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
