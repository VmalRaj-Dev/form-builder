'use client';

import React from 'react';

export interface TermsLink {
  id: string;
  text: string;
  url: string;
}

interface TermsAndConditionsProps {
  id?: string;
  mode: 'checkbox' | 'radio' | 'text';
  content: string;
  links: TermsLink[];
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string; // For radio buttons
  value?: string; // For radio buttons
  required?: boolean;
  error?: string;
  className?: string;
}

export function TermsAndConditions({
  id = 'terms',
  mode,
  content,
  links,
  checked = false,
  onChange,
  name,
  value,
  required = false,
  error,
  className = ''
}: TermsAndConditionsProps) {
  
  // Function to replace link placeholders with actual links
  const renderContentWithLinks = (text: string) => {
    let processedText = text;
    
    // Replace each link placeholder with actual HTML link
    links.forEach(link => {
      const placeholder = link.text;
      const linkHtml = `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${link.text}</a>`;
      processedText = processedText.replace(new RegExp(placeholder, 'g'), linkHtml);
    });
    
    return processedText;
  };

  const processedContent = renderContentWithLinks(content);

  const renderInput = () => {
    if (mode === 'checkbox') {
      return (
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
        />
      );
    }
    
    if (mode === 'radio') {
      return (
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
        />
      );
    }
    
    return null; // No input for text mode
  };

  if (mode === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div 
          className="text-sm text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        {renderInput()}
        <div className="flex-1">
          <label htmlFor={id} className="cursor-pointer">
            <div 
              className="text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            {required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
