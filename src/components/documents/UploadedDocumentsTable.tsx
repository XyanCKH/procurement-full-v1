import React from 'react';
import { UploadedFileItem } from '../../types/documents';
import { FileText, Download, Trash2, FileSpreadsheet, FilePresentation, Image as ImageIcon } from 'lucide-react';

interface UploadedDocumentsTableProps {
  files: UploadedFileItem[];
  onDelete: (id: string) => void;
  onDownload?: (file: UploadedFileItem) => void;
}

export default function UploadedDocumentsTable({
  files,
  onDelete,
  onDownload
}: UploadedDocumentsTableProps) {
  if (files.length === 0) {
    return null;
  }

  const getFileIcon = (fileName: string, fileType: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (ext === 'xlsx' || ext === 'xls') return <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
    if (ext === 'pptx' || ext === 'ppt') return <FilePresentation className="w-5 h-5 text-orange-600 flex-shrink-0" />;
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    return <FileText className="w-5 h-5 text-[#1E40AF] flex-shrink-0" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" data-testid="uploaded-documents-table">
      <div className="px-6 py-4 border-b border-gray-100 bg-slate-50">
        <h3 className="text-sm font-bold text-gray-900">Uploaded Supporting Documents ({files.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-6">File Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Uploaded By</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-gray-700">
            {files.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(item.name, item.type)}
                    <div>
                      <span className="font-medium text-gray-900 block">{item.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(item.size)}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.category === 'BUSINESS_CASE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.category === 'BUSINESS_CASE' ? 'Business Case *' : 'Supporting Doc'}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{item.uploadedBy}</td>
                <td className="py-4 px-4 text-gray-600">{item.uploadedDate}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => onDownload ? onDownload(item) : alert(`Downloading ${item.name}`)}
                      className="p-2 text-gray-500 hover:text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-all"
                      title="Download file"
                      data-testid={`download-file-${item.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete file"
                      data-testid={`delete-file-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
