import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {computeTotals, sanitizeTasks} from '../../../services/invoices/utils';
import {brand} from '../../../brand';

const InvoiceModal = ({
  visible = true,
  hideModal,
  invoiceValues,
  handlePrint,
  handleShare,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const formatMoney = amount =>
    new Intl.NumberFormat(brand.invoice.locale, {
      style: 'currency',
      currency: brand.invoice.currency,
    }).format(Number(amount) || 0);
  const {
    date,
    invoiceNo,
    billTo,
    customerAddress,
    discount,
    vat,
    other,
    tasks,
    companyName,
    bankAccount,
    phone,
    email,
  } = invoiceValues;

  const sanitizedTasks = sanitizeTasks(tasks);
  const {subTotal, total} = computeTotals({
    tasks: sanitizedTasks,
    discount,
    vat,
    other,
  });
  const taglineText = brand.company.tagline;

  return (
    <>
      {visible && (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
            <View style={styles.contentWrapper}>
              <Icon
                name="close"
                style={styles.closeIcon}
                size={22}
                onPress={hideModal}
                accessibilityLabel="Close invoice preview"
              />
              <ScrollView>
                <View style={styles.invoiceContainer}>
                  <View style={styles.invoiceLeft}>
                    <Text style={styles.title}>
                      {brand.invoice.title.toUpperCase()}
                    </Text>
                    {companyName && (
                      <>
                        <Text style={styles.businessName}>
                          {brand.company.name}
                        </Text>
                        <Text style={styles.tagline}>{taglineText}</Text>
                      </>
                    )}
                  </View>
                  <View style={styles.invoiceRightWithIcons}>
                    <View style={styles.iconTextRow}>
                      <Text>{new Date(date).toLocaleDateString()}</Text>
                      <Icon name="calendar-today" style={styles.icon} />
                    </View>
                    <View style={styles.iconTextRow}>
                      <Text>Invoice No: {invoiceNo}</Text>
                      <Icon name="receipt" style={styles.icon} />
                    </View>
                    <View style={styles.iconTextRow}>
                      <Text>Bill To: {billTo}</Text>
                      <Icon name="person" style={styles.icon} />
                    </View>
                    <View style={styles.iconTextRow}>
                      <Text>Address: {customerAddress}</Text>
                      <Icon name="home" style={styles.icon} />
                    </View>
                  </View>
                </View>

                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    {['Description', 'Quantity', 'Unit Price', 'Amount'].map(
                      (header, index) => (
                        <Text key={index} style={styles.tableHeaderText}>
                          {header}
                        </Text>
                      ),
                    )}
                  </View>
                  {sanitizedTasks?.map(task => (
                    <View key={task.id} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{task.description}</Text>
                      <Text style={styles.tableCell}>{task.quantity}</Text>
                      <Text style={styles.tableCell}>
                        {formatMoney(task.unitPrice)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {formatMoney(task.quantity * task.unitPrice)}
                      </Text>
                    </View>
                  ))}
                  {[
                    {label: 'SubTotal', value: subTotal.toFixed(2)},
                    {
                      label: brand.invoice.taxLabel,
                      value: parseFloat(vat).toFixed(2),
                    },
                    {label: 'Total', value: total.toFixed(2), isTotal: true},
                  ].map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell} />
                      <Text style={styles.tableCell} />
                      <Text
                        style={[
                          styles.tableCell,
                          styles.summaryLabel,
                          item.isTotal && styles.boldText,
                        ]}>
                        {item.label}:
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          styles.summaryValue,
                          item.isTotal && styles.boldText,
                        ]}>
                        {formatMoney(item.value)}
                      </Text>
                    </View>
                  ))}
                </View>

                {bankAccount && (
                  <View style={styles.paymentInfo}>
                    <Text>{brand.company.banking.label}</Text>
                    {brand.company.banking.details.map(detail => (
                      <Text key={detail.label}>
                        {detail.label}: {detail.value}
                      </Text>
                    ))}
                  </View>
                )}

                <Text style={styles.thankYouText}>Thank you!</Text>
                <Text style={styles.footerCopy}>
                  {brand.invoice.footerMessage}
                </Text>
                {(email || phone) && (
                  <View style={styles.contactFooter}>
                    <View style={styles.contactInfo}>
                      {email && (
                        <View style={styles.contactFooterText}>
                          <Icon name="email" style={styles.footerIcon} />
                          <Text>{brand.company.contact.email}</Text>
                        </View>
                      )}
                      {phone && (
                        <View style={styles.contactFooterText}>
                          <Icon name="phone" style={styles.footerIcon} />
                          <Text>{brand.company.contact.phone}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    style={styles.button}
                    onPress={handlePrint}>
                    Save
                  </Button>
                  <Button
                    mode="outlined"
                    style={styles.button}
                    onPress={handleShare}>
                    Share
                  </Button>
                </View>
                <Button
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('Home');
                  }}>
                  Back to Home
                </Button>
              </ScrollView>
            </View>
          </Modal>
        </Portal>
      )}
    </>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    contentWrapper: {
      maxHeight: 750,
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 10,
    },
    invoiceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    invoiceLeft: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    businessName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 2,
    },
    tagline: {
      fontSize: 14,
      fontStyle: 'italic',
      color: theme.colors.textMuted,
    },
    invoiceRightWithIcons: {
      marginTop: 10,
      flex: 1,
      justifyContent: 'flex-end',
    },
    iconTextRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    icon: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.colors.textMuted,
    },
    closeIcon: {
      alignSelf: 'flex-end',
      marginLeft: 10,
      marginBottom: 5,
    },
    table: {
      marginVertical: 20,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 5,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
      paddingVertical: 10,
      paddingHorizontal: 5,
      justifyContent: 'space-between',
    },
    tableHeaderText: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    tableCell: {
      flex: 1,
      fontSize: 12,
      textAlign: 'center',
    },
    summaryLabel: {
      fontSize: 14,
      textAlign: 'center',
    },
    summaryValue: {
      fontSize: 14,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    boldText: {
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    paymentInfo: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 5,
    },
    thankYouText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
    },
    footerCopy: {
      textAlign: 'center',
    },
    contactFooter: {
      marginVertical: 20,
      padding: 10,
      borderRadius: 5,
    },
    contactInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    contactFooterText: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    footerIcon: {
      marginRight: 8,
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
    },
    button: {
      width: 160,
    },
  });

export default InvoiceModal;
