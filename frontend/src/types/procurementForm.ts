export type ProcurementCategory = 
  | 'SOURCING_WITH_CONTRACT' 
  | 'SOURCING_ONLY' 
  | 'CONTRACT_ONLY' 
  | 'OTHER_QUERY';

export type RequestType = 'NEW' | 'RENEWAL';

export interface Employee {
  id: string;
  name: string;
  department: string;
  contact: string;
  email: string;
}

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
  requesterId: string;
  requesterName: string;
  requesterDept: string;
  requesterContact: string;
  isOnBehalf: boolean;
  onBehalfUserId: string;
  onBehalfUserName: string;
  onBehalfUserDept: string;
  onBehalfUserContact: string;
  isItRelated: boolean;
  itUserId: string;
  itUserName: string;
  itUserDept: string;
  itUserContact: string;
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
