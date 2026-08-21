import React from 'react';
import './index.css';
import FinanceShellLayout from './components/layout/FinanceShellLayout';

function App() {
  return (
    <FinanceShellLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Procurement Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the procurement management system.</p>
      </div>
    </FinanceShellLayout>
  );
}

export default App;