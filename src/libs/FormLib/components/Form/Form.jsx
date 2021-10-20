import React from 'react';
import { useFormLibContext } from '../../FormLib.context';

export const Form = ({ children, ...props }) => {
  const { handleReset, handleSubmit } = useFormLibContext();

  return (
    <form action="#" onSubmit={handleSubmit} onReset={handleReset} {...props}>
      {children}
    </form>
  );
};
