import {Alert} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Share from 'react-native-share';
import {generateInvoiceHtml} from './template';

/**
 * Generate PDF from invoice values
 * @param {object} values - Invoice form values
 * @param {object} date - Date object
 * @returns {Promise<string>} - File path of generated PDF
 */
export const generatePDF = async (values, date) => {
  const htmlContent = await generateInvoiceHtml(values, date);

  try {
    const pdfOptions = {
      html: htmlContent,
      fileName: `invoice - ${values.billTo}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);
    const filePath = file.filePath || '';
    return filePath;
  } catch (error) {
    Alert.alert('PDF generation error:', error.message || String(error));
    throw error;
  }
};

/**
 * Print PDF directly
 * @param {object} values - Invoice form values
 * @param {object} date - Date object
 */
export const printPDF = async (values, date) => {
  try {
    const htmlContent = await generateInvoiceHtml(values, date);

    const jobName = await RNPrint.print({
      html: htmlContent,
    });

    Alert.alert('Invoice Saved Successfully', `File Name: ${jobName}`);
    return jobName;
  } catch (error) {
    Alert.alert('Error printing PDF', error.message || String(error));
    throw error;
  }
};

/**
 * Share PDF file
 * @param {string} filePath - Path to PDF file
 */
export const sharePDF = async filePath => {
  if (!filePath) {
    Alert.alert('Error', 'No file to share');
    return;
  }

  try {
    await Share.open({
      title: 'Share PDF',
      url: `file://${filePath}`,
      type: 'application/pdf',
      message: 'Here is your PDF invoice!',
    });
  } catch (error) {
    if (error?.message !== 'User did not share') {
      Alert.alert('Error sharing PDF:', error.message || String(error));
    }
  }
};

