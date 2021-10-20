import { useState } from 'react';
import { HttpStatusE, useDataFetch } from '../../../hooks/useDataFetch';

export const useUserForm = submitPromise => {
  const [apiValidationErrors, setApiValidationErrors] = useState(null);

  const [registerUserRes, registerUser] = useDataFetch({
    isLazy: true,
    fetchHandler: submitPromise,
    onSuccess: ({ status, ok, data }) => {
      if (ok) {
        setApiValidationErrors(null);
      }

      if (status === HttpStatusE.BAD_REQUEST) {
        setApiValidationErrors(data);
      }
    },
  });

  return {
    apiValidationErrors,
    onSubmit: registerUser,
    isLoading: registerUserRes.isLoading,
    responseStatus: registerUserRes.fullResponse?.status,
  };
};
