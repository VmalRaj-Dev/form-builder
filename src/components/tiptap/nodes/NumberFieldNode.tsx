import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { createBaseFormFieldNode } from './BaseFormFieldNode';
import { BaseFormFieldNodeView, FormFieldNodeViewProps } from './BaseFormFieldNodeView';
import { NumberFieldData } from '@/types/form';

function NumberFieldNodeView(props: NodeViewProps) {
  return (
    <BaseFormFieldNodeView {...props}>
      <NumberFieldComponent />
    </BaseFormFieldNodeView>
  );
}

function NumberFieldComponent({ fieldData, isSelected }: FormFieldNodeViewProps) {
  const data = fieldData as NumberFieldData;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {data.label}
          {data.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isSelected && (
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Number Field
          </div>
        )}
      </div>
      
      {data.description && (
        <p className="text-sm text-gray-500">{data.description}</p>
      )}
      
      <input
        type="number"
        placeholder={data.placeholder || 'Enter number...'}
        min={data.validation?.min}
        max={data.validation?.max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled
      />
      
      {(data.validation?.min !== undefined || data.validation?.max !== undefined) && (
        <p className="text-xs text-gray-400">
          Range: {data.validation?.min ?? '∞'} - {data.validation?.max ?? '∞'}
        </p>
      )}
      
      {data.validation?.message && (
        <p className="text-xs text-gray-400">Validation: {data.validation.message}</p>
      )}
    </div>
  );
}

export const NumberFieldNode = createBaseFormFieldNode(
  'numberField',
  'number',
  NumberFieldNodeView,
  {
    label: 'Number Field',
    placeholder: 'Enter number...',
  }
);
