import React, { PropsWithChildren, useCallback, useState } from 'react';

type addErrorFunction = (message: string, status?: string) => void;
type removeErrorFunction = () => void;

export const ErrorContext = React.createContext<{
  error: {message: string, status?: string} | null,
  addError: addErrorFunction,
  removeError: removeErrorFunction,
}>({
  error: null,
  addError: () => {},
  removeError: () => {},
});

export default function ErrorProvider({ children }: PropsWithChildren<{}>) {
  const [error, setError] = useState<{message: string, status: string} | null>(null);

  const removeError = () => {
    setError(null);
  };

  const addError = (message: string, status: string) => {
    setError({ message, status });
  };

  const contextValue = {
    error,
    addError: useCallback((message, status) => addError(message, status), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}
