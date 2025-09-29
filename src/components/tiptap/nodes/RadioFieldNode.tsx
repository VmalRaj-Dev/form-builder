import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { createBaseFormFieldNode } from './BaseFormFieldNode';
import { BaseFormFieldNodeView, FormFieldNodeViewProps } from './BaseFormFieldNodeView';
import { RadioFieldData } from '@/types/form';

function RadioFieldNodeView(props: NodeViewProps) {
  return (
    <BaseFormFieldNodeView {...props}>
      <RadioFieldComponent />
    </BaseFormFieldNodeView>
  );
}

function RadioFieldComponent({ fieldData, isSelected }: FormFieldNodeViewProps) {
  const data = fieldData as RadioFieldData;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {data.label}
          {data.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isSelected && (
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Radio Field
          </div>
        )}
      </div>
      
      {data.description && (
        <p className="text-sm text-gray-500">{data.description}</p>
      )}
      
      <div className="space-y-2">
        {data.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <input
              type="radio"
              name={`radio-${data.id}`}
              value={option.value}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
              disabled
            />
            <label className="text-sm text-gray-700">{option.label}</label>
          </div>
        ))}
      </div>
      
      {data.validation?.message && (
        <p className="text-xs text-gray-400">Validation: {data.validation.message}</p>
      )}
    </div>
  );
}

export const RadioFieldNode = createBaseFormFieldNode(
  'radioField',
  'radio',
  RadioFieldNodeView,
  {
    label: 'Radio Field',
    options: [
      { id: '1', label: 'Option 1', value: 'option1' },
      { id: '2', label: 'Option 2', value: 'option2' },
      { id: '3', label: 'Option 3', value: 'option3' },
    ],
  }
);
