import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import { ContainerStyle } from '@/types/form';

export interface SingleColumnNodeAttributes {
  id: string;
  style: ContainerStyle;
}

function SingleColumnNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const { id, style } = node.attrs as SingleColumnNodeAttributes;

  const containerClasses = [
    'single-column-container',
    'border-2 border-dashed border-gray-300 rounded-lg p-4 my-4 min-h-[100px]',
    selected ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-400',
    style?.backgroundColor || 'bg-white',
    style?.padding || 'p-4',
    style?.margin || 'my-4',
    style?.borderRadius || 'rounded-lg',
    style?.borderColor || 'border-gray-300',
    style?.borderWidth || 'border-2',
  ].filter(Boolean).join(' ');

  return (
    <NodeViewWrapper className={containerClasses}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
            SINGLE COLUMN
          </span>
          {selected && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              SELECTED
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Drop fields here
        </div>
      </div>
      <NodeViewContent className="single-column-content space-y-2" />
    </NodeViewWrapper>
  );
}

export const SingleColumnNode = Node.create({
  name: 'singleColumn',
  group: 'block',
  content: 'block*',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      id: {
        default: () => `single_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => ({ 'data-id': attributes.id }),
      },
      style: {
        default: {},
        parseHTML: element => {
          const style = element.getAttribute('data-style');
          return style ? JSON.parse(style) : {};
        },
        renderHTML: attributes => ({ 'data-style': JSON.stringify(attributes.style) }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="single-column"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'single-column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SingleColumnNodeView);
  },

  addCommands() {
    return {
      insertSingleColumn: (attributes?: Partial<SingleColumnNodeAttributes>) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        });
      },
    };
  },
});
