import {computeTotals, sanitizeTasks} from '../src/services/invoices/utils';

describe('invoice utils', () => {
  it('computes totals with discounts and extras', () => {
    const values = {
      tasks: [
        {quantity: 2, unitPrice: 50},
        {quantity: 1, unitPrice: 100},
      ],
      discount: 20,
      vat: 10,
      other: 5,
    };

    const {subTotal, total} = computeTotals(values);

    expect(subTotal).toBe(200);
    expect(total).toBe(195);
  });

  it('sanitizes invalid task values', () => {
    const tasks = sanitizeTasks([
      {quantity: '3', unitPrice: '10.5'},
      {quantity: undefined, unitPrice: undefined},
    ]);

    expect(tasks[0].quantity).toBe(3);
    expect(tasks[0].unitPrice).toBe(10.5);
    expect(tasks[1].quantity).toBe(0);
    expect(tasks[1].unitPrice).toBe(0);
  });
});
