import {COMPANY_INFO} from '../../config/company';
import {companyLogoBase64} from './companyLogoBase64';

export const generateInvoiceHtml = async (values, date) => {
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

  const companyPhone = COMPANY_INFO.contact.phone;
  const companyEmail = COMPANY_INFO.contact.email;
  const companyWebsite = COMPANY_INFO.contact.website;
  const bankSortCode = COMPANY_INFO.banking.sortCode;
  const bankAccountNumber = COMPANY_INFO.banking.accountNumber;

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
        <td class="tableCell">${task.description || ''}</td>
        <td class="tableCell">${taskQuantity}</td>
        <td class="tableCell">£${taskUnitPrice.toFixed(2)}</td>
        <td class="tableCell">£${taskSubTotal}</td>
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
        line-height: 1;
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
        color: #00488f;
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
        margin-top: 60px; 
        text-align: left;
        font-size: 14px;
        line-height:0
      }
      .note {
        margin-top: 30px; 
        text-align: left;
        font-size: 14px;
        line-height:0;
      }
      .footer {
        width: 100%;
        text-align: center;
        padding: 10px 0;
        margin-top: auto; 
        color: #00488f
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
          <h1>Invoice</h1>
          
          <div>
            <div class="row" >
              <p>Date: </p>
              <p><strong>${date.format('DD/MM/YYYY')}</strong></p>
            </div>
            
            <div class="row" >
              <p>Invoice No: </p>
              <p><strong>${invoiceNo}</strong></p>
            </div>

            <!-- Bill To Section -->
            <div>
            <div class="row" >
              <p>Bill To: </p>
              <p><strong>${billTo}</strong></p>
            </div>

            <div class="row" >
              <p> </p>
              <p> <strong>${customerAddress}</strong></p>
            </div>
          </div>
        </div>
        </div>
        <div class="company-info">
        ${
          companyName
            ? `
            <div class="company-logo">
              <img src="${companyLogoBase64}" alt="Company Logo" />
              <h3 style="color:#fa9626">${COMPANY_INFO.tagline}</h3>
            </div>
            `
            : ''
        }
          <div class="left-align">
            ${
              phone
                ? `
                <p>Phone: ${companyPhone}</p>
                `
                : ''
            }
            ${
              email
                ? `
                <p>Email: ${companyEmail}</p>
                `
                : ''
            }
            ${
              website
                ? `
                <p>Web:<a href="${companyWebsite}">${companyWebsite}</a></p>
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
                <td>£${subTotal}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right">VAT</td>
                <td>£${parseFloat(vat).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right"><strong>Total</strong></td>
                <td><strong>£${total}</strong></td>
              </tr>
            </tfoot>
          </table>

        <!-- Special Instructions -->
        <div class="special-instructions">
        ${
          specialInstructions
            ? `
            <p style="margin-bottom: 10px">Special Instruction</p>
            <p style="margin-bottom: 30px">${specialInstructionsText}</p>
            `
            : ''
        }
        </div>

          <!-- Payment Info -->
          <div class="payment-instructions">
            ${
              companyName
                ? `
                <p>Make all payments to <strong>${COMPANY_INFO.name}</strong></p>
                `
                : ''
            }
            ${
              bankAccount
                ? `
                <p style="max-width: 200px flex-grow: 1">Sort Code: <strong>${bankSortCode}</strong> Account Number: <strong>${bankAccountNumber}</strong></p>
                `
                : ''
            }
            ${
              email
                ? `
                <p style="max-width: 100px flex-grow: 1">
                  If you have any questions concerning this invoice, 
                  contact <strong>${companyEmail}</strong>
                </p>
                `
                : ''
            }
          </div>

          <div>
            ${
              note
                ? `
                <p>
                  Please get a EICR as soon as possible by a qualified electrician.
                </p>
                `
                : ''
            }
          </div>
        </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>Thank You</strong></p>
        <p>We appreciate your business</p>
        ${
          companyName
            ? `<p>${COMPANY_INFO.name} - Company Number : ${COMPANY_INFO.registrationNumber}</p>`
            : ''
        }
      </div>
  </body>
</html>

  `;
};
