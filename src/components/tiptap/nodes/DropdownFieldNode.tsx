import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { createBaseFormFieldNode } from './BaseFormFieldNode';
import { BaseFormFieldNodeView, FormFieldNodeViewProps } from './BaseFormFieldNodeView';
import { DropdownFieldData } from '@/types/form';

function DropdownFieldNodeView(props: NodeViewProps) {
  return (
    <BaseFormFieldNodeView {...props}>
      <DropdownFieldComponent />
    </BaseFormFieldNodeView>
  );
}

function DropdownFieldComponent({ fieldData, isSelected }: FormFieldNodeViewProps) {
  const data = fieldData as DropdownFieldData;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {data.label}
          {data.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isSelected && (
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Dropdown Field
          </div>
        )}
      </div>
      
      {data.description && (
        <p className="text-sm text-gray-500">{data.description}</p>
      )}
      
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled
      >
        <option value="">{data.placeholder || 'Select an option...'}</option>
        {data.options?.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {data.options && data.options.length > 0 && (
        <div className="text-xs text-gray-500">
          Options: {data.options.map(opt => opt.label).join(', ')}
        </div>
      )}
      
      {data.validation?.message && (
        <p className="text-xs text-gray-400">Validation: {data.validation.message}</p>
      )}
    </div>
  );
}

export const DropdownFieldNode = createBaseFormFieldNode(
  'dropdownField',
  'dropdown',
  DropdownFieldNodeView,
  {
    label: 'Dropdown Field',
    placeholder: 'Select an option...',
    options: [
      { id: '1', label: 'Option 1', value: 'option1' },
      { id: '2', label: 'Option 2', value: 'option2' },
      { id: '3', label: 'Option 3', value: 'option3' },
    ],
  }
);
