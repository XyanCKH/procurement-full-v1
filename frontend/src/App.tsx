import React from 'react';
import './index.css';
import FinanceShellLayout from './components/layout/FinanceShellLayout';
import DemandIntakeWizard from './components/wizard/DemandIntakeWizard';

function App() {
  return (
    <FinanceShellLayout>
      <DemandIntakeWizard />
    </FinanceShellLayout>
  );
}

export default App;