'use client';

import React, { useState, useRef } from 'react';
import { parseCSV, validateCSV, generateSampleCSV, readFileAsText, CSVOption } from '@/utils/csvParser';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CSVUploaderProps {
  onOptionsImported: (options: CSVOption[]) => void;
  currentOptions?: CSVOption[];
  className?: string;
}

export function CSVUploader({ onOptionsImported, currentOptions = [], className = '' }: CSVUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [csvText, setCsvText] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
        throw new Error('Please upload a CSV file');
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        throw new Error('File size must be less than 1MB');
      }

      const csvContent = await readFileAsText(file);
      const validation = validateCSV(csvContent);
      
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid CSV format');
      }

      const options = parseCSV(csvContent);
      
      if (options.length === 0) {
        throw new Error('No valid options found in CSV');
      }

      onOptionsImported(options);
      setSuccess(`Successfully imported ${options.length} options`);
      setCsvText(csvContent);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleTextImport = () => {
    setError(null);
    setSuccess(null);

    const validation = validateCSV(csvText);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid CSV format');
      return;
    }

    const options = parseCSV(csvText);
    if (options.length === 0) {
      setError('No valid options found in CSV');
      return;
    }

    onOptionsImported(options);
    setSuccess(`Successfully imported ${options.length} options`);
  };

  const downloadSample = () => {
    const sample = generateSampleCSV();
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-options.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCurrentOptions = () => {
    if (currentOptions.length === 0) {
      setError('No options to export');
      return;
    }

    const csvContent = 'label,value\n' + 
      currentOptions.map(opt => `"${opt.label}","${opt.value}"`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dropdown-options.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <h4 className="text-sm font-medium text-gray-900 mb-2">Import Options from CSV</h4>
          
          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Choose CSV File'}
            </button>
            
            <button
              onClick={() => setShowTextArea(!showTextArea)}
              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Paste CSV Text
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {showTextArea && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Paste CSV Content
          </label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="label,value&#10;Option 1,option1&#10;Option 2,option2"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
          />
          <button
            onClick={handleTextImport}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Import from Text
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center p-3 text-sm text-red-800 bg-red-50 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center p-3 text-sm text-green-800 bg-green-50 rounded-md">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <button
          onClick={downloadSample}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Download className="w-4 h-4 mr-1" />
          Download Sample CSV
        </button>
        
        {currentOptions.length > 0 && (
          <button
            onClick={exportCurrentOptions}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Download className="w-4 h-4 mr-1" />
            Export Current Options
          </button>
        )}
      </div>

      <div className="text-xs text-gray-500">
        <p><strong>CSV Format:</strong> First column = Label, Second column = Value (optional)</p>
        <p><strong>Example:</strong> "Option 1,option1" or just "Option 1" (value will be auto-generated)</p>
      </div>
    </div>
  );
}
