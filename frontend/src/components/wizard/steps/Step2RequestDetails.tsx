import React, { useState } from 'react';
import { ProcurementFormData } from '../../../types/procurementForm';
import CurrencyInput from '../../ui/CurrencyInput';
import DatePicker from '../../ui/DatePicker';
import { AlertCircle, Upload, FileText, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface Step2RequestDetailsProps {
  formData: ProcurementFormData;
  onChange: (updates: Partial<ProcurementFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2RequestDetails({
  formData,
  onChange,
  onNext,
  onBack
}: Step2RequestDetailsProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute tomorrow's date YYYY-MM-DD for min date picker
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const handleNextClick = () => {
    // Validation 1: Description min 20 chars
    if (!formData.description || formData.description.trim().length < 20) {
      setErrorMessage('Please provide request description including system/project/goods/services and business purpose.');
      return;
    }

    // Validation 2: Target End Date must not be earlier than tomorrow
    if (!formData.targetEndDate) {
      setErrorMessage('Target End Date cannot be earlier than tomorrow.');
      return;
    }
    const targetDate = new Date(formData.targetEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (targetDate < tomorrow) {
      setErrorMessage('Target End Date cannot be earlier than tomorrow.');
      return;
    }

    // Validation 3: Budget amount if not TBD
    if (!formData.isBudgetTbd && (formData.budgetAmount === null || formData.budgetAmount <= 0)) {
      setErrorMessage('Please provide a valid proposed budget amount or check To Be Confirmed (TBD).');
      return;
    }

    setErrorMessage(null);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Step 2: Request Details & Sizing</h2>
        <p className="text-sm text-gray-600 mt-1">
          Provide detailed description, regulatory outsourcing classification, spend budget, and target completion timeline.
        </p>
      </div>

      {/* Error banner if validation fails */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* 1. Request Description */}
      <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-800">
            Request Description <span className="text-red-500">*</span>
          </label>
          <span
            className="text-xs font-medium"
            style={{ color: formData.description.length > 2000 ? '#EF4444' : '#94A3B8' }}
          >
            {formData.description.length}/2,000 characters (min 20)
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Describe the system, project, goods, or services required along with clear business justification and expected outcomes.
        </p>
        <textarea
          data-testid="request-description"
          rows={5}
          maxLength={2000}
          value={formData.description}
          onChange={(e) => {
            onChange({ description: e.target.value });
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="e.g. Enterprise Cloud ERP license renewal and expansion module for supply chain tracking across regional hubs..."
          className="w-full rounded-xl border border-[#E2E8F0] p-4 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB81D] focus:border-[#1E40AF]"
        />
        {formData.description.length > 0 && formData.description.length < 20 && (
          <p className="text-xs text-amber-600 font-medium">Please enter at least 20 characters ({20 - formData.description.length} more needed).</p>
        )}
      </div>

      {/* 2. Outsourcing Engagement */}
      <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Outsourcing Engagement <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Does this request involve outsourcing of material business functions or core IT operations to an external vendor?
          </p>
        </div>

        <div data-testid="outsourcing-radio" className="flex items-center space-x-6">
          <label className={`cursor-pointer flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition-all ${
            formData.isOutsourcing === true
              ? 'border-[#1E40AF] bg-[#FAFBFC] ring-2 ring-[#FFE166]/30'
              : 'border-[#E2E8F0] hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="isOutsourcing"
              checked={formData.isOutsourcing === true}
              onChange={() => onChange({ isOutsourcing: true })}
              className="w-4 h-4 text-[#1E40AF] focus:ring-[#FFB81D]"
            />
            <span className="text-sm font-bold text-gray-900">Yes</span>
          </label>

          <label className={`cursor-pointer flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition-all ${
            formData.isOutsourcing === false
              ? 'border-[#1E40AF] bg-[#FAFBFC] ring-2 ring-[#FFE166]/30'
              : 'border-[#E2E8F0] hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="isOutsourcing"
              checked={formData.isOutsourcing === false}
              onChange={() => onChange({ isOutsourcing: false })}
              className="w-4 h-4 text-[#1E40AF] focus:ring-[#FFB81D]"
            />
            <span className="text-sm font-bold text-gray-900">No</span>
          </label>
        </div>

        {/* Conditional Notice Box & Dropzone when Yes */}
        {formData.isOutsourcing && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            {/* Alert Notice per Design System: #EFF6FF / #1E40AF text */}
            <div className="bg-[#EFF6FF] border border-blue-200 text-[#1E40AF] px-4 py-3.5 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-[#1E40AF] flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                Outsourcing engagements require additional risk assessment and regulatory compliance review prior to vendor solicitation.
              </div>
            </div>

            {/* Document Upload Dropzone */}
            <div
              data-testid="outsourcing-dropzone"
              className="border-2 border-dashed border-[#E2E8F0] hover:border-[#1E40AF] rounded-xl p-8 text-center bg-gray-50 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3"
              onClick={() => alert('Simulated document dropzone: Upload risk assessment document.')}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1E40AF]">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Click to upload outsourcing risk assessment documents
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOCX, XLSX, PNG or JPG (Max 20MB)
                </p>
              </div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-[#E2E8F0] text-xs font-semibold text-gray-700 rounded-lg shadow-sm">
                Browse Files
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Proposed Budget & TBD Toggle */}
      <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Proposed Budget (MYR) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Estimated financial commitment for this procurement demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <CurrencyInput
              data-testid="budget-amount-input"
              value={formData.budgetAmount}
              onChange={(val) => {
                onChange({ budgetAmount: val });
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={formData.isBudgetTbd}
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center space-x-3">
            <label className="cursor-pointer flex items-center space-x-2.5 select-none">
              <input
                type="checkbox"
                data-testid="budget-tbd-checkbox"
                checked={formData.isBudgetTbd}
                onChange={(e) => {
                  onChange({ isBudgetTbd: e.target.checked, budgetAmount: e.target.checked ? null : formData.budgetAmount });
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-4 h-4 text-[#1E40AF] rounded border-[#E2E8F0] focus:ring-[#FFB81D]"
              />
              <span className="text-sm font-bold text-gray-800">To Be Confirmed (TBD)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Target End Date */}
      <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Target End Date <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Target completion or delivery date for this procurement request (must be tomorrow or later).
          </p>
        </div>

        <div className="max-w-md">
          <DatePicker
            data-testid="target-end-date-picker"
            minDate={tomorrowStr}
            value={formData.targetEndDate}
            onChange={(dateStr) => {
              onChange({ targetEndDate: dateStr });
              if (errorMessage) setErrorMessage(null);
            }}
          />
        </div>
        <p className="text-xs text-gray-400">Earliest selectable date is tomorrow ({tomorrowStr.split('-').reverse().join('/')}).</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0]">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <button
          onClick={handleNextClick}
          className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-[#1E40AF] text-white font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm"
        >
          <span>Next Step</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
