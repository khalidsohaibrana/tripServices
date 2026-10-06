import React, {useCallback, useState} from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';
import {
  Button,
  TextInput,
  Text,
  IconButton,
  List,
  Divider,
  Checkbox,
  useTheme,
} from 'react-native-paper';
import {Formik} from 'formik';
import DateTimePicker from 'react-native-ui-datepicker';
import {validationSchema} from './validationSchema';
import {
  computeTotals,
  createTask,
  normalizeInvoiceValues,
} from '../../../services/invoices/utils';
import {brand} from '../../../brand';

const ADDITIONAL_FIELDS = [
  {label: 'Add company name', key: 'companyName'},
  {label: 'Add bank account', key: 'bankAccount'},
  {label: 'Add special instructions', key: 'specialInstructions'},
  {label: 'Add email', key: 'email'},
  {label: 'Add phone', key: 'phone'},
  {label: 'Add website', key: 'website'},
  {label: 'Add note', key: 'note'},
];

const createInitialValues = () => ({
  invoiceNo: '',
  billTo: '',
  customerAddress: '',
  discount: 0,
  vat: 0,
  other: 0,
  tasks: [createTask()],
  companyName: false,
  bankAccount: false,
  specialInstructions: false,
  specialInstructionsText: '',
  email: false,
  phone: false,
  website: false,
  note: false,
  openAccordion: false,
});

const InvoiceFormView = ({handleSave, date, setDate}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(0);
  const [initialValues] = useState(createInitialValues);
  const theme = useTheme();
  const styles = createStyles(theme);

  const addTask = useCallback((setFieldValue, tasks) => {
    setFieldValue('tasks', [...tasks, createTask()]);
  }, []);

  const handleTaskChange = useCallback(
    (setFieldValue, index, field, value, tasks) => {
      const updatedTasks = [...tasks];
      updatedTasks[index][field] = value;
      setFieldValue('tasks', updatedTasks);
    },
    [],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        const normalized = normalizeInvoiceValues(values, date);
        handleSave(normalized);
      }}
      validationSchema={validationSchema}>
      {({
        values,
        handleChange,
        errors,
        setFieldValue,
        handleSubmit,
        resetForm,
      }) => {
        const totals = computeTotals(values);
        const allChecked =
          values.companyName &&
          values.bankAccount &&
          values.specialInstructions &&
          values.email &&
          values.phone &&
          values.website &&
          values.note;

        const toggleAll = nextValue => {
          setFieldValue('companyName', nextValue);
          setFieldValue('bankAccount', nextValue);
          setFieldValue('specialInstructions', nextValue);
          setFieldValue('email', nextValue);
          setFieldValue('phone', nextValue);
          setFieldValue('website', nextValue);
          setFieldValue('note', nextValue);
          if (!nextValue) {
            setFieldValue('specialInstructionsText', '');
          }
        };

        return (
          <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Date</Text>
                <Button
                  onPress={() => setDatePickerVisible(true)}
                  mode="outlined"
                  style={styles.button}>
                  Select Date: {date.format('YYYY-MM-DD')}
                </Button>
                {isDatePickerVisible && (
                  <View style={styles.datePicker}>
                    <DateTimePicker
                      mode="single"
                      height={340}
                      date={date}
                      onChange={params => {
                        if (!params.date) {
                          return;
                        }
                        setDate(params.date);
                        setFieldValue('date', params.date);
                        setDatePickerVisible(false);
                      }}
                      selectedItemColor={theme.colors.primary}
                      headerButtonColor={theme.colors.text}
                      headerTextStyle={styles.datePickerHeaderText}
                      calendarTextStyle={styles.datePickerText}
                      weekDaysTextStyle={styles.datePickerWeekdayText}
                      selectedTextStyle={styles.datePickerSelectedText}
                      todayTextStyle={styles.datePickerTodayText}
                    />
                  </View>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Invoice No</Text>
                <TextInput
                  label="Invoice No"
                  value={values.invoiceNo}
                  onChangeText={handleChange('invoiceNo')}
                  error={!!errors.invoiceNo}
                  style={styles.input}
                />
                {errors.invoiceNo && (
                  <Text style={styles.errorText}>{errors.invoiceNo}</Text>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Customer</Text>
                <TextInput
                  label="Customer Name"
                  value={values.billTo}
                  onChangeText={handleChange('billTo')}
                  error={!!errors.billTo}
                  style={styles.input}
                />
                {errors.billTo && (
                  <Text style={styles.errorText}>{errors.billTo}</Text>
                )}
                <TextInput
                  label="Customer Address"
                  value={values.customerAddress}
                  onChangeText={handleChange('customerAddress')}
                  error={!!errors.customerAddress}
                  style={styles.input}
                />
                {errors.customerAddress && (
                  <Text style={styles.errorText}>{errors.customerAddress}</Text>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Tasks</Text>

                {values.tasks.map((task, index) => (
                  <View
                    key={task.id || index}
                    style={styles.accordionContainer}>
                    <List.Accordion
                      title={`Task ${index + 1}`}
                      expanded={openAccordionIndex === index}
                      onPress={() => {
                        setOpenAccordionIndex(
                          openAccordionIndex === index ? null : index,
                        );
                      }}>
                      <Divider style={styles.divider} />

                      <TextInput
                        label={`Task ${index + 1} Description`}
                        value={task.description}
                        onChangeText={text =>
                          handleTaskChange(
                            setFieldValue,
                            index,
                            'description',
                            text,
                            values.tasks,
                          )
                        }
                        style={styles.input}
                        error={
                          !!(errors.tasks && errors.tasks[index]?.description)
                        }
                      />
                      {errors.tasks && errors.tasks[index]?.description && (
                        <Text style={styles.errorText}>
                          {errors.tasks[index]?.description}
                        </Text>
                      )}

                      <View style={styles.quantityContainer}>
                        <IconButton
                          icon="minus"
                          size={20}
                          onPress={() =>
                            handleTaskChange(
                              setFieldValue,
                              index,
                              'quantity',
                              Math.max(0.5, task.quantity - 0.5),
                              values.tasks,
                            )
                          }
                        />
                        <TextInput
                          label="Quantity"
                          value={String(task.quantity)}
                          keyboardType="numeric"
                          style={[styles.quantityInput, styles.input]}
                          onChangeText={text =>
                            handleTaskChange(
                              setFieldValue,
                              index,
                              'quantity',
                              Number(text),
                              values.tasks,
                            )
                          }
                          error={
                            !!(errors.tasks && errors.tasks[index]?.quantity)
                          }
                        />
                        {errors.tasks && errors.tasks[index]?.quantity && (
                          <Text style={styles.errorText}>
                            {errors.tasks[index]?.quantity}
                          </Text>
                        )}

                        <IconButton
                          icon="plus"
                          size={20}
                          onPress={() =>
                            handleTaskChange(
                              setFieldValue,
                              index,
                              'quantity',
                              task.quantity + 0.5,
                              values.tasks,
                            )
                          }
                        />
                      </View>

                      <TextInput
                        label="Unit Price"
                        value={String(task.unitPrice)}
                        onChangeText={text =>
                          handleTaskChange(
                            setFieldValue,
                            index,
                            'unitPrice',
                            Number(text),
                            values.tasks,
                          )
                        }
                        keyboardType="numeric"
                        style={styles.input}
                        error={
                          !!(errors.tasks && errors.tasks[index]?.unitPrice)
                        }
                        right={<TextInput.Affix text={brand.invoice.currency} />}
                      />
                      {errors.tasks && errors.tasks[index]?.unitPrice && (
                        <Text style={styles.errorText}>
                          {errors.tasks[index]?.unitPrice}
                        </Text>
                      )}

                      {index !== 0 && (
                        <Button
                          mode="outlined"
                          onPress={() => {
                            const updatedTasks = values.tasks.filter(
                              (_, taskIndex) => taskIndex !== index,
                            );
                            setFieldValue('tasks', updatedTasks);
                          }}
                          style={styles.deleteButton}>
                          Delete Task
                        </Button>
                      )}
                    </List.Accordion>
                  </View>
                ))}

                <Button
                  onPress={() => addTask(setFieldValue, values.tasks)}
                  mode="contained"
                  style={styles.button}>
                  Add Task
                </Button>
              </View>

              <Text style={styles.sectionTitle}>Summary</Text>
              <TextInput
                label="Subtotal"
                value={totals.subTotal.toFixed(2)}
                editable={false}
                right={<TextInput.Affix text={brand.invoice.currency} />}
                style={styles.input}
              />
              <TextInput
                label={brand.invoice.taxLabel}
                value={String(values.vat)}
                onChangeText={handleChange('vat')}
                keyboardType="numeric"
                error={!!errors.vat}
                style={styles.input}
              />
              {errors.vat && <Text style={styles.errorText}>{errors.vat}</Text>}

              <TextInput
                label="Total"
                value={totals.total.toFixed(2)}
                editable={false}
                right={<TextInput.Affix text={brand.invoice.currency} />}
                style={styles.input}
              />
              <View style={styles.sectionContainer}>
                <List.Accordion
                  title="Additional Details"
                  expanded={values.openAccordion}
                  onPress={() =>
                    setFieldValue('openAccordion', !values.openAccordion)
                  }>
                  <Divider style={styles.divider} />

                  {ADDITIONAL_FIELDS.map(({label, key}) => (
                    <React.Fragment key={key}>
                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          status={values[key] ? 'checked' : 'unchecked'}
                          onPress={() => setFieldValue(key, !values[key])}
                        />
                        <Text>{label}</Text>
                      </View>
                      {key === 'specialInstructions' &&
                        values.specialInstructions && (
                          <View style={styles.specialInstructionsContainer}>
                            <TextInput
                              label="Special Instructions"
                              value={values.specialInstructionsText}
                              onChangeText={handleChange(
                                'specialInstructionsText',
                              )}
                              error={!!errors.specialInstructionsText}
                              style={styles.input}
                            />
                            {errors.specialInstructionsText && (
                              <Text style={styles.errorText}>
                                {errors.specialInstructionsText}
                              </Text>
                            )}
                          </View>
                        )}
                    </React.Fragment>
                  ))}

                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={allChecked ? 'checked' : 'unchecked'}
                      onPress={() => toggleAll(!allChecked)}
                    />
                    <Text>Add all</Text>
                  </View>
                </List.Accordion>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() =>
                    resetForm({
                      values: createInitialValues(),
                    })
                  }>
                  Reset
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}>
                  Submit Invoice
                </Button>
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};

const createStyles = theme => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.subtleBackground,
  },
  scrollView: {
    padding: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    marginBottom: 20,
    borderRadius: 5,
  },
  datePicker: {
    backgroundColor: theme.colors.surface,
    minHeight: 340,
  },
  datePickerHeaderText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  datePickerText: {
    color: theme.colors.text,
  },
  datePickerWeekdayText: {
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  datePickerSelectedText: {
    color: theme.colors.surface,
    fontWeight: '700',
  },
  datePickerTodayText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  sectionContainer: {
    borderColor: theme.colors.outline,
    borderStyle: 'solid',
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 5,
    padding: 5,
  },
  accordionContainer: {
    borderColor: theme.colors.primary,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 5,
    padding: 10,
  },
  sectionTitle: {
    padding: 5,
    paddingHorizontal: 5,
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderColor: theme.colors.text,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surfaceVariant,
    color: theme.colors.text,
    fontSize: 16,
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 10,
  },
  deleteButton: {
    margin: 10,
  },
  divider: {
    backgroundColor: theme.colors.primary,
    height: 1,
    marginBottom: 10,
  },
  checkboxContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  specialInstructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

export default InvoiceFormView;
