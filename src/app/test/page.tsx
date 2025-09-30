'use client';

import React, { useState } from 'react';
import { RichTextCheckbox } from '@/components/ui/RichTextCheckbox';
import { CSVUploader } from '@/components/ui/CSVUploader';
import { CSVOption } from '@/utils/csvParser';

export default function TestPage() {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [csvOptions, setCsvOptions] = useState<CSVOption[]>([]);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Feature Test Page</h1>
      
      {/* Rich Text Checkbox Test */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Rich Text Checkbox Test</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Simple Checkbox with Link:</h3>
          <RichTextCheckbox
            id="test-simple"
            checked={checkboxValue}
            onChange={setCheckboxValue}
            label="I agree to the"
            linkText="Terms and Conditions"
            linkUrl="https://example.com/terms"
            useRichText={false}
            required={true}
          />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Rich Text Checkbox:</h3>
          <RichTextCheckbox
            id="test-rich"
            checked={checkboxValue}
            onChange={setCheckboxValue}
            label="Rich Text Terms"
            richTextContent='I agree to the <a href="https://example.com/terms" target="_blank">Terms and Conditions</a> and <a href="https://example.com/privacy" target="_blank">Privacy Policy</a>. I understand that this is a <strong>legally binding</strong> agreement.'
            useRichText={true}
            required={true}
          />
        </div>
      </div>

      {/* CSV Upload Test */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">CSV Upload Test</h2>
        
        <CSVUploader
          onOptionsImported={(options) => {
            setCsvOptions(options);
            console.log('Imported options:', options);
          }}
          currentOptions={csvOptions}
        />

        {csvOptions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Imported Options:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm">
                {JSON.stringify(csvOptions, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Sample CSV for testing */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Sample CSV for Testing:</h3>
        <pre className="text-sm bg-white p-3 rounded border">
{`label,value
United States,us
Canada,ca
United Kingdom,uk
Australia,au
Germany,de`}
        </pre>
        <p className="text-sm text-gray-600 mt-2">
          Copy this text and paste it in the CSV uploader above, or save it as a .csv file and upload it.
        </p>
      </div>
    </div>
  );
}
