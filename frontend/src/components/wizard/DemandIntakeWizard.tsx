import React, { useState } from 'react';
import WizardStepper from './WizardStepper';
import RequestOverviewSidebar from './RequestOverviewSidebar';
import Step1RequestType from './steps/Step1RequestType';
import Step2RequestDetails from './steps/Step2RequestDetails';
import Step3UserInfo from './steps/Step3UserInfo';
import { ProcurementFormData } from '../../types/procurementForm';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function DemandIntakeWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProcurementFormData>({
    category: 'SOURCING_WITH_CONTRACT',
    queryDetails: '',
    requestType: 'NEW',
    previousCmtId: '',
    description: '',
    isOutsourcing: false,
    budgetAmount: null,
    isBudgetTbd: false,
    targetEndDate: '',
    requesterId: '',
    requesterName: '',
    requesterDept: '',
    requesterContact: '',
    isOnBehalf: false,
    onBehalfUserId: '',
    onBehalfUserName: '',
    onBehalfUserDept: '',
    onBehalfUserContact: '',
    isItRelated: false,
    itUserId: '',
    itUserName: '',
    itUserDept: '',
    itUserContact: '',
    isVendorRegistered: true,
    vendorName: '',
    vendorRegNo: '',
    declarationConfirmed: false
  });

  const handleFormChange = (updates: Partial<ProcurementFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = () => {
    alert('Demand intake draft successfully saved!');
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFBFC] overflow-hidden">
      {/* Wizard Header Bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Procurement Demand Intake & Business Case</h1>
            <p className="text-xs text-gray-500">Submit a new procurement request or business case across enterprise divisions.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-[#E2E8F0] text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 text-gray-500" />
            <span>Save Draft</span>
          </button>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Enterprise Workflow</span>
          </div>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <WizardStepper currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

      {/* Main Split View: Wizard Step Body & Right-hand Overview Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {currentStep === 1 && (
            <Step1RequestType
              formData={formData}
              onChange={handleFormChange}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <Step2RequestDetails
              formData={formData}
              onChange={handleFormChange}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <Step3UserInfo
              formData={formData}
              onChange={handleFormChange}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep > 3 && (
            <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Step {currentStep} under construction</h2>
              <p className="text-sm text-gray-600">You are viewing step {currentStep}. Step 1 to Step 3 are fully implemented.</p>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-medium"
              >
                Return to Step 3
              </button>
            </div>
          )}
        </div>

        {/* Right-hand Summary Checklist Sidebar */}
        <RequestOverviewSidebar formData={formData} currentStep={currentStep} />
      </div>
    </div>
  );
}
