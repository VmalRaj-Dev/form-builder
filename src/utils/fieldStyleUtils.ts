import { FieldStyle } from '@/types/form';

/**
 * Convert FieldStyle to CSS properties for the field container
 */
export function fieldContainerToCSS(style: FieldStyle = {}): React.CSSProperties {
  return {
    marginBottom: style.marginBottom || '20px',
    marginTop: style.marginTop || '0px',
    marginLeft: style.marginLeft || '0px',
    marginRight: style.marginRight || '0px',
    width: style.width || '100%',
  };
}

/**
 * Convert FieldStyle to CSS properties for the label
 */
export function fieldLabelToCSS(style: FieldStyle = {}): React.CSSProperties {
  const fontWeightMap = {
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
  };

  return {
    color: style.labelColor || '#111827',
    fontWeight: fontWeightMap[style.labelWeight as keyof typeof fontWeightMap] || '500',
    fontSize: style.labelFontSize || '16px',
    marginBottom: style.labelMarginBottom || '8px',
    textAlign: style.labelAlignment || 'left',
    display: style.labelPosition === 'hidden' ? 'none' : 'block',
  };
}

/**
 * Parse padding from shorthand format (e.g., "8px 12px" -> top/bottom: 8px, left/right: 12px)
 */
export function parsePadding(paddingStr: string) {
  const parts = paddingStr.trim().split(/\s+/);
  if (parts.length === 1) {
    // Single value: all sides
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  } else if (parts.length === 2) {
    // Two values: top/bottom, left/right
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  } else if (parts.length === 4) {
    // Four values: top, right, bottom, left
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
  // Default fallback
  return { top: '8px', right: '12px', bottom: '8px', left: '12px' };
}

/**
 * Convert FieldStyle to CSS properties for the input element
 */
export function fieldInputToCSS(style: FieldStyle = {}): React.CSSProperties {
  const paddingValues = parsePadding(style.inputPadding || '8px 12px');

  return {
    color: style.inputTextColor || '#111827',
    backgroundColor: style.inputBackgroundColor || '#ffffff',
    borderColor: style.inputBorderColor || '#374151',
    borderWidth: style.inputBorderWidth || '2px',
    borderRadius: style.inputBorderRadius || '4px',
    paddingTop: paddingValues.top,
    paddingRight: paddingValues.right,
    paddingBottom: paddingValues.bottom,
    paddingLeft: paddingValues.left,
    height: style.inputHeight || '48px',
    fontSize: style.inputFontSize || '16px',
    width: '100%',
    borderStyle: 'solid',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  };
}

/**
 * Convert FieldStyle to CSS properties for input focus state
 */
export function fieldInputFocusToCSS(style: FieldStyle = {}): React.CSSProperties {
  const focusColor = style.inputFocusColor || '#3b82f6';
  
  return {
    borderColor: focusColor,
    boxShadow: `0 0 0 3px ${focusColor}20`, // 20 is hex for 12.5% opacity
  };
}

/**
 * Generate CSS classes for input focus state (for use with CSS-in-JS or style injection)
 */
export function generateInputFocusCSS(fieldId: string, style: FieldStyle = {}): string {
  const focusColor = style.inputFocusColor || '#3b82f6';
  
  return `
    .field-input-${fieldId}:focus {
      border-color: ${focusColor} !important;
      box-shadow: 0 0 0 3px ${focusColor}20 !important;
    }
  `;
}

/**
 * Check if a color is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert Tailwind class to CSS value (for backward compatibility)
 */
export function tailwindToValue(tailwindClass: string): string {
  const tailwindMap: Record<string, string> = {
    // Colors
    'text-gray-700': '#374151',
    'text-gray-900': '#111827',
    'bg-white': '#ffffff',
    'bg-gray-50': '#f9fafb',
    'border-gray-300': '#d1d5db',
    
    // Font weights
    'font-normal': 'normal',
    'font-medium': 'medium',
    'font-semibold': 'semibold',
    'font-bold': 'bold',
    
    // Border radius
    'rounded-none': '0px',
    'rounded-sm': '2px',
    'rounded': '4px',
    'rounded-md': '6px',
    'rounded-lg': '8px',
    'rounded-xl': '12px',
    
    // Padding
    'p-2': '8px',
    'p-3': '12px',
    'px-3 py-2': '8px 12px',
    'px-4 py-2': '8px 16px',
    
    // Margins
    'mb-1': '4px',
    'mb-2': '8px',
    'mb-4': '16px',
    
    // Heights
    'h-10': '40px',
    'h-12': '48px',
  };

  return tailwindMap[tailwindClass] || tailwindClass;
}

/**
 * Merge default styles with custom styles, converting Tailwind classes as needed
 */
export function mergeFieldStyles(defaultStyle: FieldStyle, customStyle: FieldStyle = {}): FieldStyle {
  const merged = { ...defaultStyle, ...customStyle };
  
  // Convert any remaining Tailwind classes to CSS values
  Object.keys(merged).forEach(key => {
    const value = merged[key as keyof FieldStyle];
    if (typeof value === 'string' && value.includes('-')) {
      // Likely a Tailwind class, try to convert
      const converted = tailwindToValue(value);
      if (converted !== value) {
        (merged as any)[key] = converted;
      }
    }
  });
  
  return merged;
}
