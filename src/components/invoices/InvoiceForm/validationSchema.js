import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  invoiceNo: Yup.string().required('Invoice No is required'),
  billTo: Yup.string().required('Bill To is required'),
  discount: Yup.number(),
  vat: Yup.number().min(0, 'VAT cannot be negative'),
  tasks: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('Description is required'),
      quantity: Yup.number()
        .min(0.5, 'Quantity must be at least 0.5')
        .required('Quantity is required'),
      unitPrice: Yup.number()
        .min(0, 'Unit Price cannot be negative')
        .required('Unit Price is required'),
    }),
  ),
  specialInstructions: Yup.boolean(),
  specialInstructionsText: Yup.string().when('specialInstructions', {
    is: val => val === true,
    then: schema => schema.required('Special Instructions text is required'),
    otherwise: schema => schema.notRequired(),
  }),
});
