import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { createBaseFormFieldNode } from './BaseFormFieldNode';
import { BaseFormFieldNodeView, FormFieldNodeViewProps } from './BaseFormFieldNodeView';
import { EmailFieldData } from '@/types/form';

function EmailFieldNodeView(props: NodeViewProps) {
  return (
    <BaseFormFieldNodeView {...props}>
      <EmailFieldComponent />
    </BaseFormFieldNodeView>
  );
}

function EmailFieldComponent({ fieldData, isSelected }: FormFieldNodeViewProps) {
  const data = fieldData as EmailFieldData;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {data.label}
          {data.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isSelected && (
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Email Field
          </div>
        )}
      </div>
      
      {data.description && (
        <p className="text-sm text-gray-500">{data.description}</p>
      )}
      
      <input
        type="email"
        placeholder={data.placeholder || 'Enter email address...'}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled
      />
      
      {data.validation?.message && (
        <p className="text-xs text-gray-400">Validation: {data.validation.message}</p>
      )}
    </div>
  );
}

export const EmailFieldNode = createBaseFormFieldNode(
  'emailField',
  'email',
  EmailFieldNodeView,
  {
    label: 'Email Address',
    placeholder: 'Enter email address...',
  }
);
