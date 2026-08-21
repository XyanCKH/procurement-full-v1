export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedDate: string;
  category: 'BUSINESS_CASE' | 'SUPPORTING_DOC';
  file?: File;
}
