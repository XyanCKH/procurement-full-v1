import React from 'react';
import { RequestStatus } from '../../types/procurement';

interface DashboardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-[#E2E8F0]">
      <div className="w-full sm:w-96">
        <label htmlFor="dashboard-search" className="sr-only">
          Search requests
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            id="dashboard-search"
            data-testid="dashboard-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Request ID, Description, or Requester..."
            className="block w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-md leading-5 bg-[#FAFBFC] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFB81D] focus:border-[#FFB81D] sm:text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="w-full sm:w-auto flex items-center gap-3">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Filter Status:
        </label>
        <select
          id="status-filter"
          data-testid="dashboard-status-filter"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-[#E2E8F0] focus:outline-none focus:ring-[#FFB81D] focus:border-[#FFB81D] sm:text-sm rounded-md bg-[#FAFBFC] text-gray-900"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="MORE_INFO_REQUIRED">Additional Info Required</option>
          <option value="UNDER_ASSESSMENT">Under Assessment</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
      </div>
    </div>
  );
};
