import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Step3UserInfo from '../../../components/wizard/steps/Step3UserInfo';
import { ProcurementFormData } from '../../../types/procurementForm';

describe('Step3UserInfo Component', () => {
  const mockFormData: ProcurementFormData = {
    category: 'SOURCING_WITH_CONTRACT',
    queryDetails: '',
    requestType: 'NEW',
    previousCmtId: '',
    description: 'Cloud software license agreement renewal.',
    isOutsourcing: false,
    budgetAmount: 120000,
    isBudgetTbd: false,
    targetEndDate: '2026-12-31',
    requesterId: 'EMP90012',
    requesterName: 'Alex bin Abdullah',
    requesterDept: 'Enterprise Procurement & Sourcing',
    requesterContact: '+603-2161 9999',
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
    vendorName: 'Tech Corp',
    vendorRegNo: '1234567-X',
    declarationConfirmed: false
  };

  const mockOnChange = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders requester name and department as read-only fields populated from session', () => {
    render(
      <Step3UserInfo
        formData={mockFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const nameInput = screen.getByTestId('requester-name') as HTMLInputElement;
    const deptInput = screen.getByTestId('requester-dept') as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe('Alex bin Abdullah');
    expect(nameInput.readOnly).toBe(true);

    expect(deptInput).toBeInTheDocument();
    expect(deptInput.value).toBe('Enterprise Procurement & Sourcing');
    expect(deptInput.readOnly).toBe(true);
  });

  test('allows editing contact field and validates Malaysian format', () => {
    render(
      <Step3UserInfo
        formData={{ ...mockFormData, requesterContact: '' }}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const contactInput = screen.getByTestId('requester-contact');
    fireEvent.change(contactInput, { target: { value: 'invalid-phone' } });

    const nextButton = screen.getByText('Next: Vendor Due Diligence');
    fireEvent.click(nextButton);

    expect(screen.getByText(/Please provide a valid Malaysian contact number/i)).toBeInTheDocument();
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  test('reveals employee lookup modal/autocomplete when submit on behalf toggle is enabled', () => {
    render(
      <Step3UserInfo
        formData={mockFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const toggle = screen.getByTestId('submit-on-behalf-toggle');
    expect(screen.queryByTestId('on-behalf-employee-autocomplete')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(mockOnChange).toHaveBeenCalledWith({ isOnBehalf: true });
  });

  test('fails validation when IT-related is Yes and IT User Name is left empty', () => {
    render(
      <Step3UserInfo
        formData={{ ...mockFormData, isItRelated: true, itUserName: '' }}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const nextButton = screen.getByText('Next: Vendor Due Diligence');
    fireEvent.click(nextButton);

    expect(screen.getByText('Please provide IT contact information for IT-related procurements.')).toBeInTheDocument();
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  test('passes validation when IT-related is Yes and IT User Name is provided', () => {
    render(
      <Step3UserInfo
        formData={{ ...mockFormData, isItRelated: true, itUserName: 'Ahmad Zulkarnain' }}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const nextButton = screen.getByText('Next: Vendor Due Diligence');
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalled();
  });
});
