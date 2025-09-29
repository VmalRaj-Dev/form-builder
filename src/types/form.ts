export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormFieldBase {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: ValidationRule;
  layout?: LayoutPosition;
  style?: FieldStyle;
  options?: FieldOption[];
  rows?: number;
  conditionalLogic?: ConditionalLogic;
}

export interface FieldStyle {
  // Label styling
  labelColor?: string; // hex color or CSS color
  labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  labelAlignment?: 'left' | 'center' | 'right';
  labelPosition?: 'outside' | 'inside' | 'hidden';
  labelFontSize?: string; // e.g., "14px", "1rem"
  labelMarginBottom?: string; // e.g., "4px", "0.25rem"
  
  // Input styling
  inputTextColor?: string; // hex color or CSS color
  inputBackgroundColor?: string; // hex color or CSS color
  inputBorderColor?: string; // hex color or CSS color
  inputBorderWidth?: string; // e.g., "1px", "2px"
  inputBorderRadius?: string; // e.g., "4px", "8px"
  inputFocusColor?: string; // hex color or CSS color for focus ring
  inputPadding?: string; // e.g., "8px 12px"
  inputHeight?: string; // e.g., "40px", "2.5rem"
  inputFontSize?: string; // e.g., "14px", "1rem"
  
  // Field container styling
  marginBottom?: string; // e.g., "16px", "1rem"
  marginTop?: string; // e.g., "16px", "1rem"
  marginLeft?: string; // e.g., "0px"
  marginRight?: string; // e.g., "0px"
  width?: string; // e.g., "100%", "300px"
  
  // Icon and decoration
  icon?: string; // emoji or icon
  
  // Checkbox-specific styling
  checkboxText?: string; // Display text next to checkbox (separate from field label)
  checkboxAlignment?: 'left' | 'right'; // Position of checkbox relative to text
  checkboxStyle?: 'default' | 'bordered'; // Style variant: default or bordered container
  checkboxBorderColor?: string; // Border color for bordered style
  checkboxBorderWidth?: string; // Border width for bordered style
  checkboxBorderRadius?: string; // Border radius for bordered style
  checkboxBackgroundColor?: string; // Background color for bordered style
  checkboxPadding?: string; // Padding for bordered style
  
  // Dropdown/Select-specific styling
  dropdownHoverColor?: string; // Background color when hovering over options
  dropdownSelectedColor?: string; // Background color for selected option
  dropdownOptionTextColor?: string; // Text color for dropdown options
  dropdownOptionPadding?: string; // Padding for dropdown options
  dropdownMaxHeight?: string; // Maximum height for dropdown list
  dropdownBorderColor?: string; // Border color for dropdown list
  dropdownShadow?: string; // Box shadow for dropdown list
  
  // Legacy Tailwind support (for backward compatibility)
  fontSize?: string; // deprecated, use labelFontSize/inputFontSize
  columnGap?: string; // for layout containers
  rowGap?: string; // for layout containers
}

export type FormFieldType = 
  | 'text'
  | 'longtext'
  | 'email'
  | 'phone'
  | 'number'
  | 'postal'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'separator';

export type LayoutType = 'single-column' | 'two-column-left' | 'two-column-right' | 'standalone';

export type LayoutPosition = LayoutType;

export interface SubmitButton {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: 'full' | 'auto';
  alignment?: 'left' | 'center' | 'right';
}

export interface CustomFont {
  id: string;
  name: string;
  url: string;
  fontFamily: string; // The actual CSS font-family value to use
}

export interface FormDesign {
  backgroundColor?: string;
  fontFamily?: string;
  customFontFamily?: string;
  customFonts?: CustomFont[]; // Array of custom font links
  fontSize?: string;
  spacing?: {
    container?: string;
    fields?: string;
    columnGap?: string;
    rowGap?: string;
  };
  logoUrl?: string;
  maxWidth?: string;
  padding?: string;
  borderRadius?: string;
  boxShadow?: string;
  submitButton?: SubmitButton;
}

export interface LayoutContainer {
  id: string;
  type: 'single-column' | 'two-column';
  fields: string[]; // field IDs
  leftFields?: string[]; // for two-column
  rightFields?: string[]; // for two-column
  style?: ContainerStyle;
}

export interface ContainerStyle {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
}

export interface ConditionalLogic {
  dependsOn: string; // field ID that this field depends on
  condition: 'equals' | 'not_equals' | 'contains' | 'checked' | 'not_checked';
  value?: string | boolean;
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  fileTypes?: string[];
  maxFileSize?: number; // in MB
  postalFormat?: 'US' | 'UK' | 'CA' | 'IN' | 'custom';
  customPattern?: string;
  // Date validation
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'custom';
  customDateFormat?: string;
  minAge?: number; // minimum age in years
  maxAge?: number; // maximum age in years
  minDate?: string; // minimum date in YYYY-MM-DD format
  maxDate?: string; // maximum date in YYYY-MM-DD format
  
  // Custom error messages for different validation types
  requiredMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  minMessage?: string;
  maxMessage?: string;
  patternMessage?: string;
  emailMessage?: string;
  phoneMessage?: string;
  fileSizeMessage?: string;
  fileTypeMessage?: string;
  dateFormatMessage?: string;
  minDateMessage?: string;
  maxDateMessage?: string;
  minAgeMessage?: string;
  maxAgeMessage?: string;
}

export interface SelectOption {
  id: string;
  label: string;
  value: string;
}

export interface TextFieldData extends FormFieldBase {
  type: 'text';
}

export interface LongTextFieldData extends FormFieldBase {
  type: 'longtext';
  rows?: number;
}

export interface EmailFieldData extends FormFieldBase {
  type: 'email';
}

export interface PhoneFieldData extends FormFieldBase {
  type: 'phone';
}

export interface NumberFieldData extends FormFieldBase {
  type: 'number';
}

export interface PostalFieldData extends FormFieldBase {
  type: 'postal';
}

export interface DropdownFieldData extends FormFieldBase {
  type: 'dropdown';
  options: SelectOption[];
}

export interface RadioFieldData extends FormFieldBase {
  type: 'radio';
  options: SelectOption[];
}

export interface CheckboxFieldData extends FormFieldBase {
  type: 'checkbox';
}

export interface FileFieldData extends FormFieldBase {
  type: 'file';
  accept?: string;
  multiple?: boolean;
}

export interface SeparatorFieldData extends FormFieldBase {
  type: 'separator';
}

export interface DateFieldData extends FormFieldBase {
  type: 'date';
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'custom';
  customDateFormat?: string;
}

export type FormFieldData = 
  | TextFieldData
  | LongTextFieldData
  | EmailFieldData
  | PhoneFieldData
  | NumberFieldData
  | PostalFieldData
  | DateFieldData
  | DropdownFieldData
  | RadioFieldData
  | CheckboxFieldData
  | FileFieldData
  | SeparatorFieldData;

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldData[];
  layout: LayoutConfig;
  containers?: LayoutContainer[];
  design?: FormDesign;
}

export interface LayoutConfig {
  type: 'single' | 'two-column';
  columns?: ColumnConfig[];
}

export interface ColumnConfig {
  id: string;
  width: number; // percentage
  fields: string[]; // field IDs
}
