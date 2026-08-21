import React from 'react';
import { RequestStatus } from '../../types/procurement';

interface RequestStatusBadgeProps {
  status: RequestStatus | string;
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
  const normalized = status ? status.toUpperCase().replace(/\s+/g, '_') : 'DRAFT';

  const badgeConfig: Record<string, { label: string; className: string }> = {
    DRAFT: {
      label: 'Draft',
      className: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    SUBMITTED: {
      label: 'Submitted',
      className: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    PENDING_REVIEW: {
      label: 'Pending Review',
      className: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    MORE_INFO_REQUIRED: {
      label: 'Additional Info Required',
      className: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    UNDER_ASSESSMENT: {
      label: 'Under Assessment',
      className: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    APPROVED: {
      label: 'Approved',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    REJECTED: {
      label: 'Rejected',
      className: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    WITHDRAWN: {
      label: 'Withdrawn',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  };

  const config = badgeConfig[normalized] || {
    label: status,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      data-testid="request-status-badge"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
