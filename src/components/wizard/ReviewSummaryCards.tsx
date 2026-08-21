import React from 'react';
import { ProcurementFormData } from '../../types/procurementForm';
import { FileText, Building2, User, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ReviewSummaryCardsProps {
  formData: ProcurementFormData;
}

export default function ReviewSummaryCards({ formData }: ReviewSummaryCardsProps) {
  const formatCategory = (category?: string) => {
    switch (category) {
      case 'SOURCING_WITH_CONTRACT': return 'Sourcing with Contract';
      case 'SOURCING_ONLY': return 'Sourcing Only';
      case 'CONTRACT_ONLY': return 'Contract Only';
      case 'OTHER_QUERY': return 'Other Query';
      default: return category || 'Sourcing with Contract';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Request Type & Description Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4" data-testid="review-card-request">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#1E40AF]/10 text-[#1E40AF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Request Type & Description</h3>
              <p className="text-xs text-gray-500">Procurement category, request type, and scope description.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1E40AF]/10 text-[#1E40AF]">
            {formData.requestType === 'RENEWAL' ? 'Renewal Request' : 'New Request'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Category</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formatCategory(formData.category)}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Request Type</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">
              {formData.requestType === 'RENEWAL' ? `Renewal (CMT ID: ${formData.previousCmtId || 'N/A'})` : 'New Request'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Outsourcing Engagement</span>
            <span className={`text-sm font-semibold mt-1 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full ${
              formData.isOutsourcing ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {formData.isOutsourcing ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Yes (Regulated Outsourcing)</span>
                </>
              ) : (
                <span>No</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Supporting Files</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">
              {formData.uploadedFiles?.length || 0} document(s) uploaded
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider mb-1">Description</span>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3.5 border border-gray-100 leading-relaxed">
            {formData.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* 2. Business & IT User Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4" data-testid="review-card-business">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Business & IT Stakeholder</h3>
            <p className="text-xs text-gray-500">Requester identity, department mappings, and technical IT lead.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Requester</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.requesterName}</span>
            <span className="text-xs text-gray-500">{formData.requesterId}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Department</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.requesterDept || 'Enterprise Procurement'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Contact No</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.requesterContact || 'N/A'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">IT Lead / Contact</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">
              {formData.isItRelated ? (formData.itUserName || 'Assigned IT Lead') : 'Not IT Related'}
            </span>
            {formData.isItRelated && formData.itUserDept && (
              <span className="text-xs text-gray-500">{formData.itUserDept}</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Vendor Information Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4" data-testid="review-card-vendor">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Vendor Information</h3>
              <p className="text-xs text-gray-500">Supplier due diligence and contact credentials.</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            formData.isVendorRegistered ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
          }`}>
            {formData.isVendorRegistered ? 'Registered Supplier Master' : 'Unregistered / New Vendor'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Company Name</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.vendorName || 'Not specified'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Registration Number</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.vendorRegNo || 'N/A'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Contact Person</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.vendorContactPerson || formData.vendorName || 'N/A'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Email & Phone</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.vendorEmail || 'contact@vendor.com'}</span>
            <span className="text-xs text-gray-500">{formData.vendorPhone || formData.vendorHp || '03-2161 9999'}</span>
          </div>
        </div>
      </div>

      {/* 4. Budget & Target Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4" data-testid="review-card-budget">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Budget & Target Timeline</h3>
            <p className="text-xs text-gray-500">Proposed financial spend and target completion date.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Proposed Spend (MYR)</span>
            <span className="text-sm font-bold text-gray-900 mt-1 block">
              {formData.isBudgetTbd ? 'To Be Confirmed (TBD)' : `RM ${formData.budgetAmount?.toLocaleString('en-MY', { minimumFractionDigits: 2 }) || '0.00'}`}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Target Completion Date</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">{formData.targetEndDate || '2025-12-31'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Workflow SLA</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">Standard (3-5 Working Days)</span>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Compliance Status</span>
            <span className="text-sm font-semibold text-emerald-700 mt-1 inline-flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ready for Triage</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
