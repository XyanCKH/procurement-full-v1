import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component with FinanceShellLayout', () => {
  it('renders the sidebar and enterprise shell layout', () => {
    render(<App />);
    
    // Check for Finance Shell branding / Dashboard text
    expect(screen.getByText('Procurement')).toBeInTheDocument();
    expect(screen.getByText('Enterprise System')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Demand Intake')).toBeInTheDocument();
    expect(screen.getByText('Finance System Shell')).toBeInTheDocument();
  });
});
