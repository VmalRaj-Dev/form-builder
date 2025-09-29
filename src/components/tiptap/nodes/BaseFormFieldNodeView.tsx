import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { FormFieldData } from '@/types/form';

export interface BaseFormFieldNodeViewProps extends NodeViewProps {
  onSelect?: (fieldData: FormFieldData) => void;
  isSelected?: boolean;
  children?: React.ReactElement;
}

export interface FormFieldNodeViewProps {
  fieldData?: FormFieldData;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: Partial<FormFieldData>) => void;
}

export function BaseFormFieldNodeView({ 
  node, 
  updateAttributes, 
  selected,
  onSelect,
  children 
}: BaseFormFieldNodeViewProps) {
  const fieldData: FormFieldData = {
    id: node.attrs.id,
    type: node.attrs.type,
    label: node.attrs.label,
    placeholder: node.attrs.placeholder,
    description: node.attrs.description,
    required: node.attrs.required,
    validation: node.attrs.validation,
    ...Object.keys(node.attrs).reduce((acc, key) => {
      if (!['id', 'type', 'label', 'placeholder', 'description', 'required', 'validation'].includes(key)) {
        acc[key] = node.attrs[key];
      }
      return acc;
    }, {} as Record<string, any>),
  } as FormFieldData;

  const handleSelect = () => {
    onSelect?.(fieldData);
  };

  const handleUpdate = (updates: Partial<FormFieldData>) => {
    updateAttributes(updates);
  };

  return (
    <NodeViewWrapper
      className={`form-field-node ${selected ? 'selected' : ''} cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 rounded-lg p-4 my-2 ${
        selected ? 'border-blue-500 bg-blue-50' : ''
      }`}
      onClick={handleSelect}
    >
      {children && React.isValidElement(children) && React.cloneElement(children, {
        fieldData,
        isSelected: selected,
        onSelect: handleSelect,
        onUpdate: handleUpdate,
      } as any)}
    </NodeViewWrapper>
  );
}
