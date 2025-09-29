import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { ContainerStyle } from '@/types/form';

export interface TwoColumnNodeAttributes {
  id: string;
  style: ContainerStyle;
  leftContent: any[];
  rightContent: any[];
}

function TwoColumnNodeView({ node, updateAttributes, selected, editor }: NodeViewProps) {
  const { id, style, leftContent = [], rightContent = [] } = node.attrs as TwoColumnNodeAttributes;

  const containerClasses = [
    'two-column-container',
    'border-2 border-dashed border-gray-300 rounded-lg p-4 my-4 min-h-[150px]',
    selected ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-400',
    style?.backgroundColor || 'bg-white',
    style?.padding || 'p-4',
    style?.margin || 'my-4',
    style?.borderRadius || 'rounded-lg',
    style?.borderColor || 'border-gray-300',
    style?.borderWidth || 'border-2',
  ].filter(Boolean).join(' ');

  const columnClasses = [
    'flex-1 border border-dashed border-gray-200 rounded p-3 min-h-[100px]',
    'hover:border-blue-300 transition-colors',
  ].join(' ');

  return (
    <NodeViewWrapper className={containerClasses}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
            TWO COLUMN
          </span>
          {selected && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              SELECTED
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Drop fields into columns
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className={columnClasses}>
          <div className="text-xs text-gray-400 mb-2 text-center">Left Column</div>
          <div 
            className="two-column-left space-y-2"
            data-column="left"
            onDrop={(e) => {
              e.preventDefault();
              // Handle drop logic here
              console.log('Dropped in left column');
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            {leftContent.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                <div className="text-xs">Drop form fields here</div>
              </div>
            )}
            {/* Left column content will be rendered here */}
          </div>
        </div>

        {/* Right Column */}
        <div className={columnClasses}>
          <div className="text-xs text-gray-400 mb-2 text-center">Right Column</div>
          <div 
            className="two-column-right space-y-2"
            data-column="right"
            onDrop={(e) => {
              e.preventDefault();
              // Handle drop logic here
              console.log('Dropped in right column');
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            {rightContent.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                <div className="text-xs">Drop form fields here</div>
              </div>
            )}
            {/* Right column content will be rendered here */}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const TwoColumnNode = Node.create({
  name: 'twoColumn',
  group: 'block',
  content: '',
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      id: {
        default: () => `two_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      leftContent: {
        default: [],
        parseHTML: element => {
          const content = element.getAttribute('data-left-content');
          return content ? JSON.parse(content) : [];
        },
        renderHTML: attributes => ({ 'data-left-content': JSON.stringify(attributes.leftContent) }),
      },
      rightContent: {
        default: [],
        parseHTML: element => {
          const content = element.getAttribute('data-right-content');
          return content ? JSON.parse(content) : [];
        },
        renderHTML: attributes => ({ 'data-right-content': JSON.stringify(attributes.rightContent) }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="two-column"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'two-column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TwoColumnNodeView);
  },

  addCommands() {
    return {
      insertTwoColumn: (attributes?: Partial<TwoColumnNodeAttributes>) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        });
      },
    };
  },
});
