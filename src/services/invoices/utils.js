import dayjs from 'dayjs';

const safeNumber = value => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const createTask = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
});

export const sanitizeTasks = tasks =>
  (tasks || []).map(task => ({
    ...task,
    id: task.id || createTask().id,
    quantity: safeNumber(task.quantity),
    unitPrice: safeNumber(task.unitPrice),
  }));

export const computeSubTotal = tasks =>
  sanitizeTasks(tasks).reduce(
    (sum, task) => sum + safeNumber(task.quantity) * safeNumber(task.unitPrice),
    0,
  );

export const computeTotals = ({tasks, discount, vat, other}) => {
  const subTotal = computeSubTotal(tasks);
  const discountValue = safeNumber(discount);
  const vatValue = safeNumber(vat);
  const otherValue = safeNumber(other);

  return {
    subTotal,
    total: subTotal - discountValue + vatValue + otherValue,
  };
};

export const normalizeInvoiceValues = (values, date) => {
  const safeValues = {
    ...values,
    discount: safeNumber(values.discount),
    vat: safeNumber(values.vat),
    other: safeNumber(values.other),
    tasks: sanitizeTasks(values.tasks),
  };

  if (!safeValues.date) {
    safeValues.date = dayjs(date ?? new Date()).toDate();
  }

  return safeValues;
};
