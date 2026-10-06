import * as Yup from 'yup';

const requiredText = fieldName =>
  Yup.string()
    .trim()
    .required(`${fieldName} is required`);

const optionalAmount = fieldName =>
  Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? undefined : value,
    )
    .typeError(`${fieldName} must be a valid number`)
    .min(0, `${fieldName} cannot be negative`);

const requiredAmount = fieldName =>
  optionalAmount(fieldName).required(`${fieldName} is required`);

export const validationSchema = Yup.object().shape({
  invoiceNo: requiredText('Invoice No'),
  billTo: requiredText('Customer Name'),
  customerAddress: requiredText('Customer Address'),
  discount: optionalAmount('Discount'),
  vat: optionalAmount('VAT'),
  other: optionalAmount('Other charges'),
  tasks: Yup.array()
    .min(1, 'At least one task is required')
    .of(
      Yup.object().shape({
        description: requiredText('Task description'),
        quantity: requiredAmount('Quantity')
        .min(0.5, 'Quantity must be at least 0.5')
        .max(9999, 'Quantity is too high'),
        unitPrice: requiredAmount('Unit Price').max(
          999999,
          'Unit Price is too high',
        ),
      }),
    ),
  specialInstructions: Yup.boolean(),
  specialInstructionsText: Yup.string().when('specialInstructions', {
    is: val => val === true,
    then: schema =>
      schema.trim().required('Special Instructions text is required'),
    otherwise: schema => schema.notRequired(),
  }),
});
