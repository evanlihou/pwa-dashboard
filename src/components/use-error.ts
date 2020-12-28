import { useContext } from 'react';
import { ErrorContext } from './ErrorContext';

function useError() {
  const { error, addError, removeError } = useContext(ErrorContext);
  return { error, addError, removeError };
}

export default useError;
