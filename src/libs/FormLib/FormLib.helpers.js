export const checkFormDirty = (initialValues, currentValues) => {
  try {
    return JSON.stringify(currentValues) === JSON.stringify(initialValues);
  } catch (e) {
    return true;
  }
};

export const checkFormIsValid = errors => {
  if (Object.values(errors).every(error => error === null)) {
    return true;
  }
  return false;
};
