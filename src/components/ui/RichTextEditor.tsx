'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  toolbar?: 'basic' | 'full' | 'minimal';
  allowLinks?: boolean;
  allowFormatting?: boolean;
  className?: string;
  error?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '120px',
  maxHeight = '400px',
  toolbar = 'basic',
  allowLinks = true,
  allowFormatting = true,
  className = '',
  error = false
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${
          error ? 'border-red-300' : ''
        }`,
        style: `min-height: ${minHeight}; max-height: ${maxHeight}; overflow-y: auto;`,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );

  const renderToolbar = () => {
    if (toolbar === 'minimal') {
      return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200">
          {allowFormatting && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
              >
                <Bold size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
              >
                <Italic size={16} />
              </ToolbarButton>
            </>
          )}
        </div>
      );
    }

    if (toolbar === 'basic') {
      return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 flex-wrap">
          {allowFormatting && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
              >
                <Bold size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
              >
                <Italic size={16} />
              </ToolbarButton>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <List size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </ToolbarButton>
            </>
          )}
          {allowLinks && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <ToolbarButton
                onClick={() => {
                  const url = window.prompt('Enter URL:');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                isActive={editor.isActive('link')}
                title="Add Link"
              >
                <Link size={16} />
              </ToolbarButton>
            </>
          )}
        </div>
      );
    }

    // Full toolbar
    return (
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={16} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {allowFormatting && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={16} />
            </ToolbarButton>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote size={16} />
            </ToolbarButton>
          </>
        )}
        
        {allowLinks && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <Link size={16} />
            </ToolbarButton>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`border rounded-md bg-white ${error ? 'border-red-300' : 'border-gray-300'} ${className}`}>
      {renderToolbar()}
      <div className="p-3">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          className="min-h-[120px] focus-within:outline-none"
        />
      </div>
    </div>
  );
}
