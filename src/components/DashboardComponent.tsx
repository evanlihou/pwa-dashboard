import React from 'react';
import { ErrorContext } from './ErrorContext';

// eslint-disable-next-line react/prefer-stateless-function
export default class DashboardComponent<P = {}, S = {}, SS = {}> extends React.Component<P, S, SS> {
  // eslint-disable-next-line react/static-property-placement
  context!: React.ContextType<typeof ErrorContext>
}

DashboardComponent.contextType = ErrorContext;
