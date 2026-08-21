import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step6ReviewSubmit from '../../../components/wizard/steps/Step6ReviewSubmit';
import { ProcurementFormData } from '../../../types/procurementForm';

const initialFormData: ProcurementFormData = {
  category: 'SOURCING_WITH_CONTRACT',
  queryDetails: '',
  requestType: 'NEW',
  previousCmtId: '',
  description: 'Enterprise Cloud Software Licences renewal and support.',
  isOutsourcing: false,
  budgetAmount: 250000,
  isBudgetTbd: false,
  targetEndDate: '2025-12-31',
  requesterId: 'EMP90012',
  requesterName: 'Alex bin Abdullah',
  requesterDept: 'Enterprise Procurement',
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
  vendorName: 'ABC Solutions Sdn Bhd',
  vendorRegNo: '202001012345-T',
  declarationConfirmed: false,
  uploadedFiles: [
    {
      id: 'doc-1',
      name: 'ApprovedBusinessCase.pdf',
      size: 1024 * 500,
      type: 'application/pdf',
      category: 'BUSINESS_CASE'
    }
  ]
};

describe('Step6ReviewSubmit Component', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnSaveDraft = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders 4 summary cards and declaration checkbox', () => {
    render(
      <Step6ReviewSubmit
        formData={initialFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onSaveDraft={mockOnSaveDraft}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByTestId('review-card-request')).toBeInTheDocument();
    expect(screen.getByTestId('review-card-business')).toBeInTheDocument();
    expect(screen.getByTestId('review-card-vendor')).toBeInTheDocument();
    expect(screen.getByTestId('review-card-budget')).toBeInTheDocument();
    expect(screen.getByTestId('declaration-checkbox')).toBeInTheDocument();
    expect(screen.getByText('Submit Request')).toBeInTheDocument();
  });

  test('Given Step 6 loads, When declaration is unticked, Then Submit button has disabled attribute and opacity/cursor style', () => {
    render(
      <Step6ReviewSubmit
        formData={initialFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onSaveDraft={mockOnSaveDraft}
        onBack={mockOnBack}
      />
    );

    const submitBtn = screen.getByText('Submit Request').closest('button');
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveClass('opacity-50');
    expect(submitBtn).toHaveClass('cursor-not-allowed');

    // Attempting submit without ticking declaration shows error
    fireEvent.click(submitBtn!);
    expect(screen.getByText('Please confirm the legal declaration before submitting.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('When declaration is ticked, Then Submit button is enabled and triggers submission endpoint & success screen', async () => {
    const updatedFormData = { ...initialFormData, declarationConfirmed: true };

    const { rerender } = render(
      <Step6ReviewSubmit
        formData={updatedFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onSaveDraft={mockOnSaveDraft}
        onBack={mockOnBack}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    const submitBtn = screen.getByText('Submit Request').closest('button');
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn!);

    expect(mockOnSubmit).toHaveBeenCalled();

    // Verify success screen renders with request ID and what happens next timeline
    const successScreen = await screen.findByTestId('success-screen');
    expect(successScreen).toBeInTheDocument();
    expect(screen.getByTestId('request-id-pill')).toBeInTheDocument();
    expect(screen.getByText('What happens next?')).toBeInTheDocument();
  });

  test('Save as Draft button triggers draft API and shows success toast', async () => {
    render(
      <Step6ReviewSubmit
        formData={initialFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onSaveDraft={mockOnSaveDraft}
        onBack={mockOnBack}
      />
    );

    const saveDraftBtn = screen.getByText('Save as Draft');
    fireEvent.click(saveDraftBtn);

    expect(mockOnSaveDraft).toHaveBeenCalled();
    expect(await screen.findByText('Draft saved successfully! You can resume anytime.')).toBeInTheDocument();
  });
});
