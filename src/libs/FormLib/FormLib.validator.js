const required = value => {
  if (value) {
    return true;
  }
  return false;
};

const minLength = (value, min) => {
  if (value) {
    return value.length >= min;
  }
  return true;
};

const maxLength = (value, max) => {
  if (value) {
    return value.length < max;
  }
  return true;
};

const min = (number, minValue) => {
  if (number) {
    return number > minValue;
  }
  return true;
};

const max = (number, maxValue) => {
  if (number) {
    return number <= maxValue;
  }
  return true;
};

const email = mail => {
  if (mail) {
    return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
  }
  return true;
};

const validators = { required, minLength, maxLength, min, max, email };

export const handleValidation = (fieldName, rules, formState, isBlur) => {
  const filteredInputs = isBlur
    ? rules.filter(obj => obj.validateOn === 'blur' && obj.inputName === fieldName)[0]
    : rules.filter(obj => obj.validateOn === 'submit');

  const errors = [];
  if (fieldName) {
    filteredInputs?.rules?.forEach(obj => {
      const isValid = validators[obj.type](formState.values[fieldName], obj.value);
      if (!isValid) {
        errors.push(obj.message);
      }
    });
  } else {
    filteredInputs.forEach(input => {
      input?.rules?.forEach(obj => {
        const isValid = validators[obj.type](formState.values[input.inputName], obj.value);
        if (!isValid) {
          errors.push({ fieldName: input.inputName, fieldError: [obj.message] });
        }
      });
    });
  }
  return errors;
};
