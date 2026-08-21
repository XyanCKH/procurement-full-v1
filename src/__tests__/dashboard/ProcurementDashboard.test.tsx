import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProcurementDashboard } from '../../components/dashboard/ProcurementDashboard';
import { ProcurementRequestDto } from '../../types/procurement';

const mockRequests: ProcurementRequestDto[] = [
  {
    id: 'PR-2024-000123',
    category: 'SOURCING_WITH_CONTRACT',
    requestType: 'NEW',
    description: 'Enterprise Cloud Infrastructure Migration and License Renewal',
    vendorName: 'AWS Cloud Services',
    budgetAmount: 150000.00,
    isBudgetTbd: false,
    targetEndDate: '2024-12-31',
    submittedDate: '2024-01-15',
    status: 'DRAFT',
    pendingActionBy: 'Requester',
    requesterName: 'John Doe',
    requesterId: 'EMP001'
  },
  {
    id: 'PR-2024-000124',
    category: 'CONTRACT_ONLY',
    requestType: 'RENEWAL',
    description: 'Cybersecurity Audit Consulting Services',
    vendorName: 'PwC Security',
    budgetAmount: 85000.00,
    isBudgetTbd: false,
    targetEndDate: '2024-10-15',
    submittedDate: '2024-01-16',
    status: 'SUBMITTED',
    pendingActionBy: 'Procurement Triage Team',
    requesterName: 'Jane Smith',
    requesterId: 'EMP002'
  }
];

describe('ProcurementDashboard Component', () => {
  test('renders procurement table and fetches from API', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRequests),
      })
    );

    render(<ProcurementDashboard apiEndpoint="/api/v1/procurement/requests" />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('procurement-table')).toBeInTheDocument();
    });

    expect(screen.getByText('PR-2024-000123')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Cloud Infrastructure Migration and License Renewal')).toBeInTheDocument();
    expect(screen.getByText('AWS Cloud Services')).toBeInTheDocument();
    expect(screen.getByText('RM 150,000.00')).toBeInTheDocument();
  });

  test('filters table live by search input (ID, Description, Requester)', async () => {
    render(<ProcurementDashboard initialRequests={mockRequests} />);

    const searchInput = screen.getByTestId('dashboard-search-input');
    expect(searchInput).toBeInTheDocument();

    // Search by Request ID
    fireEvent.change(searchInput, { target: { value: '000123' } });
    expect(screen.getByText('PR-2024-000123')).toBeInTheDocument();
    expect(screen.queryByText('PR-2024-000124')).not.toBeInTheDocument();

    // Clear and search by Description keyword
    fireEvent.change(searchInput, { target: { value: 'Cybersecurity' } });
    expect(screen.queryByText('PR-2024-000123')).not.toBeInTheDocument();
    expect(screen.getByText('PR-2024-000124')).toBeInTheDocument();

    // Clear and search by Requester Name
    fireEvent.change(searchInput, { target: { value: 'Jane Smith' } });
    expect(screen.getByText('PR-2024-000124')).toBeInTheDocument();
  });

  test('enables Edit action button for DRAFT requests and triggers navigation', async () => {
    const handleEdit = jest.fn();
    render(<ProcurementDashboard initialRequests={mockRequests} onEditRequest={handleEdit} />);

    const editButton = screen.getByTestId('action-edit-PR-2024-000123');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeEnabled();

    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledWith('PR-2024-000123');
  });

  test('renders all 8 status badge states correctly', () => {
    const statuses = [
      'DRAFT',
      'SUBMITTED',
      'PENDING_REVIEW',
      'MORE_INFO_REQUIRED',
      'UNDER_ASSESSMENT',
      'APPROVED',
      'REJECTED',
      'WITHDRAWN',
    ];

    const multiStatusRequests: ProcurementRequestDto[] = statuses.map((status, index) => ({
      id: `PR-2024-0001${index}`,
      category: 'SOURCING_ONLY',
      requestType: 'NEW',
      description: `Test request ${status}`,
      vendorName: 'Vendor X',
      budgetAmount: 10000,
      isBudgetTbd: false,
      targetEndDate: '2024-12-31',
      status: status as any,
      pendingActionBy: 'Assignee',
      requesterName: 'Test User',
      requesterId: 'EMP999',
    }));

    render(<ProcurementDashboard initialRequests={multiStatusRequests} />);

    expect(screen.getAllByTestId('request-status-badge')).toHaveLength(8);
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
    expect(screen.getByText('Additional Info Required')).toBeInTheDocument();
    expect(screen.getByText('Under Assessment')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('Withdrawn')).toBeInTheDocument();
  });
});
