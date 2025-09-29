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
  labelColor?: string;
  labelWeight?: string;
  labelAlignment?: 'left' | 'center' | 'right';
  labelPosition?: 'outside' | 'inside' | 'hidden';
  inputBorderColor?: string;
  inputBorderWidth?: string;
  inputBorderRadius?: string;
  inputBackgroundColor?: string;
  inputFocusColor?: string;
  inputPadding?: string;
  inputHeight?: string;
  fontSize?: string;
  icon?: string;
  columnGap?: string;
  rowGap?: string;
  width?: string;
  marginBottom?: string;
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

export interface FormDesign {
  backgroundColor?: string;
  fontFamily?: string;
  customFontFamily?: string;
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
