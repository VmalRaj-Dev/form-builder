/**
 * Date formatting utilities for form fields
 */

export type DateFormatType = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'custom';

/**
 * Format a date string according to the specified format
 */
export function formatDateValue(value: string, format: DateFormatType, customFormat?: string): string {
  if (!value) return value;

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD-MM-YYYY':
      return `${day}-${month}-${year}`;
    case 'MM-DD-YYYY':
      return `${month}-${day}-${year}`;
    case 'custom':
      if (customFormat) {
        return customFormat
          .replace(/DD/g, day)
          .replace(/MM/g, month)
          .replace(/YYYY/g, String(year))
          .replace(/YY/g, String(year).slice(-2));
      }
      return value;
    default:
      return value;
  }
}

/**
 * Parse a formatted date string back to YYYY-MM-DD format for HTML date input
 */
export function parseDateValue(formattedValue: string, format: DateFormatType, customFormat?: string): string {
  if (!formattedValue) return '';

  let day = '';
  let month = '';
  let year = '';

  try {
    switch (format) {
      case 'MM/DD/YYYY':
        const mmddParts = formattedValue.split('/');
        if (mmddParts.length === 3) {
          [month, day, year] = mmddParts;
        }
        break;
      case 'DD/MM/YYYY':
        const ddmmParts = formattedValue.split('/');
        if (ddmmParts.length === 3) {
          [day, month, year] = ddmmParts;
        }
        break;
      case 'YYYY-MM-DD':
        return formattedValue; // Already in correct format
      case 'DD-MM-YYYY':
        const ddmmDashParts = formattedValue.split('-');
        if (ddmmDashParts.length === 3) {
          [day, month, year] = ddmmDashParts;
        }
        break;
      case 'MM-DD-YYYY':
        const mmddDashParts = formattedValue.split('-');
        if (mmddDashParts.length === 3) {
          [month, day, year] = mmddDashParts;
        }
        break;
      case 'custom':
        if (customFormat) {
          // Simple parsing for common patterns
          const separators = ['-', '/', '.', ' '];
          let separator = '';
          for (const sep of separators) {
            if (formattedValue.includes(sep)) {
              separator = sep;
              break;
            }
          }
          
          if (separator) {
            const parts = formattedValue.split(separator);
            if (parts.length === 3) {
              if (customFormat.startsWith('DD')) {
                [day, month, year] = parts;
              } else if (customFormat.startsWith('MM')) {
                [month, day, year] = parts;
              } else if (customFormat.startsWith('YYYY')) {
                [year, month, day] = parts;
              } else {
                return formattedValue;
              }
            }
          }
        }
        break;
      default:
        return formattedValue;
    }

    if (day && month && year) {
      // Ensure 4-digit year
      if (year.length === 2) {
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        year = String(currentCentury + parseInt(year));
      }

      // Create and validate date
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        const isoString = date.toISOString().split('T')[0];
        return isoString;
      }
    }
  } catch (error) {
    console.warn('Error parsing date:', error);
  }

  return '';
}

/**
 * Get placeholder text for date input based on format
 */
export function getDatePlaceholder(format: DateFormatType, customFormat?: string): string {
  switch (format) {
    case 'MM/DD/YYYY':
      return 'MM/DD/YYYY';
    case 'DD/MM/YYYY':
      return 'DD/MM/YYYY';
    case 'YYYY-MM-DD':
      return 'YYYY-MM-DD';
    case 'DD-MM-YYYY':
      return 'DD-MM-YYYY';
    case 'MM-DD-YYYY':
      return 'MM-DD-YYYY';
    case 'custom':
      return customFormat || 'Enter date';
    default:
      return 'Enter date';
  }
}

/**
 * Validate date format pattern
 */
export function validateDateFormat(value: string, format: DateFormatType, customFormat?: string): boolean {
  if (!value) return false;

  const patterns: Record<DateFormatType, RegExp | null> = {
    'MM/DD/YYYY': /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
    'DD/MM/YYYY': /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    'YYYY-MM-DD': /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    'DD-MM-YYYY': /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
    'MM-DD-YYYY': /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
    'custom': null, // Custom validation would need to be implemented per format
  };

  const pattern = patterns[format];
  if (pattern) {
    return pattern.test(value);
  }

  return true; // For custom formats, assume valid for now
}
