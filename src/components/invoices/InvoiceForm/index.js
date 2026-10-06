import dayjs from 'dayjs';
import React, {useState} from 'react';
import InvoiceModal from '../InvoiceModal';
import InvoiceFormView from './InvoiceFormView';
import {generatePDF, printPDF, sharePDF} from '../../../services/invoices';

const InvoiceForm = () => {
  const [date, setDate] = useState(dayjs());
  const [visible, setVisible] = useState(false);
  const [invoiceValues, setInvoiceValues] = useState({});

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePrint = async () => {
    await printPDF(invoiceValues, date);
    hideModal();
  };

  const handleShare = async () => {
    const filePath = await generatePDF(invoiceValues, date);
    if (filePath) {
      await sharePDF(filePath);
    }
  };

  const handleSave = values => {
    setInvoiceValues(values);
    showModal();
  };

  return (
    <>
      <InvoiceFormView handleSave={handleSave} date={date} setDate={setDate} />
      <InvoiceModal
        visible={visible}
        hideModal={hideModal}
        invoiceValues={invoiceValues}
        handlePrint={handlePrint}
        handleShare={handleShare}
      />
    </>
  );
};

export default InvoiceForm;
