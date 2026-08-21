import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { ProcurementFormData } from '../../types/procurementForm';

interface RequestOverviewSidebarProps {
  formData: ProcurementFormData;
  currentStep: number;
}

export default function RequestOverviewSidebar({ formData, currentStep }: RequestOverviewSidebarProps) {
  // Check checklist items completion
  const isStep1Complete = Boolean(
    formData.category && 
    (formData.category !== 'OTHER_QUERY' || formData.queryDetails.trim().length > 0) &&
    (formData.requestType !== 'RENEWAL' || formData.previousCmtId.trim().length > 0)
  );

  const isStep2Complete = Boolean(formData.description.trim().length >= 10 && formData.targetEndDate);
  const isStep3Complete = Boolean(formData.requesterName);
  const isStep4Complete = Boolean(formData.vendorName);
  const isStep5Complete = true; // documents optional/flexible for now
  const isStep6Complete = Boolean(formData.declarationConfirmed);

  const checklist = [
    { title: '1. Request Type & Scope', complete: isStep1Complete, step: 1 },
    { title: '2. Demand Justification', complete: isStep2Complete, step: 2 },
    { title: '3. Requester & Stakeholders', complete: isStep3Complete, step: 3 },
    { title: '4. Supplier Due Diligence', complete: isStep4Complete, step: 4 },
    { title: '5. Supporting Documents', complete: isStep5Complete, step: 5 },
    { title: '6. Review & Submission', complete: isStep6Complete, step: 6 },
  ];

  return (
    <div className="w-80 bg-white border-l border-[#E2E8F0] p-6 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Request Overview</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#1E40AF]/10 text-[#1E40AF]">
          Draft ID: Pending
        </span>
      </div>

      <div className="my-6 space-y-4 flex-1">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Completion Status</p>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#1E40AF] h-full transition-all duration-300"
              style={{ 
                width: `${(checklist.filter(c => c.complete).length / checklist.length) * 100}%` 
              }}
            />
          </div>
          <p className="text-xs text-right text-gray-500 mt-1">
            {checklist.filter(c => c.complete).length} of 6 steps complete
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {checklist.map((item) => (
            <div 
              key={item.step}
              className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-colors ${
                currentStep === item.step 
                  ? 'border-[#FFB81D] bg-[#FFE166]/10' 
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              {item.complete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${currentStep === item.step ? 'text-gray-900' : 'text-gray-700'}`}>
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-500">
                  {item.complete ? 'Completed' : 'Action required'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#E2E8F0] bg-[#FAFBFC] -mx-6 -mb-6 p-6 rounded-b-lg">
        <div className="flex items-start space-x-2 text-xs text-gray-600">
          <AlertCircle className="w-4 h-4 text-[#FFB81D] flex-shrink-0 mt-0.5" />
          <p>Need assistance? Contact Procurement Helpdesk at procurement@enterprise.com</p>
        </div>
      </div>
    </div>
  );
}
