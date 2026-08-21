import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step4VendorInfo from '../../../components/wizard/steps/Step4VendorInfo';
import { ProcurementFormData } from '../../../types/procurementForm';

const initialFormData: ProcurementFormData = {
  category: 'SOURCING_WITH_CONTRACT',
  queryDetails: '',
  requestType: 'NEW',
  previousCmtId: '',
  description: 'Procurement of enterprise cloud software licences and annual maintenance support.',
  isOutsourcing: false,
  budgetAmount: 150000,
  isBudgetTbd: false,
  targetEndDate: '2025-12-31',
  requesterId: 'EMP90012',
  requesterName: 'Alex bin Abdullah',
  requesterDept: 'Enterprise Procurement & Sourcing',
  requesterContact: '03-2161 9999',
  isOnBehalf: false,
  onBehalfUserId: '',
  onBehalfUserName: '',
  onBehalfUserDept: '',
  onBehalfUserContact: '',
  isItRelated: false,
  itUserId: '',
  itUserName: '',
  itUserDept: '',
  itUserContact: '',
  isVendorRegistered: true,
  vendorName: '',
  vendorRegNo: '',
  declarationConfirmed: false
};

describe('Step4VendorInfo Component', () => {
  const mockOnChange = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders vendor registered radio toggle and search input by default', () => {
    render(
      <Step4VendorInfo
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByTestId('vendor-registered-radio')).toBeInTheDocument();
    expect(screen.getByTestId('supplier-search-input')).toBeInTheDocument();
  });

  test('searches and selects registered vendor ABC Solutions Sdn Bhd, rendering card with Active badge and email info', async () => {
    render(
      <Step4VendorInfo
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const searchInput = screen.getByTestId('supplier-search-input');
    fireEvent.change(searchInput, { target: { value: 'ABC' } });

    // Wait for mock search dropdown option
    const option = await screen.findByText('ABC Solutions Sdn Bhd');
    expect(option).toBeInTheDocument();

    fireEvent.click(option);

    // Verify selected vendor card is rendered with Active badge
    const card = await screen.findByTestId('selected-vendor-card');
    expect(card).toBeInTheDocument();
    expect(screen.getByTestId('vendor-status-badge')).toHaveTextContent('Active');
    expect(screen.getByText('procurement@abcsolutions.com.my')).toBeInTheDocument();
  });

  test('given vendor is not registered, entering invalid email shows error "Please enter a valid email address."', async () => {
    const unregisteredData: ProcurementFormData = {
      ...initialFormData,
      isVendorRegistered: false
    };

    render(
      <Step4VendorInfo
        formData={unregisteredData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByTestId('new-vendor-inputs')).toBeInTheDocument();

    // Fill valid company name, contact person, hp number, but invalid email
    fireEvent.change(screen.getByPlaceholderText('e.g. NextGen Technologies Sdn Bhd'), {
      target: { value: 'NextGen Tech' }
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. Mr. Kelvin Tan'), {
      target: { value: 'Kelvin' }
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. kelvin@nextgen.com.my'), {
      target: { value: 'invalid-email' }
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. 012-345 6789'), {
      target: { value: '012-3456789' }
    });

    fireEvent.click(screen.getByText('Continue to Step 5'));

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(mockOnNext).not.toHaveBeenCalled();
  });
});
