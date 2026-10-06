import {brand as selectedBrand, invoiceLogoDataUri} from '../../brand';

const escapeHtml = value =>
  String(value ?? '').replace(
    /[&<>"']/g,
    char =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char]),
  );

const isPendingValue = value =>
  typeof value === 'string' && value.includes('PENDING_CLIENT_CONFIRMATION');

export const generateInvoiceHtml = async (
  values,
  date,
  brand = selectedBrand,
  logoDataUri = invoiceLogoDataUri,
) => {
  const {
    billTo,
    invoiceNo,
    customerAddress,
    discount,
    vat,
    other,
    tasks,
    companyName,
    bankAccount,
    email,
    phone,
    specialInstructions,
    specialInstructionsText,
    website,
    note,
  } = values;

  const company = brand.company;
  const invoice = brand.invoice;
  const formatMoney = amount =>
    new Intl.NumberFormat(invoice.locale, {
      style: 'currency',
      currency: invoice.currency,
    }).format(Number(amount) || 0);

  const subTotal = tasks
    .reduce((sum, task) => {
      const taskQuantity = parseFloat(task.quantity) || 0;
      const taskUnitPrice = parseFloat(task.unitPrice) || 0;
      return sum + taskQuantity * taskUnitPrice;
    }, 0)
    .toFixed(2);

  const total = (
    parseFloat(subTotal) -
    Math.abs(parseFloat(discount) || 0) +
    (parseFloat(vat) || 0) +
    (parseFloat(other) || 0)
  ).toFixed(2);

  const taskRows = tasks
    .map(task => {
      const taskQuantity = parseFloat(task.quantity) || 0;
      const taskUnitPrice = parseFloat(task.unitPrice) || 0;
      const taskSubTotal = (taskQuantity * taskUnitPrice).toFixed(2);
      return `
      <tr class="tableRow">
        <td class="tableCell">${escapeHtml(task.description)}</td>
        <td class="tableCell">${taskQuantity}</td>
        <td class="tableCell">${formatMoney(taskUnitPrice)}</td>
        <td class="tableCell">${formatMoney(taskSubTotal)}</td>
      </tr>
    `;
    })
    .join('');

  return `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px 60px;
        line-height: 1.3;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        min-height: 95vh;
      }
      .container {
        padding: 0 10px;
        flex: 1;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .header img {
        width: 100px;
      }
      h1 {
        margin: 0;
        font-size: 52px;
        font-weight: bold;
        color: ${invoice.colors.heading};
        margin-bottom:20px;
      }
      .company-info {
        text-align: center;
        font-size: 12px;
      }
      .company-logo{
        text-align: center;
        font-size: 12px;
      }
      .bill-to {
        margin: 20px 0;
      }
      .bill-to p {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      table,
      th,
      td {
        border: 1px solid black;
      }
      th,
      td {
        padding: 8px 12px;
        text-align: center;
        font-size: 14px;
      }
      th {
        font-weight: bold;
        background-color: #f2f2f2;
      }
      tfoot tr td:first-child {
        border: none;
      }
      .special-instructions {
        margin-top: 20px;
        font-size: 14px;
        font-weight: bold;
      }
      .special-instructions .spacer {
        margin-top: 20px;
        height: 40px;
      }
      .payment-instructions {
        margin-top: 30px;
        text-align: left;
        font-size: 14px;
        line-height: 1.35;
      }
      .payment-instructions p {
        margin: 0 0 5px;
        overflow-wrap: anywhere;
      }
      .note {
        margin-top: 20px;
        text-align: left;
        font-size: 14px;
        line-height: 1.35;
      }
      .footer {
        width: 100%;
        text-align: center;
        padding: 10px 0;
        margin-top: auto; 
        color: ${invoice.colors.heading}
      }
      .line {
        border-top: 2px solid black;
        margin: 10px 250px 30px 0;
      }
      strong {
        font-weight: bold;
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between; 
        align-items: left; 
        margin-bottom: 5px;
      }
      .row p:first-child {
        margin: 0;
        min-width: 100px;
      }
      .row p:last-child {
        margin: 0;
        flex-grow: 1;
        text-align: left;
        max-width: 200px
      }
      .right-align {
        text-align: right;
      }
      .left-align {
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div>
          <h1>${escapeHtml(invoice.title)}</h1>
          
          <div>
            <div class="row" >
              <p>Date: </p>
              <p><strong>${date.format('DD/MM/YYYY')}</strong></p>
            </div>
            
            <div class="row" >
              <p>Invoice No: </p>
              <p><strong>${escapeHtml(invoiceNo)}</strong></p>
            </div>

            <!-- Bill To Section -->
            <div>
            <div class="row" >
              <p>Bill To: </p>
              <p><strong>${escapeHtml(billTo)}</strong></p>
            </div>

            <div class="row" >
              <p> </p>
              <p> <strong>${escapeHtml(customerAddress)}</strong></p>
            </div>
          </div>
        </div>
        </div>
        <div class="company-info">
        ${
          companyName
            ? `
            <div class="company-logo">
              <img src="${logoDataUri}" alt="Company Logo" />
              <h3 style="color:${invoice.colors.tagline}">${escapeHtml(
                company.tagline,
              )}</h3>
              ${
                company.address && !isPendingValue(company.address)
                  ? `<p>${escapeHtml(company.address)}</p>`
                  : ''
              }
            </div>
            `
            : ''
        }
          <div class="left-align">
            ${
              phone
                ? `
                <p>Phone: ${escapeHtml(company.contact.phone)}</p>
                `
                : ''
            }
            ${
              email
                ? `
                <p>Email: ${escapeHtml(company.contact.email)}</p>
                `
                : ''
            }
            ${
              website
                ? `
                <p>Web:<a href="${escapeHtml(
                  company.contact.website,
                )}">${escapeHtml(company.contact.website)}</a></p>
                `
                : ''
            }
          </div>
        </div>
      </div>
        <!-- Table Section -->
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${taskRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right">Sub Total</td>
                <td>${formatMoney(subTotal)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right">${escapeHtml(
                  invoice.taxLabel,
                )}</td>
                <td>${formatMoney(vat)}</td>
              </tr>
              ${
                Number(discount) > 0
                  ? `<tr><td colspan="3" style="text-align: right">Discount</td><td>-${formatMoney(
                      discount,
                    )}</td></tr>`
                  : ''
              }
              ${
                Number(other) > 0
                  ? `<tr><td colspan="3" style="text-align: right">Other</td><td>${formatMoney(
                      other,
                    )}</td></tr>`
                  : ''
              }
              <tr>
                <td colspan="3" style="text-align: right"><strong>Total</strong></td>
                <td><strong>${formatMoney(total)}</strong></td>
              </tr>
            </tfoot>
          </table>

        <!-- Special Instructions -->
        <div class="special-instructions">
        ${
          specialInstructions
            ? `
            <p style="margin-bottom: 10px">Special Instruction</p>
            <p style="margin-bottom: 30px">${escapeHtml(
              specialInstructionsText,
            )}</p>
            `
            : ''
        }
        </div>

          <!-- Payment Info -->
          <div class="payment-instructions">
            ${
              companyName
                ? `
                <p class="payment-row">${escapeHtml(
                  invoice.paymentInstruction,
                )} <strong>${escapeHtml(company.name)}</strong></p>
                `
                : ''
            }
            ${
              bankAccount
                ? `
                <p class="payment-row">${escapeHtml(
                  company.banking.label,
                )}:</p>
                ${company.banking.details
                  .map(
                    detail =>
                      `<p class="payment-row">${escapeHtml(
                        detail.label,
                      )}: <strong>${escapeHtml(detail.value)}</strong></p>`,
                  )
                  .join('')}
                `
                : ''
            }
            ${
              email
                ? `
                <p class="payment-row">
                  If you have any questions concerning this invoice, 
                  contact <strong>${escapeHtml(company.contact.email)}</strong>
                </p>
                `
                : ''
            }
          </div>

          <div class="note">
            ${
              note
                ? `
                <p>
                  ${escapeHtml(invoice.defaultNote)}
                </p>
                `
                : ''
            }
          </div>
        </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>Thank You</strong></p>
        <p>${escapeHtml(invoice.footerMessage)}</p>
        ${
          companyName && !isPendingValue(company.registrationNumber)
            ? `<p>${escapeHtml(company.name)} - Company Number : ${escapeHtml(
                company.registrationNumber,
              )}</p>`
            : ''
        }
      </div>
  </body>
</html>

  `;
};
