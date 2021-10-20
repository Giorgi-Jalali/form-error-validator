import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { checkFormDirty, checkFormIsValid } from './FormLib.helpers';
import { useFormLibContext } from './FormLib.context';
import { formReducer, initFormReducer } from './FormLib.reducer';
import {
  ACTION_RESET_FORM,
  ACTION_SUBMIT_FORM,
  ACTION_SET_FORM_DIRTY,
  ACTION_SET_FIELD_VALUE,
  ACTION_SET_FIELD_TOUCHED,
  ACTION_SET_SUBMITTING_PROCESS,
  ACTION_SET_FIELD_ERROR,
  ACTION_SET_FORM_VALID,
} from './FormLib.actions';
import { handleValidation } from './FormLib.validator';

export const useFormLib = ({
  onReset,
  onSubmit,
  apiErrors,
  initialErrors,
  initialTouched,
  isValidInitial,
  hasResetOnSubmit,
  rules,
  initialValues = {},
  isLoading = false,
}) => {
  const initialReducerProps = useMemo(
    () => ({ initialValues, initialErrors, initialTouched, isValidInitial, rules }),
    [initialErrors, initialTouched, initialValues, isValidInitial, rules]
  );

  const [formState, dispatchForm] = useReducer(formReducer, initialReducerProps, initFormReducer);

  /**
   * Setters
   */
  const setFieldValue = (fieldName, fieldValue) =>
    dispatchForm({ type: ACTION_SET_FIELD_VALUE, payload: { fieldName, fieldValue } });

  const setFieldTouched = (fieldName, fieldTouched) => {
    dispatchForm({ type: ACTION_SET_FIELD_TOUCHED, payload: { fieldName, fieldTouched } });
  };

  const setFieldError = (fieldName, fieldError) => {
    dispatchForm({ type: ACTION_SET_FIELD_ERROR, payload: { fieldName, fieldError } });
  };

  const setSubmittingInProcess = isSubmittingInProcess => {
    dispatchForm({ type: ACTION_SET_SUBMITTING_PROCESS, payload: { isSubmittingInProcess } });
  };

  const setFormDirty = isDirty =>
    dispatchForm({ type: ACTION_SET_FORM_DIRTY, payload: { isDirty } });

  const setFormValid = isValid =>
    dispatchForm({ type: ACTION_SET_FORM_VALID, payload: { isValid } });

  const setFormSubmission = () => dispatchForm({ type: ACTION_SUBMIT_FORM });

  const setFormInitial = useCallback(
    (nextState = initialValues) =>
      dispatchForm({
        type: ACTION_RESET_FORM,
        payload: { ...initialReducerProps, initialValues: nextState },
      }),
    [initialReducerProps, initialValues]
  );

  /**
   * Handlers
   */
  const submitForm = () => {
    const errors = handleValidation(null, rules, formState);
    if (errors.length > 0) {
      errors.forEach(obj => {
        setFieldError(obj.fieldName, obj.fieldError);
      });
      setFormValid(false);
      return;
    }

    setFormSubmission();

    setSubmittingInProcess(true);

    onSubmit(formState.values);
  };

  const handleReset = event => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    onReset?.();

    return setFormInitial();
  };

  const handleSubmit = event => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    return submitForm();
  };

  const handleBlur = fieldName => () => {
    const errors = handleValidation(fieldName, rules, formState, true);

    setFieldTouched(fieldName, true);
    setFieldError(fieldName, errors);

    const isValid = checkFormIsValid({
      ...formState.errors,
      [fieldName]: errors.length === 0 ? null : errors,
    });

    if (isValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleChange = fieldName => fieldValue => {
    setFieldValue(fieldName, fieldValue);
    setFormDirty(checkFormDirty(formState.values, initialValues));
  };

  /**
   * Getters
   */
  const getFieldProps = fieldName => ({
    name: fieldName,
    value: formState.values[fieldName],
    onBlur: handleBlur(fieldName),
    onChange: handleChange(fieldName),
  });

  const getFieldMeta = fieldName => ({
    value: formState.values[fieldName],
    errors: formState.errors[fieldName],
    touched: formState.touched[fieldName],
  });

  const getFieldHelpers = fieldName => ({
    setValue: fieldValue => setFieldValue(fieldName, fieldValue),
    setTouched: fieldTouched => setFieldTouched(fieldName, fieldTouched),
    setError: fieldError => setFieldError(fieldName, fieldError),
  });

  useEffect(() => {
    if (hasResetOnSubmit && !isLoading && formState.isSubmittingInProcess) {
      setFormInitial();
    }

    if (!isLoading && formState.isSubmittingInProcess) {
      setSubmittingInProcess(false);
    }
  }, [isLoading, setFormInitial, hasResetOnSubmit, formState.isSubmittingInProcess]);

  return {
    ...formState,
    apiErrors,
    initialValues,
    initialTouched,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    setFormDirty,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    setFormValid,
    setFormSubmission,
    submitForm,
    handleReset,
    handleSubmit,
    resetForm: setFormInitial,
  };
};

export const useField = fieldName => {
  const { getFieldMeta, getFieldProps, getFieldHelpers } = useFormLibContext();

  return [getFieldProps(fieldName), getFieldMeta(fieldName), getFieldHelpers(fieldName)];
};
