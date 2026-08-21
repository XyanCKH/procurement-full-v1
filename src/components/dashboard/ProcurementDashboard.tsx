import React, { useState, useEffect } from 'react';
import { ProcurementRequestDto } from '../../types/procurement';
import { RequestStatusBadge } from './RequestStatusBadge';
import { DashboardFilters } from './DashboardFilters';

interface ProcurementDashboardProps {
  apiEndpoint?: string;
  onEditRequest?: (id: string) => void;
  onViewRequest?: (id: string) => void;
  onRespondRequest?: (id: string) => void;
  onWithdrawRequest?: (id: string) => void;
  initialRequests?: ProcurementRequestDto[];
}

export const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({
  apiEndpoint = '/api/v1/procurement/requests',
  onEditRequest,
  onViewRequest,
  onRespondRequest,
  onWithdrawRequest,
  initialRequests,
}) => {
  const [requests, setRequests] = useState<ProcurementRequestDto[]>(initialRequests || []);
  const [loading, setLoading] = useState<boolean>(!initialRequests);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (initialRequests) {
      setRequests(initialRequests);
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch procurement requests');
        }
        const data = await response.json();
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [apiEndpoint, initialRequests]);

  const formatCategory = (cat: string) => {
    switch (cat) {
      case 'SOURCING_WITH_CONTRACT':
        return 'Sourcing with Contract';
      case 'SOURCING_ONLY':
        return 'Sourcing Only';
      case 'CONTRACT_ONLY':
        return 'Contract Only';
      case 'OTHER_QUERY':
        return 'Other Query';
      default:
        return cat;
    }
  };

  const formatBudget = (amount: number | null, isTbd: boolean) => {
    if (isTbd || amount === null || amount === undefined) {
      return 'TBC';
    }
    return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const filteredRequests = requests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      req.id.toLowerCase().includes(q) ||
      req.description.toLowerCase().includes(q) ||
      req.requesterName.toLowerCase().includes(q);

    const matchesStatus =
      !selectedStatus || req.status.toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (id: string) => {
    if (onEditRequest) {
      onEditRequest(id);
    } else {
      window.location.href = `/requests/${id}/wizard`;
    }
  };

  const handleView = (id: string) => {
    if (onViewRequest) {
      onViewRequest(id);
    }
  };

  const handleRespond = (id: string) => {
    if (onRespondRequest) {
      onRespondRequest(id);
    }
  };

  const handleWithdraw = (id: string) => {
    if (onWithdrawRequest) {
      onWithdrawRequest(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Procurement Dashboard</h1>
            <p className="text-sm text-gray-600">Manage and track your procurement demands and requests</p>
          </div>
        </div>

        <DashboardFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {loading ? (
          <div data-testid="loading-spinner" className="text-center py-12 text-gray-500">
            Loading procurement requests...
          </div>
        ) : error ? (
          <div data-testid="error-message" className="bg-rose-50 text-rose-700 p-4 rounded-md border border-rose-200">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table data-testid="procurement-table" className="min-w-full divide-y divide-[#E2E8F0]">
                <thead className="bg-[#FAFBFC]">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vendor Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Budget Amount
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Target End Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Pending Action By
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E2E8F0]">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                        No procurement requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const isDraft = req.status.toUpperCase() === 'DRAFT';
                      const isRfi = req.status.toUpperCase() === 'MORE_INFO_REQUIRED';
                      const isPreAssessment = ['DRAFT', 'SUBMITTED', 'PENDING_REVIEW'].includes(
                        req.status.toUpperCase()
                      );

                      return (
                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {req.id}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate" title={req.description}>
                            {req.description}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatCategory(req.category)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {req.vendorName || 'TBD'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatBudget(req.budgetAmount, req.isBudgetTbd)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(req.submittedDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(req.targetEndDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <RequestStatusBadge status={req.status} />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {req.pendingActionBy || '-'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleView(req.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View"
                              data-testid={`action-view-${req.id}`}
                            >
                              View
                            </button>
                            {isDraft && (
                              <button
                                onClick={() => handleEdit(req.id)}
                                className="text-amber-600 hover:text-amber-900"
                                title="Edit"
                                data-testid={`action-edit-${req.id}`}
                              >
                                Edit
                              </button>
                            )}
                            {isRfi && (
                              <button
                                onClick={() => handleRespond(req.id)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Respond to RFI"
                                data-testid={`action-respond-${req.id}`}
                              >
                                Respond
                              </button>
                            )}
                            {isPreAssessment && !isDraft && (
                              <button
                                onClick={() => handleWithdraw(req.id)}
                                className="text-slate-600 hover:text-slate-900"
                                title="Withdraw"
                                data-testid={`action-withdraw-${req.id}`}
                              >
                                Withdraw
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
