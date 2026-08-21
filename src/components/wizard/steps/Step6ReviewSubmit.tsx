import React, { useState } from 'react';
import { ProcurementFormData } from '../../../types/procurementForm';
import ReviewSummaryCards from '../ReviewSummaryCards';
import SubmissionSuccessScreen from '../SubmissionSuccessScreen';
import { ArrowLeft, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Step6ReviewSubmitProps {
  formData: ProcurementFormData;
  onChange: (updates: Partial<ProcurementFormData>) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onBack: () => void;
}

export default function Step6ReviewSubmit({
  formData,
  onChange,
  onSubmit,
  onSaveDraft,
  onBack
}: Step6ReviewSubmitProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('PR-2024-000123');
  const [draftToast, setDraftToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ declarationConfirmed: e.target.checked });
    setError(null);
  };

  const handleSaveDraftClick = () => {
    onSaveDraft();
    setDraftToast(true);
    setTimeout(() => setDraftToast(false), 3000);
  };

  const handleSubmitClick = () => {
    if (!formData.declarationConfirmed) {
      setError('Please confirm the legal declaration before submitting.');
      return;
    }
    setError(null);
    onSubmit();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <SubmissionSuccessScreen requestId={requestId} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Draft Saved Toast Notification */}
      {draftToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">Draft saved successfully! You can resume anytime.</span>
        </div>
      )}

      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Step 6: Review Summary & Legal Declaration</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review all information captured across the 5 intake steps, confirm the accuracy declaration, and submit your procurement request.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Review Summary Cards */}
      <ReviewSummaryCards formData={formData} />

      {/* Legal Declaration Checkbox */}
      <div 
        className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3 shadow-sm transition-all hover:border-slate-300"
        data-testid="declaration-checkbox"
      >
        <input
          type="checkbox"
          id="declaration"
          checked={formData.declarationConfirmed || false}
          onChange={handleDeclarationChange}
          className="mt-1 w-5 h-5 text-[#1E40AF] rounded border-slate-300 focus:ring-[#1E40AF] cursor-pointer"
        />
        <label htmlFor="declaration" className="text-sm text-gray-800 leading-relaxed cursor-pointer select-none">
          <span className="font-bold text-gray-900 block mb-0.5">Legal Declaration & Confirmation *</span>
          I confirm that the information submitted is complete and accurate to the best of my knowledge, and complies with enterprise procurement governance guidelines.
        </label>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="px-6 py-3 rounded-xl border border-[#1E40AF] text-[#1E40AF] bg-white font-semibold hover:bg-[#1E40AF]/5 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={!formData.declarationConfirmed}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-md flex items-center space-x-2 ${
              formData.declarationConfirmed
                ? 'bg-[#1E40AF] hover:bg-[#1D4ED8] cursor-pointer'
                : 'bg-[#1E40AF] opacity-50 cursor-not-allowed'
            }`}
          >
            <span>Submit Request</span>
          </button>
        </div>
      </div>
    </div>
  );
}
