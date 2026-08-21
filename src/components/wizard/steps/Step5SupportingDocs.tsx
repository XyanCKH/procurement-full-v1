import React, { useState } from 'react';
import { ProcurementFormData } from '../../../types/procurementForm';
import { UploadedFileItem } from '../../../types/documents';
import FileDropzone from '../../documents/FileDropzone';
import UploadedDocumentsTable from '../../documents/UploadedDocumentsTable';
import { ShieldAlert, ArrowRight, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

interface Step5SupportingDocsProps {
  formData: ProcurementFormData;
  onChange: (updates: Partial<ProcurementFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5SupportingDocs({
  formData,
  onChange,
  onNext,
  onBack
}: Step5SupportingDocsProps) {
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize uploaded files from formData or empty array
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>(
    formData.uploadedFiles || []
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBusinessCaseUpload = (file: File) => {
    setError(null);
    const newFileItem: UploadedFileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: formData.requesterName || 'Alex bin Abdullah',
      uploadedDate: new Date().toISOString().split('T')[0],
      category: 'BUSINESS_CASE',
      file
    };

    // Replace or add business case
    const filtered = uploadedFiles.filter(f => f.category !== 'BUSINESS_CASE');
    const updated = [newFileItem, ...filtered];
    setUploadedFiles(updated);
    onChange({ uploadedFiles: updated });
    showToast(`Successfully uploaded ${file.name}`);
  };

  const handleSupportingDocUpload = (file: File) => {
    setError(null);
    const newFileItem: UploadedFileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: formData.requesterName || 'Alex bin Abdullah',
      uploadedDate: new Date().toISOString().split('T')[0],
      category: 'SUPPORTING_DOC',
      file
    };

    const updated = [...uploadedFiles, newFileItem];
    setUploadedFiles(updated);
    onChange({ uploadedFiles: updated });
    showToast(`Successfully uploaded ${file.name}`);
  };

  const handleDeleteFile = (id: string) => {
    const updated = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(updated);
    onChange({ uploadedFiles: updated });
  };

  const handleNext = () => {
    setError(null);
    const hasBusinessCase = uploadedFiles.some(f => f.category === 'BUSINESS_CASE');
    if (!hasBusinessCase) {
      setError('Please upload approved Business Case Paper or Approval Email before submission.');
      return;
    }
    onNext();
  };

  const hasBusinessCase = uploadedFiles.some(f => f.category === 'BUSINESS_CASE');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Step 5: Supporting Documents & Business Case</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload mandatory approved business case paper or email authorization, along with any other supporting documents.
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 transition-all animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileDropzone
          label="Copy of approved business case paper or email"
          required={true}
          dataTestId="business-case-dropzone"
          onFileUpload={handleBusinessCaseUpload}
          onError={(msg) => setError(msg)}
        />

        <FileDropzone
          label="Other Supporting Documents"
          subLabel="Optional additional files (PDF, DOCX, XLSX, etc.)"
          required={false}
          dataTestId="supporting-docs-dropzone"
          onFileUpload={handleSupportingDocUpload}
          onError={(msg) => setError(msg)}
        />
      </div>

      {/* Status warning if business case missing */}
      {!hasBusinessCase && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-3">
          <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Mandatory Business Case document is pending upload. You cannot proceed to Step 6 without it.</span>
        </div>
      )}

      {/* Uploaded Documents Table */}
      <UploadedDocumentsTable
        files={uploadedFiles}
        onDelete={handleDeleteFile}
        onDownload={(file) => {
          showToast(`Downloading ${file.name}...`);
        }}
      />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 4</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-[#1E40AF] hover:bg-blue-900 text-white font-medium shadow-md shadow-blue-500/20 transition-all"
        >
          <span>Continue to Step 6</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
