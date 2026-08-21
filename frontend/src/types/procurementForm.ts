export type ProcurementCategory = 
  | 'SOURCING_WITH_CONTRACT' 
  | 'SOURCING_ONLY' 
  | 'CONTRACT_ONLY' 
  | 'OTHER_QUERY';

export type RequestType = 'NEW' | 'RENEWAL';

export interface ProcurementFormData {
  category: ProcurementCategory;
  queryDetails: string;
  requestType: RequestType;
  previousCmtId: string;
  description: string;
  isOutsourcing: boolean;
  budgetAmount: number | null;
  isBudgetTbd: boolean;
  targetEndDate: string;
  isOnBehalf: boolean;
  onBehalfUserId: string;
  isItRelated: boolean;
  itUserId: string;
  isVendorRegistered: boolean;
  vendorName: string;
  vendorRegNo: string;
  declarationConfirmed: boolean;
}

export interface ContractHistoryItem {
  cmtId: string;
  title: string;
  vendorName: string;
  expiryDate: string;
  spendAmount: string;
}
