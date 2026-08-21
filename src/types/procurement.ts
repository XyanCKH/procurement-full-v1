export type ProcurementCategory = 
  | 'SOURCING_WITH_CONTRACT' 
  | 'SOURCING_ONLY' 
  | 'CONTRACT_ONLY' 
  | 'OTHER_QUERY';

export type RequestType = 'NEW' | 'RENEWAL';

export type RequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_REVIEW'
  | 'MORE_INFO_REQUIRED'
  | 'UNDER_ASSESSMENT'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface ProcurementRequestDto {
  id: string; // e.g. PR-2024-000123
  category: ProcurementCategory;
  queryDetails?: string;
  requestType: RequestType;
  description: string;
  vendorName: string;
  budgetAmount: number | null;
  isBudgetTbd: boolean;
  targetEndDate: string;
  submittedDate?: string;
  status: RequestStatus;
  pendingActionBy: string;
  requesterName: string;
  requesterId: string;
}
