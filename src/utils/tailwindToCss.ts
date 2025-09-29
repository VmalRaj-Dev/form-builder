/**
 * Utility to convert Tailwind classes to actual CSS properties
 * This will be used for exporting schemas with exact CSS styling
 */

export interface CSSProperties {
  [key: string]: string | number;
}

// Tailwind to CSS mapping for common classes
const tailwindToCssMap: Record<string, CSSProperties> = {
  // Background colors
  'bg-white': { backgroundColor: '#ffffff' },
  'bg-gray-50': { backgroundColor: '#f9fafb' },
  'bg-gray-100': { backgroundColor: '#f3f4f6' },
  'bg-gray-200': { backgroundColor: '#e5e7eb' },
  'bg-gray-300': { backgroundColor: '#d1d5db' },
  'bg-gray-400': { backgroundColor: '#9ca3af' },
  'bg-gray-500': { backgroundColor: '#6b7280' },
  'bg-gray-600': { backgroundColor: '#4b5563' },
  'bg-gray-700': { backgroundColor: '#374151' },
  'bg-gray-800': { backgroundColor: '#1f2937' },
  'bg-gray-900': { backgroundColor: '#111827' },
  'bg-blue-50': { backgroundColor: '#eff6ff' },
  'bg-blue-100': { backgroundColor: '#dbeafe' },
  'bg-blue-200': { backgroundColor: '#bfdbfe' },
  'bg-blue-300': { backgroundColor: '#93c5fd' },
  'bg-blue-400': { backgroundColor: '#60a5fa' },
  'bg-blue-500': { backgroundColor: '#3b82f6' },
  'bg-blue-600': { backgroundColor: '#2563eb' },
  'bg-blue-700': { backgroundColor: '#1d4ed8' },
  'bg-blue-800': { backgroundColor: '#1e40af' },
  'bg-blue-900': { backgroundColor: '#1e3a8a' },
  'bg-red-50': { backgroundColor: '#fef2f2' },
  'bg-red-100': { backgroundColor: '#fee2e2' },
  'bg-red-500': { backgroundColor: '#ef4444' },
  'bg-red-600': { backgroundColor: '#dc2626' },
  'bg-green-50': { backgroundColor: '#f0fdf4' },
  'bg-green-100': { backgroundColor: '#dcfce7' },
  'bg-green-500': { backgroundColor: '#10b981' },
  'bg-green-600': { backgroundColor: '#059669' },
  'bg-purple-50': { backgroundColor: '#faf5ff' },
  'bg-purple-100': { backgroundColor: '#f3e8ff' },
  'bg-purple-500': { backgroundColor: '#8b5cf6' },
  'bg-purple-600': { backgroundColor: '#7c3aed' },

  // Text colors
  'text-white': { color: '#ffffff' },
  'text-gray-50': { color: '#f9fafb' },
  'text-gray-100': { color: '#f3f4f6' },
  'text-gray-200': { color: '#e5e7eb' },
  'text-gray-300': { color: '#d1d5db' },
  'text-gray-400': { color: '#9ca3af' },
  'text-gray-500': { color: '#6b7280' },
  'text-gray-600': { color: '#4b5563' },
  'text-gray-700': { color: '#374151' },
  'text-gray-800': { color: '#1f2937' },
  'text-gray-900': { color: '#111827' },
  'text-blue-500': { color: '#3b82f6' },
  'text-blue-600': { color: '#2563eb' },
  'text-blue-700': { color: '#1d4ed8' },
  'text-red-500': { color: '#ef4444' },
  'text-red-600': { color: '#dc2626' },
  'text-green-600': { color: '#059669' },
  'text-purple-600': { color: '#7c3aed' },

  // Border colors
  'border-gray-100': { borderColor: '#f3f4f6' },
  'border-gray-200': { borderColor: '#e5e7eb' },
  'border-gray-300': { borderColor: '#d1d5db' },
  'border-gray-400': { borderColor: '#9ca3af' },
  'border-gray-500': { borderColor: '#6b7280' },
  'border-blue-300': { borderColor: '#93c5fd' },
  'border-blue-400': { borderColor: '#60a5fa' },
  'border-blue-500': { borderColor: '#3b82f6' },
  'border-red-300': { borderColor: '#fca5a5' },

  // Font family
  'font-sans': { fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' },
  'font-serif': { fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  'font-mono': { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' },

  // Font size
  'text-xs': { fontSize: '0.75rem', lineHeight: '1rem' },
  'text-sm': { fontSize: '0.875rem', lineHeight: '1.25rem' },
  'text-base': { fontSize: '1rem', lineHeight: '1.5rem' },
  'text-lg': { fontSize: '1.125rem', lineHeight: '1.75rem' },
  'text-xl': { fontSize: '1.25rem', lineHeight: '1.75rem' },
  'text-2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  'text-3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },

  // Font weight
  'font-thin': { fontWeight: 100 },
  'font-extralight': { fontWeight: 200 },
  'font-light': { fontWeight: 300 },
  'font-normal': { fontWeight: 400 },
  'font-medium': { fontWeight: 500 },
  'font-semibold': { fontWeight: 600 },
  'font-bold': { fontWeight: 700 },
  'font-extrabold': { fontWeight: 800 },

  // Padding
  'p-0': { padding: '0px' },
  'p-1': { padding: '0.25rem' },
  'p-2': { padding: '0.5rem' },
  'p-3': { padding: '0.75rem' },
  'p-4': { padding: '1rem' },
  'p-5': { padding: '1.25rem' },
  'p-6': { padding: '1.5rem' },
  'p-8': { padding: '2rem' },
  'p-10': { padding: '2.5rem' },
  'p-12': { padding: '3rem' },
  'px-1': { paddingLeft: '0.25rem', paddingRight: '0.25rem' },
  'px-2': { paddingLeft: '0.5rem', paddingRight: '0.5rem' },
  'px-3': { paddingLeft: '0.75rem', paddingRight: '0.75rem' },
  'px-4': { paddingLeft: '1rem', paddingRight: '1rem' },
  'px-6': { paddingLeft: '1.5rem', paddingRight: '1.5rem' },
  'px-8': { paddingLeft: '2rem', paddingRight: '2rem' },
  'py-1': { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
  'py-2': { paddingTop: '0.5rem', paddingBottom: '0.5rem' },
  'py-3': { paddingTop: '0.75rem', paddingBottom: '0.75rem' },
  'py-4': { paddingTop: '1rem', paddingBottom: '1rem' },
  'py-5': { paddingTop: '1.25rem', paddingBottom: '1.25rem' },

  // Combined padding
  'px-2 py-1': { paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.25rem', paddingBottom: '0.25rem' },
  'px-3 py-2': { paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' },
  'px-4 py-3': { paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' },
  'px-6 py-4': { paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem' },
  'py-2 px-3': { paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' },
  'py-3 px-4': { paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' },
  'py-4 px-6': { paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem' },
  'py-5 px-8': { paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '1.25rem', paddingBottom: '1.25rem' },

  // Margin
  'my-4': { marginTop: '1rem', marginBottom: '1rem' },
  'mb-1': { marginBottom: '0.25rem' },
  'mb-2': { marginBottom: '0.5rem' },
  'mb-3': { marginBottom: '0.75rem' },
  'mb-4': { marginBottom: '1rem' },
  'mb-6': { marginBottom: '1.5rem' },
  'mb-8': { marginBottom: '2rem' },

  // Border radius
  'rounded-none': { borderRadius: '0px' },
  'rounded-sm': { borderRadius: '0.125rem' },
  'rounded': { borderRadius: '0.25rem' },
  'rounded-md': { borderRadius: '0.375rem' },
  'rounded-lg': { borderRadius: '0.5rem' },
  'rounded-xl': { borderRadius: '0.75rem' },
  'rounded-2xl': { borderRadius: '1rem' },
  'rounded-full': { borderRadius: '9999px' },

  // Border width
  'border': { borderWidth: '1px' },
  'border-2': { borderWidth: '2px' },
  'border-4': { borderWidth: '4px' },

  // Shadow
  'shadow-none': { boxShadow: 'none' },
  'shadow-sm': { boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  'shadow': { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
  'shadow-md': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  'shadow-lg': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  'shadow-xl': { boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },

  // Width
  'w-full': { width: '100%' },
  'w-auto': { width: 'auto' },

  // Max width
  'max-w-md': { maxWidth: '28rem' },
  'max-w-lg': { maxWidth: '32rem' },
  'max-w-xl': { maxWidth: '36rem' },
  'max-w-2xl': { maxWidth: '42rem' },
  'max-w-3xl': { maxWidth: '48rem' },
  'max-w-4xl': { maxWidth: '56rem' },
  'max-w-full': { maxWidth: '100%' },

  // Height
  'h-8': { height: '2rem' },
  'h-10': { height: '2.5rem' },
  'h-12': { height: '3rem' },
  'h-14': { height: '3.5rem' },
  'h-16': { height: '4rem' },

  // Space between
  'space-y-2': { gap: '0.5rem' },
  'space-y-3': { gap: '0.75rem' },
  'space-y-4': { gap: '1rem' },
  'space-y-6': { gap: '1.5rem' },

  // Text alignment
  'text-left': { textAlign: 'left' },
  'text-center': { textAlign: 'center' },
  'text-right': { textAlign: 'right' },

  // Focus ring colors (for reference)
  'focus:ring-blue-500': { '--ring-color': '#3b82f6' },
  'focus:border-blue-500': { '--border-color-focus': '#3b82f6' },
};

/**
 * Convert Tailwind classes to CSS properties
 */
export function tailwindToCSS(tailwindClasses: string | undefined): CSSProperties {
  if (!tailwindClasses) return {};

  const classes = tailwindClasses.split(' ').filter(Boolean);
  let cssProps: CSSProperties = {};

  for (const className of classes) {
    if (tailwindToCssMap[className]) {
      cssProps = { ...cssProps, ...tailwindToCssMap[className] };
    }
  }

  return cssProps;
}

/**
 * Convert multiple Tailwind properties to CSS
 */
export function convertTailwindPropertiesToCSS(props: Record<string, any>): Record<string, any> {
  const converted: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value.includes('-') && !value.startsWith('#') && !value.includes('.')) {
      // This might be a Tailwind class
      const css = tailwindToCSS(value);
      if (Object.keys(css).length > 0) {
        converted[key] = css;
      } else {
        converted[key] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      converted[key] = convertTailwindPropertiesToCSS(value);
    } else {
      converted[key] = value;
    }
  }

  return converted;
}

/**
 * Get CSS value from a Tailwind class or return the original value
 */
export function getCSSValue(value: string | undefined): string | CSSProperties | undefined {
  if (!value) return undefined;
  
  const css = tailwindToCSS(value);
  if (Object.keys(css).length > 0) {
    return css;
  }
  
  return value;
}

/**
 * Convert field style properties to CSS
 */
export function convertFieldStyleToCSS(style: Record<string, any> | undefined): Record<string, any> {
  if (!style) return {};

  const cssStyle: Record<string, any> = {};

  // Convert each style property
  if (style.labelColor) cssStyle.labelColor = getCSSValue(style.labelColor);
  if (style.labelWeight) cssStyle.labelWeight = getCSSValue(style.labelWeight);
  if (style.labelAlignment) {
    const alignmentMap: Record<string, string> = {
      'left': 'left',
      'center': 'center',
      'right': 'right'
    };
    cssStyle.labelAlignment = alignmentMap[style.labelAlignment] || style.labelAlignment;
  }
  if (style.labelPosition) cssStyle.labelPosition = style.labelPosition;

  if (style.inputBorderColor) cssStyle.inputBorderColor = getCSSValue(style.inputBorderColor);
  if (style.inputBorderRadius) cssStyle.inputBorderRadius = getCSSValue(style.inputBorderRadius);
  if (style.inputBackgroundColor) cssStyle.inputBackgroundColor = getCSSValue(style.inputBackgroundColor);
  if (style.inputFocusColor) cssStyle.inputFocusColor = getCSSValue(style.inputFocusColor);
  if (style.inputPadding) cssStyle.inputPadding = getCSSValue(style.inputPadding);
  if (style.inputHeight) cssStyle.inputHeight = getCSSValue(style.inputHeight);
  
  if (style.fontSize) cssStyle.fontSize = getCSSValue(style.fontSize);
  if (style.marginBottom) cssStyle.marginBottom = getCSSValue(style.marginBottom);
  if (style.width) cssStyle.width = getCSSValue(style.width);
  if (style.icon) cssStyle.icon = style.icon;

  return cssStyle;
}

/**
 * Convert form design properties to CSS
 */
export function convertFormDesignToCSS(design: Record<string, any> | undefined): Record<string, any> {
  if (!design) return {};

  const cssDesign: Record<string, any> = {};

  if (design.backgroundColor) cssDesign.backgroundColor = getCSSValue(design.backgroundColor);
  if (design.fontFamily) {
    if (design.fontFamily === 'custom' && design.customFontFamily) {
      cssDesign.fontFamily = design.customFontFamily;
    } else {
      cssDesign.fontFamily = getCSSValue(design.fontFamily);
    }
  }
  if (design.fontSize) cssDesign.fontSize = getCSSValue(design.fontSize);
  if (design.padding) cssDesign.padding = getCSSValue(design.padding);
  if (design.maxWidth) cssDesign.maxWidth = getCSSValue(design.maxWidth);
  if (design.borderRadius) cssDesign.borderRadius = getCSSValue(design.borderRadius);
  if (design.boxShadow) cssDesign.boxShadow = getCSSValue(design.boxShadow);
  if (design.logoUrl) cssDesign.logoUrl = design.logoUrl;

  // Convert spacing
  if (design.spacing) {
    cssDesign.spacing = {};
    if (design.spacing.container) cssDesign.spacing.container = getCSSValue(design.spacing.container);
    if (design.spacing.fields) cssDesign.spacing.fields = getCSSValue(design.spacing.fields);
    if (design.spacing.rowGap) cssDesign.spacing.rowGap = design.spacing.rowGap; // Already in rem
    if (design.spacing.columnGap) cssDesign.spacing.columnGap = design.spacing.columnGap; // Already in rem
  }

  // Convert submit button
  if (design.submitButton) {
    cssDesign.submitButton = {};
    if (design.submitButton.text) cssDesign.submitButton.text = design.submitButton.text;
    if (design.submitButton.backgroundColor) cssDesign.submitButton.backgroundColor = getCSSValue(design.submitButton.backgroundColor);
    if (design.submitButton.textColor) cssDesign.submitButton.textColor = getCSSValue(design.submitButton.textColor);
    if (design.submitButton.padding) cssDesign.submitButton.padding = getCSSValue(design.submitButton.padding);
    if (design.submitButton.borderRadius) cssDesign.submitButton.borderRadius = getCSSValue(design.submitButton.borderRadius);
    if (design.submitButton.fontSize) cssDesign.submitButton.fontSize = getCSSValue(design.submitButton.fontSize);
    if (design.submitButton.fontWeight) cssDesign.submitButton.fontWeight = getCSSValue(design.submitButton.fontWeight);
    if (design.submitButton.width) cssDesign.submitButton.width = design.submitButton.width;
    if (design.submitButton.alignment) cssDesign.submitButton.alignment = design.submitButton.alignment;
  }

  return cssDesign;
}
