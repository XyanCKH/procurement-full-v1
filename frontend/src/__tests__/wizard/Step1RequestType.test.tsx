import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step1RequestType from '../../../src/components/wizard/steps/Step1RequestType';
import { ProcurementFormData } from '../../../src/types/procurementForm';

const mockFormData: ProcurementFormData = {
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

describe('Step1RequestType Component', () => {
  test('renders step 1 request type and category cards correctly', () => {
    const mockOnChange = jest.fn();
    const mockOnNext = jest.fn();

    render(
      <Step1RequestType
        formData={mockFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByText(/Step 1: Request Type & Classification/i)).toBeInTheDocument();
    expect(screen.getByText('Sourcing with Contract')).toBeInTheDocument();
    expect(screen.getByText('Sourcing Only')).toBeInTheDocument();
    expect(screen.getByText('Contract Only')).toBeInTheDocument();
    expect(screen.getByText('Other Query')).toBeInTheDocument();
  });

  test('renders query details textarea when Other Query is selected', () => {
    const mockOnChange = jest.fn();
    const mockOnNext = jest.fn();

    const otherQueryData: ProcurementFormData = {
      ...mockFormData,
      category: 'OTHER_QUERY'
    };

    render(
      <Step1RequestType
        formData={otherQueryData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    const textarea = screen.getByTestId('query-details-input');
    expect(textarea).toBeInTheDocument();
  });

  test('renders CMT search input when Renewal request type is selected', () => {
    const mockOnChange = jest.fn();
    const mockOnNext = jest.fn();

    const renewalData: ProcurementFormData = {
      ...mockFormData,
      requestType: 'RENEWAL'
    };

    render(
      <Step1RequestType
        formData={renewalData}
        onChange={mockOnChange}
        onNext={mockOnNext}
      />
    );

    const cmtInput = screen.getByTestId('cmt-search-input');
    expect(cmtInput).toBeInTheDocument();

    fireEvent.change(cmtInput, { target: { value: 'CMT-2024-99120' } });
    const searchButton = screen.getByText('Search CMT');
    fireEvent.click(searchButton);

    expect(screen.getByText('Contract History Retrieved')).toBeInTheDocument();
    expect(screen.getByText('CMT-2024-99120')).toBeInTheDocument();
  });
});
