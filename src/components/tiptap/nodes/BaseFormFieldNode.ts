import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FormFieldData, FormFieldType } from '@/types/form';

export interface BaseFormFieldNodeOptions {
  HTMLAttributes: Record<string, any>;
}

export interface BaseFormFieldNodeAttributes {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: any;
  [key: string]: any;
}

export function createBaseFormFieldNode<T extends FormFieldData>(
  name: string,
  fieldType: FormFieldType,
  NodeViewComponent: React.ComponentType<any>,
  defaultAttributes: Partial<T> = {}
) {
  return Node.create<BaseFormFieldNodeOptions>({
    name,
    group: 'block',
    atom: true,
    draggable: true,

    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },

    addAttributes() {
      return {
        id: {
          default: () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          parseHTML: element => element.getAttribute('data-id'),
          renderHTML: attributes => ({ 'data-id': attributes.id }),
        },
        type: {
          default: fieldType,
          parseHTML: element => element.getAttribute('data-type'),
          renderHTML: attributes => ({ 'data-type': attributes.type }),
        },
        label: {
          default: defaultAttributes.label || `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          parseHTML: element => element.getAttribute('data-label'),
          renderHTML: attributes => ({ 'data-label': attributes.label }),
        },
        placeholder: {
          default: defaultAttributes.placeholder || '',
          parseHTML: element => element.getAttribute('data-placeholder'),
          renderHTML: attributes => ({ 'data-placeholder': attributes.placeholder }),
        },
        description: {
          default: defaultAttributes.description || '',
          parseHTML: element => element.getAttribute('data-description'),
          renderHTML: attributes => ({ 'data-description': attributes.description }),
        },
        required: {
          default: defaultAttributes.required || false,
          parseHTML: element => element.getAttribute('data-required') === 'true',
          renderHTML: attributes => ({ 'data-required': attributes.required }),
        },
        validation: {
          default: defaultAttributes.validation || {},
          parseHTML: element => {
            const validation = element.getAttribute('data-validation');
            return validation ? JSON.parse(validation) : {};
          },
          renderHTML: attributes => ({ 'data-validation': JSON.stringify(attributes.validation) }),
        },
        ...Object.keys(defaultAttributes).reduce((acc, key) => {
          if (!['id', 'type', 'label', 'placeholder', 'description', 'required', 'validation'].includes(key)) {
            acc[key] = {
              default: (defaultAttributes as any)[key],
              parseHTML: (element: HTMLElement) => {
                const value = element.getAttribute(`data-${key}`);
                try {
                  return JSON.parse(value || 'null');
                } catch {
                  return value;
                }
              },
              renderHTML: (attributes: any) => ({
                [`data-${key}`]: typeof attributes[key] === 'object' 
                  ? JSON.stringify(attributes[key]) 
                  : attributes[key]
              }),
            };
          }
          return acc;
        }, {} as Record<string, any>),
      };
    },

    parseHTML() {
      return [
        {
          tag: `div[data-type="${fieldType}"]`,
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addNodeView() {
      return ReactNodeViewRenderer(NodeViewComponent);
    },

    addCommands() {
      return {
        insertFormField: (attributes: Partial<BaseFormFieldNodeAttributes>) => ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              ...defaultAttributes,
              ...attributes,
            },
          });
        },
        updateFormField: (id: string, attributes: Partial<BaseFormFieldNodeAttributes>) => ({ commands, state }) => {
          const { doc } = state;
          let nodePos: number | null = null;

          doc.descendants((node, pos) => {
            if (node.type.name === this.name && node.attrs.id === id) {
              nodePos = pos;
              return false;
            }
          });

          if (nodePos !== null) {
            return commands.updateAttributes(this.name, attributes);
          }

          return false;
        },
      };
    },
  });
}
