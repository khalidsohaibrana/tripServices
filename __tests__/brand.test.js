import dayjs from 'dayjs';
import {generateInvoiceHtml} from '../src/services/invoices/template';
import trip from '../brands/trip-services/config.json';
import {validate} from '../scripts/brand';

describe('brand configuration', () => {
  it('validates the existing brand and its assets', async () => {
    await expect(validate('trip-services')).resolves.toMatchObject({
      androidApplicationId: 'com.tripservices',
    });
  });

  it('renders a different brand without old company details or currency', async () => {
    const otherBrand = {
      ...trip,
      company: {
        ...trip.company,
        name: 'Example Company',
        tagline: 'Example services',
        contact: {...trip.company.contact, email: 'hello@example.com'},
        banking: {label: 'Payment', details: [{label: 'IBAN', value: 'EX123'}]},
      },
      invoice: {
        ...trip.invoice,
        currency: 'EUR',
        locale: 'de-DE',
        taxLabel: 'Tax',
      },
    };
    const values = {
      billTo: '<Customer>',
      invoiceNo: 'A-1',
      customerAddress: 'Example Road',
      tasks: [{description: '<Service>', quantity: 2, unitPrice: 10}],
      discount: 1,
      vat: 2,
      other: 3,
      companyName: true,
      bankAccount: true,
      email: true,
    };
    const html = await generateInvoiceHtml(
      values,
      dayjs('2026-10-06'),
      otherBrand,
      'data:image/png;base64,AA==',
    );

    expect(html).toContain('Example Company');
    expect(html).toContain('IBAN');
    expect(html).toContain('Tax');
    expect(html).toContain('€');
    expect(html).toContain('&lt;Customer&gt;');
    expect(html).toContain('&lt;Service&gt;');
    expect(html).not.toContain('Trip Electric');
    expect(html).not.toContain('£');
  });
});
