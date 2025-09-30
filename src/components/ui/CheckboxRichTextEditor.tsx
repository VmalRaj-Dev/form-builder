'use client';

import React from 'react';
import { RichTextEditor } from './RichTextEditor';

interface CheckboxRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CheckboxRichTextEditor({
  value,
  onChange,
  placeholder = 'I agree to the terms and conditions...'
}: CheckboxRichTextEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Checkbox Content (Rich Text)
      </label>
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minHeight="100px"
        maxHeight="200px"
        toolbar="basic"
        allowLinks={true}
        allowFormatting={true}
        className="border-gray-300"
      />
      <p className="text-xs text-gray-500">
        Create terms & conditions with links. Example: "I agree to the <a href='https://example.com/terms'>Terms and Conditions</a>"
      </p>
    </div>
  );
}
