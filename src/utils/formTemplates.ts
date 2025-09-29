import { FormFieldData, FormDesign } from '@/types/form';

/**
 * Form templates that match common design patterns
 */

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  title: string;
  description_text: string;
  design: FormDesign;
  fields: FormFieldData[];
  containers: Array<{
    id: string;
    type: 'single' | 'two-column';
    leftFields: string[];
    rightFields: string[];
  }>;
}

/**
 * "Enter Now" template that matches the target design from the image
 */
export const ENTER_NOW_TEMPLATE: FormTemplate = {
  id: 'enter-now',
  name: 'Enter Now Contest Form',
  description: 'Professional contest entry form with two-column layout',
  title: 'ENTER NOW',
  description_text: '',
  design: {
    backgroundColor: '#ffffff',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    spacing: { 
      container: 'p-8',
      fields: 'space-y-6', 
      columnGap: '1.5rem', 
      rowGap: '1.5rem' 
    },
    logoUrl: '',
    padding: 'p-8',
    maxWidth: 'max-w-4xl',
    borderRadius: 'rounded-lg',
    boxShadow: 'shadow-sm',
    submitButton: {
      text: 'SUBMIT',
      backgroundColor: '#dc2626',
      textColor: '#ffffff',
      padding: '16px 48px',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 'bold',
      width: 'auto',
      alignment: 'center',
    },
  },
  fields: [
    {
      id: 'first-name',
      type: 'text',
      label: 'First Name*',
      placeholder: '',
      required: true,
      style: {
        inputBorderColor: '#374151',
        inputBorderWidth: '2px',
        inputHeight: '48px',
        inputFontSize: '16px',
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'last-name',
      type: 'text',
      label: 'Last Name*',
      placeholder: '',
      required: true,
      style: {
        inputBorderColor: '#374151',
        inputBorderWidth: '2px',
        inputHeight: '48px',
        inputFontSize: '16px',
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'date-of-birth',
      type: 'date',
      label: 'Date of Birth* (MM/DD/YYYY)',
      placeholder: '',
      required: true,
      validation: {
        dateFormat: 'MM/DD/YYYY'
      },
      style: {
        inputBorderColor: '#374151',
        inputBorderWidth: '2px',
        inputHeight: '48px',
        inputFontSize: '16px',
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'email-address',
      type: 'email',
      label: 'Email Address*',
      placeholder: '',
      required: true,
      style: {
        inputBorderColor: '#374151',
        inputBorderWidth: '2px',
        inputHeight: '48px',
        inputFontSize: '16px',
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'postal-code',
      type: 'postal' as any,
      label: 'Postal Code*',
      placeholder: '',
      required: true,
      validation: {
        postalFormat: 'US'
      },
      style: {
        inputBorderColor: '#374151',
        inputBorderWidth: '2px',
        inputHeight: '48px',
        inputFontSize: '16px',
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'upload-receipt',
      type: 'file',
      label: 'Upload Receipt Image*',
      placeholder: '',
      required: true,
      validation: {
        fileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
        maxFileSize: 10
      },
      style: {
        inputBorderColor: '#374151',
        inputBorderWidth: '2px',
        inputHeight: '48px',
        inputFontSize: '16px',
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'scene-member',
      type: 'checkbox',
      label: 'Are you a Scene+ member?',
      required: false,
      style: {
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    },
    {
      id: 'contractor',
      type: 'checkbox',
      label: 'Are you a contractor?',
      required: false,
      style: {
        labelFontSize: '16px',
        labelColor: '#111827',
        marginBottom: '20px',
      }
    }
  ],
  containers: [
    {
      id: 'main-container',
      type: 'two-column',
      leftFields: ['first-name', 'date-of-birth', 'postal-code', 'scene-member'],
      rightFields: ['last-name', 'email-address', 'upload-receipt', 'contractor']
    }
  ]
};

/**
 * Get all available form templates
 */
export function getFormTemplates(): FormTemplate[] {
  return [
    ENTER_NOW_TEMPLATE,
    // Add more templates here in the future
  ];
}

/**
 * Apply a template to the form builder
 */
export function applyFormTemplate(template: FormTemplate) {
  return {
    title: template.title,
    description: template.description_text,
    design: template.design,
    fields: template.fields,
    containers: template.containers,
  };
}
