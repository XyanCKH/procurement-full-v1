import React, { useState } from 'react';
import { Handshake, FileText, ClipboardList, HelpCircle, Search, Building2, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { ProcurementCategory, RequestType, ProcurementFormData, ContractHistoryItem } from '../../../types/procurementForm';

interface Step1RequestTypeProps {
  formData: ProcurementFormData;
  onChange: (updates: Partial<ProcurementFormData>) => void;
  onNext: () => void;
}

export default function Step1RequestType({ formData, onChange, onNext }: Step1RequestTypeProps) {
  const [cmtSearchQuery, setCmtSearchQuery] = useState(formData.previousCmtId || '');
  const [searchedContract, setSearchedContract] = useState<ContractHistoryItem | null>(
    formData.previousCmtId ? {
      cmtId: formData.previousCmtId,
      title: 'Enterprise Software Maintenance & Support 2024/2025',
      vendorName: 'Global Tech Solutions Sdn Bhd',
      expiryDate: '2025-12-31',
      spendAmount: 'MYR 450,000.00'
    } : null
  );

  const categories: { id: ProcurementCategory; title: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'SOURCING_WITH_CONTRACT',
      title: 'Sourcing with Contract',
      description: 'Vendor selection required along with formal legal contract execution.',
      icon: <Handshake className="w-6 h-6 text-[#1E40AF]" />
    },
    {
      id: 'SOURCING_ONLY',
      title: 'Sourcing Only',
      description: 'Requesting market discovery, vendor quotation and RFQ without direct contract generation.',
      icon: <FileText className="w-6 h-6 text-[#1E40AF]" />
    },
    {
      id: 'CONTRACT_ONLY',
      title: 'Contract Only',
      description: 'Existing vendor identified; drafting legal agreement or statement of work directly.',
      icon: <ClipboardList className="w-6 h-6 text-[#1E40AF]" />
    },
    {
      id: 'OTHER_QUERY',
      title: 'Other Query',
      description: 'General procurement advisory, policy clarification or exception request.',
      icon: <HelpCircle className="w-6 h-6 text-[#1E40AF]" />
    }
  ];

  const handleCmtSearch = () => {
    if (!cmtSearchQuery.trim()) return;
    // Mock CMT search result
    setSearchedContract({
      cmtId: cmtSearchQuery.trim(),
      title: 'Enterprise Software Maintenance & Support 2024/2025',
      vendorName: 'Global Tech Solutions Sdn Bhd',
      expiryDate: '2025-12-31',
      spendAmount: 'MYR 450,000.00'
    });
    onChange({ previousCmtId: cmtSearchQuery.trim() });
  };

  const isStep1Valid = Boolean(
    formData.category && 
    (formData.category !== 'OTHER_QUERY' || formData.queryDetails.trim().length > 0) &&
    (formData.requestType !== 'RENEWAL' || formData.previousCmtId.trim().length > 0)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Step 1: Request Type & Classification</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select the appropriate procurement category and engagement type to initialize your demand intake workflow.
        </p>
      </div>

      {/* 4-column card grid for category selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Procurement Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const isSelected = formData.category === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onChange({ category: cat.id })}
                className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 flex flex-col justify-between bg-white ${
                  isSelected
                    ? 'border-[#1E40AF] ring-4 ring-[#FFE166]/40 shadow-md bg-[#FAFBFC]'
                    : 'border-[#E2E8F0] hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isSelected ? 'bg-[#FFB81D]/20' : 'bg-gray-100'
                  }`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Select</span>
                  <input
                    type="radio"
                    name="procurementCategory"
                    checked={isSelected}
                    onChange={() => onChange({ category: cat.id })}
                    className="w-4 h-4 text-[#1E40AF] focus:ring-[#FFB81D]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditional Query Textarea when Other Query is active */}
      {formData.category === 'OTHER_QUERY' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-3 animate-fadeIn">
          <label className="block text-sm font-semibold text-gray-800">
            Query Details & Advisory Description <span className="text-red-500">*</span>
          </label>
          <textarea
            data-testid="query-details-input"
            maxLength={1000}
            rows={4}
            value={formData.queryDetails}
            onChange={(e) => onChange({ queryDetails: e.target.value })}
            placeholder="Provide specific details regarding your procurement query or policy clarification..."
            className="w-full rounded-lg border border-[#E2E8F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB81D] focus:border-[#1E40AF]"
          />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Mandatory for Other Query category.</span>
            <span>{formData.queryDetails.length}/1,000 characters</span>
          </div>
        </div>
      )}

      {/* Radio Buttons: New Request vs Renewal */}
      <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Engagement Type <span className="text-red-500">*</span>
        </label>
        <div data-testid="request-type-radio" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            className={`cursor-pointer flex items-start space-x-3 p-4 rounded-xl border-2 transition-all ${
              formData.requestType === 'NEW'
                ? 'border-[#1E40AF] bg-[#FAFBFC] ring-2 ring-[#FFE166]/30'
                : 'border-[#E2E8F0] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="requestType"
              value="NEW"
              checked={formData.requestType === 'NEW'}
              onChange={() => onChange({ requestType: 'NEW', previousCmtId: '' })}
              className="mt-1 w-4 h-4 text-[#1E40AF] focus:ring-[#FFB81D]"
            />
            <div>
              <span className="block font-bold text-gray-900 text-sm">New Request</span>
              <span className="block text-xs text-gray-500 mt-0.5">Brand new procurement initiative or vendor engagement.</span>
            </div>
          </label>

          <label
            className={`cursor-pointer flex items-start space-x-3 p-4 rounded-xl border-2 transition-all ${
              formData.requestType === 'RENEWAL'
                ? 'border-[#1E40AF] bg-[#FAFBFC] ring-2 ring-[#FFE166]/30'
                : 'border-[#E2E8F0] hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="requestType"
              value="RENEWAL"
              checked={formData.requestType === 'RENEWAL'}
              onChange={() => onChange({ requestType: 'RENEWAL' })}
              className="mt-1 w-4 h-4 text-[#1E40AF] focus:ring-[#FFB81D]"
            />
            <div>
              <span className="block font-bold text-gray-900 text-sm">Renewal / Extension</span>
              <span className="block text-xs text-gray-500 mt-0.5">Extending or renewing an existing contract in CMT.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Inline CMT Search Input when Renewal is selected */}
      {formData.requestType === 'RENEWAL' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Contract Management Tool (CMT) Reference ID <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter previous CMT ID to retrieve contract history and terms.
            </p>
          </div>

          <div className="flex space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                data-testid="cmt-search-input"
                value={cmtSearchQuery}
                onChange={(e) => setCmtSearchQuery(e.target.value)}
                placeholder="e.g. CMT-2024-99120"
                className="w-full rounded-lg border border-[#E2E8F0] pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB81D] focus:border-[#1E40AF]"
              />
            </div>
            <button
              type="button"
              onClick={handleCmtSearch}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#1E40AF] text-white text-sm font-medium hover:bg-[#1e3a8a] transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Search CMT</span>
            </button>
          </div>

          {/* Mock Contract History Card */}
          {searchedContract && (
            <div className="mt-4 p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Contract History Retrieved</span>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-white text-emerald-900 border border-emerald-200">
                  {searchedContract.cmtId}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{searchedContract.title}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-200/60 text-xs">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{searchedContract.vendorName}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Expires: {searchedContract.expiryDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{searchedContract.spendAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation action buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-[#E2E8F0]">
        <button
          type="button"
          disabled={!isStep1Valid}
          onClick={onNext}
          className={`px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all ${
            isStep1Valid
              ? 'bg-[#FFB81D] hover:bg-[#FFE166] text-[#0B1220] cursor-pointer ring-2 ring-[#FFB81D]/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next: Demand Justification →
        </button>
      </div>
    </div>
  );
}
