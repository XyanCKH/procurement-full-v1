import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step5SupportingDocs from '../../../components/wizard/steps/Step5SupportingDocs';
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
  vendorName: 'ABC Solutions Sdn Bhd',
  vendorRegNo: '202001012345-T',
  declarationConfirmed: false,
  uploadedFiles: []
};

describe('Step5SupportingDocs Component', () => {
  const mockOnChange = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders mandatory business case dropzone and optional supporting docs dropzone', () => {
    render(
      <Step5SupportingDocs
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByTestId('business-case-dropzone')).toBeInTheDocument();
    expect(screen.getByTestId('supporting-docs-dropzone')).toBeInTheDocument();
  });

  test('blocks navigation to Step 6 if no file exists under Dropzone 1 with error message', () => {
    render(
      <Step5SupportingDocs
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Continue to Step 6'));

    expect(
      screen.getByText('Please upload approved Business Case Paper or Approval Email before submission.')
    ).toBeInTheDocument();
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  test('Given valid PDF dropped into Dropzone 1, When uploaded, Then row appears in table with filename and delete button', async () => {
    render(
      <Step5SupportingDocs
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const businessCaseDropzone = screen.getByTestId('business-case-dropzone');
    const fileInput = businessCaseDropzone.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['dummy business case content'], 'ApprovedBusinessCase.pdf', {
      type: 'application/pdf'
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verify row appears in table
    const table = await screen.findByTestId('uploaded-documents-table');
    expect(table).toBeInTheDocument();
    expect(screen.getByText('ApprovedBusinessCase.pdf')).toBeInTheDocument();

    const deleteBtn = screen.getByTestId(/delete-file-/);
    expect(deleteBtn).toBeInTheDocument();

    // Now clicking next should succeed
    fireEvent.click(screen.getByText('Continue to Step 6'));
    expect(mockOnNext).toHaveBeenCalled();
  });

  test('Given file exceeding 20MB, When dropped, Then toast error displays "File exceeds 20MB limit."', () => {
    render(
      <Step5SupportingDocs
        formData={initialFormData}
        onChange={mockOnChange}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const businessCaseDropzone = screen.getByTestId('business-case-dropzone');
    const fileInput = businessCaseDropzone.querySelector('input[type="file"]') as HTMLInputElement;

    // Create a large file (21MB)
    const largeFile = new File(['x'.repeat(1024 * 1024)], 'LargeDocument.pdf', {
      type: 'application/pdf'
    });
    // mock file size property
    Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByText('File exceeds 20MB limit.')).toBeInTheDocument();
  });
});
