import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { createBaseFormFieldNode } from './BaseFormFieldNode';
import { BaseFormFieldNodeView, FormFieldNodeViewProps } from './BaseFormFieldNodeView';
import { SeparatorFieldData } from '@/types/form';

function SeparatorFieldNodeView(props: NodeViewProps) {
  return (
    <BaseFormFieldNodeView {...props}>
      <SeparatorFieldComponent />
    </BaseFormFieldNodeView>
  );
}

function SeparatorFieldComponent({ fieldData, isSelected }: FormFieldNodeViewProps) {
  const data = fieldData as SeparatorFieldData;

  return (
    <div className="space-y-2">
      {isSelected && (
        <div className="flex justify-end">
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Separator
          </div>
        </div>
      )}
      
      {data.label && data.label !== 'Separator' && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{data.label}</h3>
      )}
      
      {data.description && (
        <p className="text-sm text-gray-600 mb-3">{data.description}</p>
      )}
      
      <hr className="border-gray-300" />
    </div>
  );
}

export const SeparatorFieldNode = createBaseFormFieldNode(
  'separatorField',
  'separator',
  SeparatorFieldNodeView,
  {
    label: 'Separator',
    description: '',
  }
);
