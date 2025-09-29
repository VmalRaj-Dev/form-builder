'use client';

import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Dropcursor } from '@tiptap/extension-dropcursor';

import {
  TextFieldNode,
  LongTextFieldNode,
  EmailFieldNode,
  NumberFieldNode,
  DropdownFieldNode,
  RadioFieldNode,
  CheckboxFieldNode,
  SeparatorFieldNode,
} from './nodes';

import { FormFieldData, FormFieldType } from '@/types/form';

interface FormBuilderEditorProps {
  onFieldSelect?: (field: FormFieldData | null) => void;
  selectedFieldId?: string | null;
}

export function FormBuilderEditor({ onFieldSelect, selectedFieldId }: FormBuilderEditorProps) {
  const [selectedField, setSelectedField] = useState<FormFieldData | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default heading, paragraph for cleaner form building
        heading: false,
        paragraph: {
          HTMLAttributes: {
            class: 'form-paragraph',
          },
        },
      }),
      Dropcursor.configure({
        color: '#3b82f6',
        width: 2,
      }),
      TextFieldNode,
      LongTextFieldNode,
      EmailFieldNode,
      NumberFieldNode,
      DropdownFieldNode,
      RadioFieldNode,
      CheckboxFieldNode,
      SeparatorFieldNode,
    ],
    content: `
      <p>Start building your form by dragging fields from the sidebar or clicking the buttons below.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onSelectionUpdate: ({ editor }) => {
      // Handle field selection
      const { from, to } = editor.state.selection;
      let selectedNode = null;
      
      editor.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name.includes('Field')) {
          selectedNode = {
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
          return false;
        }
      });
      
      setSelectedField(selectedNode);
      onFieldSelect?.(selectedNode);
    },
  });

  const insertField = useCallback((fieldType: FormFieldType) => {
    if (!editor) return;

    const nodeTypeMap = {
      text: 'textField',
      longtext: 'longTextField',
      email: 'emailField',
      number: 'numberField',
      dropdown: 'dropdownField',
      radio: 'radioField',
      checkbox: 'checkboxField',
      separator: 'separatorField',
    } as const;

    const nodeType = nodeTypeMap[fieldType as keyof typeof nodeTypeMap];
    if (nodeType) {
      editor.chain().focus().insertContent({ type: nodeType }).run();
    }
  }, [editor]);

  const updateSelectedField = useCallback((updates: Partial<FormFieldData>) => {
    if (!editor || !selectedField) return;
    // TODO: Implement field update functionality
    console.log('Field update:', updates);
  }, [editor, selectedField]);

  const getFormSchema = useCallback(() => {
    if (!editor) return null;

    const fields: FormFieldData[] = [];
    
    editor.state.doc.descendants((node) => {
      if (node.type.name.includes('Field')) {
        fields.push({
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
        } as FormFieldData);
      }
    });

    return {
      id: `form_${Date.now()}`,
      title: 'Untitled Form',
      fields,
      layout: { type: 'single' as const },
    };
  }, [editor]);

  const exportSchema = useCallback(() => {
    const schema = getFormSchema();
    console.log('Form Schema:', JSON.stringify(schema, null, 2));
    return schema;
  }, [getFormSchema]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => insertField('text')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Text Field
          </button>
          <button
            onClick={() => insertField('longtext')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Long Text
          </button>
          <button
            onClick={() => insertField('email')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Email
          </button>
          <button
            onClick={() => insertField('number')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Number
          </button>
          <button
            onClick={() => insertField('dropdown')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Dropdown
          </button>
          <button
            onClick={() => insertField('radio')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Radio
          </button>
          <button
            onClick={() => insertField('checkbox')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            + Checkbox
          </button>
          <button
            onClick={() => insertField('separator')}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            + Separator
          </button>
          
          <div className="ml-auto flex gap-2">
            <button
              onClick={exportSchema}
              className="px-4 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Export Schema
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
