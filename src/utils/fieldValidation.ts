import { FormFieldData, ValidationRule } from '@/types/form';

/**
 * Comprehensive field validation utility
 * Provides field-specific validation logic for all form field types
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (international format)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Postal code patterns
const POSTAL_PATTERNS = {
  US: /^\d{5}(-\d{4})?$/,
  UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  IN: /^\d{6}$/,
};

/**
 * Get postal code pattern for validation
 */
export function getPostalPattern(format: string): string | null {
  switch (format) {
    case 'US': return POSTAL_PATTERNS.US.source;
    case 'UK': return POSTAL_PATTERNS.UK.source;
    case 'CA': return POSTAL_PATTERNS.CA.source;
    case 'IN': return POSTAL_PATTERNS.IN.source;
    default: return null;
  }
}

/**
 * Validate file type and size
 */
function validateFile(file: File, validation: ValidationRule): string | null {
  // File type validation
  if (validation.fileTypes && validation.fileTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = validation.fileTypes.map(type => type.toLowerCase().replace('.', ''));
    
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return `File type must be one of: ${validation.fileTypes.join(', ')}`;
    }
  }

  // File size validation (convert MB to bytes)
  if (validation.maxFileSize && file.size > validation.maxFileSize * 1024 * 1024) {
    return `File size must be less than ${validation.maxFileSize}MB`;
  }

  return null;
}

/**
 * Validate date field
 */
function validateDate(value: string, field: FormFieldData, validation: ValidationRule): string | null {
  if (!value) return null;

  // Parse date based on format
  let dateValue: Date;
  try {
    // For now, assume ISO format or browser-parseable format
    dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) {
      return 'Please enter a valid date';
    }
  } catch {
    return 'Please enter a valid date';
  }

  // Min/Max date validation
  if (validation.minDate) {
    const minDate = new Date(validation.minDate);
    if (dateValue < minDate) {
      return `Date must be after ${minDate.toLocaleDateString()}`;
    }
  }

  if (validation.maxDate) {
    const maxDate = new Date(validation.maxDate);
    if (dateValue > maxDate) {
      return `Date must be before ${maxDate.toLocaleDateString()}`;
    }
  }

  // Age validation
  if (validation.minAge || validation.maxAge) {
    const today = new Date();
    const age = today.getFullYear() - dateValue.getFullYear();
    const monthDiff = today.getMonth() - dateValue.getMonth();
    const dayDiff = today.getDate() - dateValue.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      actualAge--;
    }

    if (validation.minAge && actualAge < validation.minAge) {
      return `Must be at least ${validation.minAge} years old`;
    }

    if (validation.maxAge && actualAge > validation.maxAge) {
      return `Must be no more than ${validation.maxAge} years old`;
    }
  }

  return null;
}

/**
 * Validate dropdown/select field
 */
function validateDropdown(value: string, field: FormFieldData): string | null {
  if (!value) return null;

  // Check if selected value exists in options
  if (field.options && field.options.length > 0) {
    const validValues = field.options.map(option => option.value);
    if (!validValues.includes(value)) {
      return 'Please select a valid option';
    }
  }

  return null;
}

/**
 * Validate radio field
 */
function validateRadio(value: string, field: FormFieldData): string | null {
  if (!value) return null;

  // Check if selected value exists in options
  if (field.options && field.options.length > 0) {
    const validValues = field.options.map(option => option.value);
    if (!validValues.includes(value)) {
      return 'Please select a valid option';
    }
  }

  return null;
}

/**
 * Validate checkbox field
 */
function validateCheckbox(value: boolean | string | null, field: FormFieldData): string | null {
  // For single checkbox, just check if required
  if (field.required && !value) {
    return `${field.label} is required`;
  }

  return null;
}

/**
 * Main validation function for all field types
 */
export function validateField(field: FormFieldData, value: string | boolean | File | null): string | null {
  const validation = field.validation || {};

  // Required field validation (applies to all field types)
  if (field.required) {
    if (value === null || value === undefined || value === '') {
      return validation.requiredMessage || `${field.label} is required`;
    }
    
    // Special case for boolean (checkbox)
    if (typeof value === 'boolean' && !value) {
      return validation.requiredMessage || `${field.label} is required`;
    }
    
    // Special case for File
    if (value instanceof File && value.size === 0) {
      return validation.requiredMessage || `${field.label} is required`;
    }
  }

  // Type-specific validation
  switch (field.type) {
    case 'text':
    case 'longtext':
      if (typeof value === 'string' && value) {
        // Length validation
        if (validation.minLength && value.length < validation.minLength) {
          return validation.minLengthMessage || `${field.label} must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          return validation.maxLengthMessage || `${field.label} must be no more than ${validation.maxLength} characters`;
        }
        
        // Pattern validation
        if (validation.pattern) {
          try {
            const regex = new RegExp(validation.pattern);
            if (!regex.test(value)) {
              return validation.patternMessage || validation.message || `${field.label} format is invalid`;
            }
          } catch {
            console.warn('Invalid regex pattern in validation');
          }
        }
      }
      break;

    case 'email':
      if (typeof value === 'string' && value) {
        if (!EMAIL_REGEX.test(value)) {
          return validation.emailMessage || 'Please enter a valid email address';
        }
        
        // Additional length validation for email
        if (validation.minLength && value.length < validation.minLength) {
          return validation.minLengthMessage || `Email must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          return validation.maxLengthMessage || `Email must be no more than ${validation.maxLength} characters`;
        }
      }
      break;

    case 'phone':
      if (typeof value === 'string' && value) {
        // Clean phone number (remove spaces, dashes, parentheses)
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!PHONE_REGEX.test(cleanPhone)) {
          return validation.phoneMessage || 'Please enter a valid phone number';
        }
        
        // Length validation for phone
        if (validation.minLength && cleanPhone.length < validation.minLength) {
          return validation.minLengthMessage || `Phone number must be at least ${validation.minLength} digits`;
        }
        if (validation.maxLength && cleanPhone.length > validation.maxLength) {
          return validation.maxLengthMessage || `Phone number must be no more than ${validation.maxLength} digits`;
        }
      }
      break;

    case 'number':
      if (typeof value === 'string' && value) {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
          return 'Please enter a valid number';
        }
        
        // Min/Max validation
        if (validation.min !== undefined && numValue < validation.min) {
          return validation.minMessage || `${field.label} must be at least ${validation.min}`;
        }
        if (validation.max !== undefined && numValue > validation.max) {
          return validation.maxMessage || `${field.label} must be no more than ${validation.max}`;
        }
      }
      break;

    case 'date':
      if (typeof value === 'string' && value) {
        return validateDate(value, field, validation);
      }
      break;

    case 'postal':
      if (typeof value === 'string' && value) {
        if (validation.postalFormat) {
          const pattern = validation.postalFormat === 'custom' 
            ? validation.customPattern 
            : getPostalPattern(validation.postalFormat);
          
          if (pattern) {
            try {
              const regex = new RegExp(pattern);
              if (!regex.test(value)) {
                return 'Please enter a valid postal code';
              }
            } catch {
              console.warn('Invalid postal code pattern');
            }
          }
        }
        
        // Length validation for postal codes
        if (validation.minLength && value.length < validation.minLength) {
          return `Postal code must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          return `Postal code must be no more than ${validation.maxLength} characters`;
        }
      }
      break;

    case 'dropdown':
      if (typeof value === 'string') {
        return validateDropdown(value, field);
      }
      break;

    case 'radio':
      if (typeof value === 'string') {
        return validateRadio(value, field);
      }
      break;

    case 'checkbox':
      if (typeof value === 'boolean' || typeof value === 'string' || value === null) {
        return validateCheckbox(value, field);
      }
      break;

    case 'file':
      if (value instanceof File) {
        return validateFile(value, validation);
      }
      break;

    case 'separator':
      // Separators don't need validation
      return null;

    case 'terms':
      // Terms and conditions validation (similar to checkbox)
      if (typeof value === 'boolean' || typeof value === 'string' || value === null) {
        return validateCheckbox(value, field);
      }
      break;

    default:
      // Unknown field type
      console.warn(`Unknown field type: ${(field as any).type}`);
      return null;
  }

  return null;
}

/**
 * Validate all fields in a form
 */
export function validateForm(fields: FormFieldData[], formData: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    if (field.type === 'separator') return; // Skip separators
    
    const value = formData[field.id] || null;
    const error = validateField(field, value);
    
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
}

/**
 * Get validation rules that apply to a specific field type
 */
export function getValidationRulesForFieldType(fieldType: string): string[] {
  const commonRules = ['required'];
  
  switch (fieldType) {
    case 'text':
    case 'longtext':
      return [...commonRules, 'minLength', 'maxLength', 'pattern', 'message'];
    
    case 'email':
      return [...commonRules, 'minLength', 'maxLength'];
    
    case 'phone':
      return [...commonRules, 'minLength', 'maxLength'];
    
    case 'number':
      return [...commonRules, 'min', 'max'];
    
    case 'date':
      return [...commonRules, 'dateFormat', 'customDateFormat', 'minAge', 'maxAge', 'minDate', 'maxDate'];
    
    case 'postal':
      return [...commonRules, 'postalFormat', 'customPattern', 'minLength', 'maxLength'];
    
    case 'dropdown':
    case 'radio':
      return [...commonRules]; // Options are managed separately
    
    case 'checkbox':
      return ['required']; // Only required makes sense for checkbox
    
    case 'file':
      return [...commonRules, 'fileTypes', 'maxFileSize'];
    
    case 'separator':
      return []; // No validation for separators
    
    case 'terms':
      return ['required']; // Only required makes sense for terms (like checkbox)
    
    default:
      return commonRules;
  }
}

/**
 * Check if a validation rule is applicable to a field type
 */
export function isValidationRuleApplicable(fieldType: string, ruleName: string): boolean {
  const applicableRules = getValidationRulesForFieldType(fieldType);
  return applicableRules.includes(ruleName);
}
