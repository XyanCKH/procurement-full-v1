import React from 'react';
import { CheckCircle2, Building, Mail, Phone, ExternalLink } from 'lucide-react';

export interface VendorCardData {
  companyName: string;
  regNo: string;
  status: 'Active' | 'Pending' | 'Inactive';
  email: string;
  phone: string;
  address?: string;
}

interface SelectedVendorCardProps {
  vendor: VendorCardData;
  onSelectDifferent: () => void;
  dataTestId?: string;
}

export default function SelectedVendorCard({
  vendor,
  onSelectDifferent,
  dataTestId = 'selected-vendor-card'
}: SelectedVendorCardProps) {
  return (
    <div
      data-testid={dataTestId}
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{vendor.companyName}</h3>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-gray-500 font-mono">Reg No: {vendor.regNo}</span>
              <span className="text-gray-300">•</span>
              <span
                data-testid="vendor-status-badge"
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#065F46]"
              >
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                <span>{vendor.status}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSelectDifferent}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
        >
          <span>+ Select a different vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0] text-sm">
        <div className="flex items-center space-x-2.5 text-gray-700">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{vendor.email}</span>
        </div>
        <div className="flex items-center space-x-2.5 text-gray-700">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{vendor.phone}</span>
        </div>
      </div>
    </div>
  );
}
