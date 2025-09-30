export interface CSVOption {
  id: string;
  label: string;
  value: string;
}

export function parseCSV(csvText: string): CSVOption[] {
  const lines = csvText.trim().split('\n');
  const options: CSVOption[] = [];
  
  // Skip empty lines
  const nonEmptyLines = lines.filter(line => line.trim());
  
  if (nonEmptyLines.length === 0) {
    return [];
  }
  
  // Check if first line is a header (contains "label" and "value" or similar)
  const firstLine = nonEmptyLines[0].toLowerCase();
  const hasHeader = firstLine.includes('label') || firstLine.includes('value') || firstLine.includes('option');
  
  const dataLines = hasHeader ? nonEmptyLines.slice(1) : nonEmptyLines;
  
  dataLines.forEach((line, index) => {
    const columns = line.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));
    
    if (columns.length >= 1) {
      const label = columns[0];
      const value = columns.length >= 2 ? columns[1] : columns[0].toLowerCase().replace(/\s+/g, '_');
      
      if (label) {
        options.push({
          id: `csv_option_${index + 1}`,
          label,
          value
        });
      }
    }
  });
  
  return options;
}

export function validateCSV(csvText: string): { isValid: boolean; error?: string } {
  if (!csvText.trim()) {
    return { isValid: false, error: 'CSV content is empty' };
  }
  
  const lines = csvText.trim().split('\n');
  const nonEmptyLines = lines.filter(line => line.trim());
  
  if (nonEmptyLines.length === 0) {
    return { isValid: false, error: 'No valid data found in CSV' };
  }
  
  // Check if all lines have at least one column
  for (let i = 0; i < nonEmptyLines.length; i++) {
    const columns = nonEmptyLines[i].split(',');
    if (columns.length === 0 || !columns[0].trim()) {
      return { isValid: false, error: `Line ${i + 1} is invalid or empty` };
    }
  }
  
  return { isValid: true };
}

export function generateSampleCSV(): string {
  return `label,value
Option 1,option1
Option 2,option2
Option 3,option3`;
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}
