export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormFieldBase {
  id: string;
  name: string; // HTML name attribute for form submission
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: string | number | boolean;
  validation?: ValidationRule;
  layout?: LayoutPosition;
  width: 'w-full' | 'w-1/2'; // Field width: full width or half width (for two-column)
  style?: FieldStyle;
  options?: FieldOption[];
  rows?: number;
  conditionalLogic?: ConditionalLogic;
  tooltip?: string; // Help text shown on hover
  // Additional metadata
  helpText?: string;
  order?: number; // For field ordering
  groupId?: string; // For field grouping
}

export interface FieldStyle {
  label?: {
    color?: string; // e.g., "#333333"
    fontWeight?: number; // e.g., 400, 500, 600, 700
    fontSize?: string; // e.g., "14px", "1rem"
    textAlign?: 'left' | 'center' | 'right';
    marginBottom?: string; // e.g., "4px", "0.25rem"
    position?: 'outside' | 'inside' | 'hidden';
  };
  
  input?: {
    color?: string; // text color e.g., "#333333"
    backgroundColor?: string; // e.g., "#ffffff"
    borderColor?: string; // e.g., "#d1d5db"
    borderWidth?: string; // e.g., "1px", "2px"
    borderRadius?: string; // e.g., "4px", "8px"
    padding?: string; // e.g., "8px 12px"
    height?: string; // e.g., "40px", "2.5rem"
    fontSize?: string; // e.g., "14px", "1rem"
    focusBorderColor?: string; // focus border color e.g., "#3b82f6"
    focusBoxShadow?: string; // e.g., "0 0 0 3px rgba(59, 130, 246, 0.1)"
  };
  
  container?: {
    marginBottom?: string; // e.g., "16px", "1rem"
    width?: string; // e.g., "100%", "50%"
  };
  
  // Checkbox specific (legacy support)
  checkboxAlignment?: 'left' | 'right';
  checkboxText?: string;
  
  // Icon (legacy support)
  icon?: 'mail' | 'phone' | 'user' | 'lock';
  
  // Legacy properties for backward compatibility
  labelColor?: string;
  labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  labelAlignment?: 'left' | 'center' | 'right';
  labelPosition?: 'outside' | 'inside' | 'hidden';
  labelFontSize?: string;
  labelMarginBottom?: string;
  inputTextColor?: string;
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputBorderWidth?: string;
  inputBorderRadius?: string;
  inputPadding?: string;
  inputHeight?: string;
  inputFontSize?: string;
  inputFocusColor?: string;
  marginBottom?: string;
  width?: string;
  
  // Checkbox styling properties
  checkboxStyle?: 'default' | 'bordered';
  checkboxBorderColor?: string;
  checkboxBorderWidth?: string;
  checkboxBorderRadius?: string;
  checkboxBackgroundColor?: string;
  checkboxPadding?: string;
  
  // Dropdown styling properties
  dropdownHoverColor?: string;
  dropdownSelectedColor?: string;
  dropdownOptionTextColor?: string;
  dropdownOptionPadding?: string;
  dropdownMaxHeight?: string;
  dropdownBorderColor?: string;
  dropdownShadow?: string;
}

export type FormFieldType = 
  | 'text'
  | 'longtext'
  | 'richtext'
  | 'email'
  | 'phone'
  | 'number'
  | 'postal'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'separator'
  | 'terms';

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

export interface RichTextFieldData extends FormFieldBase {
  type: 'richtext';
  minHeight?: string;
  maxHeight?: string;
  toolbar?: 'basic' | 'full' | 'minimal';
  allowLinks?: boolean;
  allowFormatting?: boolean;
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
  useRichText?: boolean;
  richTextContent?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface FileFieldData extends FormFieldBase {
  type: 'file';
  accept?: string;
  multiple?: boolean;
}

export interface SeparatorFieldData extends FormFieldBase {
  type: 'separator';
  separatorType?: 'line' | 'space' | 'text';
  separatorText?: string;
  separatorHeight?: string;
}

export interface TermsLink {
  id: string;
  text: string;
  url: string;
}

export interface TermsFieldData extends FormFieldBase {
  type: 'terms';
  mode: 'checkbox' | 'radio' | 'text';
  content: string;
  links: TermsLink[];
}

export interface DateFieldData extends FormFieldBase {
  type: 'date';
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'custom';
  customDateFormat?: string;
}

export type FormFieldData = 
  | TextFieldData
  | LongTextFieldData
  | RichTextFieldData
  | EmailFieldData
  | PhoneFieldData
  | NumberFieldData
  | PostalFieldData
  | DateFieldData
  | DropdownFieldData
  | RadioFieldData
  | CheckboxFieldData
  | FileFieldData
  | SeparatorFieldData
  | TermsFieldData;

export interface FormSchema {
  id: string;
  name: string; // HTML form name attribute
  title: string;
  description?: string;
  fields: FormFieldData[];
  layout: LayoutConfig;
  containers?: LayoutContainer[];
  design?: FormDesign;
  // Form metadata
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  // Form behavior
  method?: 'GET' | 'POST';
  action?: string; // Form submission URL
  enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
  target?: '_self' | '_blank' | '_parent' | '_top';
  // Form settings
  allowDrafts?: boolean;
  autoSave?: boolean;
  showProgress?: boolean;
  confirmBeforeSubmit?: boolean;
  redirectUrl?: string; // Redirect after successful submission
  // Validation
  validateOnSubmit?: boolean;
  validateOnChange?: boolean;
  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
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
