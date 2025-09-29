import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { createBaseFormFieldNode } from './BaseFormFieldNode';
import { BaseFormFieldNodeView, FormFieldNodeViewProps } from './BaseFormFieldNodeView';
import { CheckboxFieldData } from '@/types/form';

function CheckboxFieldNodeView(props: NodeViewProps) {
  return (
    <BaseFormFieldNodeView {...props}>
      <CheckboxFieldComponent />
    </BaseFormFieldNodeView>
  );
}

function CheckboxFieldComponent({ fieldData, isSelected }: FormFieldNodeViewProps) {
  const data = fieldData as CheckboxFieldData;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {isSelected && (
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Checkbox Field
          </div>
        )}
      </div>
      
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          disabled
        />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            {data.label}
            {data.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {data.description && (
            <p className="text-sm text-gray-500 mt-1">{data.description}</p>
          )}
        </div>
      </div>
      
      {data.validation?.message && (
        <p className="text-xs text-gray-400">Validation: {data.validation.message}</p>
      )}
    </div>
  );
}

export const CheckboxFieldNode = createBaseFormFieldNode(
  'checkboxField',
  'checkbox',
  CheckboxFieldNodeView,
  {
    label: 'I agree to the terms and conditions',
  }
);
