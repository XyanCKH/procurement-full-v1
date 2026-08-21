import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step2RequestDetails from '../../../src/components/wizard/steps/Step2RequestDetails';
import { ProcurementFormData } from '../../../src/types/procurementForm';

const initialFormData: ProcurementFormData = {
  category: 'SOURCING_WITH_CONTRACT',
  queryDetails: '',
  requestType: 'NEW',
  previousCmtId: '',
  description: '',
  isOutsourcing: false,
  budgetAmount: null,
  isBudgetTbd: false,
  targetEndDate: '',
  isOnBehalf: false,
  onBehalfUserId: '',
  isItRelated: false,
  itUserId: '',
  isVendorRegistered: true,
  vendorName: '',
  vendorRegNo: '',
  declarationConfirmed: false
};

describe('Step2RequestDetails Component', () => {
  const mockOnChange = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all Step 2 form elements correctly', () => {
    render(
      <Step2RequestDetails
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByTestId('request-description')).toBeInTheDocument();
    expect(screen.getByTestId('outsourcing-radio')).toBeInTheDocument();
    expect(screen.getByTestId('budget-amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('budget-tbd-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('target-end-date-picker')).toBeInTheDocument();
  });

  test('shows error when description is under 20 characters and Next is clicked', async () => {
    const dataWithShortDesc: ProcurementFormData = {
      ...initialFormData,
      description: 'Short description',
      targetEndDate: '2028-12-31'
    };

    render(
      <Step2RequestDetails
        formData={dataWithShortDesc}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Next Step'));

    await waitFor(() => {
      expect(
        screen.getByText('Please provide request description including system/project/goods/services and business purpose.')
      ).toBeInTheDocument();
    });
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  test('shows error when Target End Date is earlier than tomorrow', async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dataWithInvalidDate: ProcurementFormData = {
      ...initialFormData,
      description: 'This is a valid procurement description with more than twenty characters.',
      targetEndDate: todayStr
    };

    render(
      <Step2RequestDetails
        formData={dataWithInvalidDate}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Next Step'));

    await waitFor(() => {
      expect(screen.getByText('Target End Date cannot be earlier than tomorrow.')).toBeInTheDocument();
    });
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  test('renders outsourcing notice box and dropzone when Outsourcing is Yes', () => {
    const dataWithOutsourcing: ProcurementFormData = {
      ...initialFormData,
      isOutsourcing: true
    };

    render(
      <Step2RequestDetails
        formData={dataWithOutsourcing}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/Outsourcing engagements require additional risk assessment/i)).toBeInTheDocument();
    expect(screen.getByTestId('outsourcing-dropzone')).toBeInTheDocument();
  });

  test('disables budget amount input when TBD checkbox is checked', () => {
    const dataWithTbd: ProcurementFormData = {
      ...initialFormData,
      isBudgetTbd: true,
      budgetAmount: null
    };

    render(
      <Step2RequestDetails
        formData={dataWithTbd}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const budgetInput = screen.getByTestId('budget-amount-input');
    expect(budgetInput).toBeDisabled();
  });

  test('allows proceeding to next step when all validations pass', async () => {
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 2);
    const validDateStr = tomorrowObj.toISOString().split('T')[0];

    const validData: ProcurementFormData = {
      ...initialFormData,
      description: 'This is a comprehensive enterprise procurement description with sufficient characters.',
      budgetAmount: 150000,
      targetEndDate: validDateStr
    };

    render(
      <Step2RequestDetails
        formData={validData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Next Step'));

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });
});
