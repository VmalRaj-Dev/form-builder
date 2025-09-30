'use client';

import React, { useMemo } from 'react';

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
  content = '',
  links = [],
  checked = false,
  onChange,
  name,
  value,
  required = false,
  error,
  className = ''
}: TermsAndConditionsProps) {
  
  // Function to replace link placeholders with actual links
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    let processedText = content;
    
    // Sort links by text length (longest first) to avoid partial replacements
    const sortedLinks = [...links].sort((a, b) => b.text.length - a.text.length);
    
    // Replace each link placeholder with actual HTML link
    sortedLinks.forEach(link => {
      if (link.text && link.url) {
        // Escape special regex characters in the link text
        const escapedText = link.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedText}\\b`, 'gi');
        const linkHtml = `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">${link.text}</a>`;
        processedText = processedText.replace(regex, linkHtml);
      }
    });
    
    return processedText;
  }, [content, links]);

  const renderInput = () => {
    if (mode === 'checkbox') {
      return (
        <input
          type="checkbox"
          id={id}
          name={name || id}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          required={required}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0 cursor-pointer"
        />
      );
    }
    
    if (mode === 'radio') {
      return (
        <input
          type="radio"
          id={id}
          name={name || id}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          required={required}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0 cursor-pointer"
        />
      );
    }
    
    return null; // No input for text mode
  };

  // Text-only mode
  if (mode === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div 
          className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 border border-gray-200 rounded-lg"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  // Checkbox/Radio modes
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        {renderInput()}
        <div className="flex-1">
          <label htmlFor={id} className="cursor-pointer block">
            <div 
              className="text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            {required && (
              <span className="text-red-500 ml-1 font-medium">*</span>
            )}
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-2 px-3">{error}</p>}
    </div>
  );
}
