import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  label: string;
  subLabel?: string;
  required?: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  dataTestId: string;
  onFileUpload: (file: File) => void;
  onError: (message: string) => void;
}

export default function FileDropzone({
  label,
  subLabel = 'PDF, DOCX, XLSX, PPTX, MSG, EML, JPEG, PNG up to 20MB',
  required = false,
  maxSizeMB = 20,
  acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-outlook',
    'message/rfc822',
    'image/jpeg',
    'image/png'
  ],
  dataTestId,
  onFileUpload,
  onError
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const validateAndUpload = (file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError('File exceeds 20MB limit.');
      return;
    }
    onFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
      // reset input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2" data-testid={dataTestId}>
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-[#CBD5E1] bg-white hover:border-blue-500 hover:bg-slate-50/50'
        }`}
      >
        <div className="p-3 rounded-full bg-blue-50 text-[#1E40AF]">
          <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">
            Drag & drop file here, or <span className="text-[#1E40AF] underline">browse</span>
          </p>
          <p className="text-xs text-gray-500">{subLabel}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.docx,.xlsx,.pptx,.msg,.eml,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
}
