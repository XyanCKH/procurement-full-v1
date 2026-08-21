import React, { useState } from 'react';
import { Check, Copy, ArrowRight, FileText, CheckCircle2, ShieldCheck, Clock, Layers } from 'lucide-react';

interface SubmissionSuccessScreenProps {
  requestId: string;
  onViewRequest?: () => void;
  onStartNew?: () => void;
}

export default function SubmissionSuccessScreen({
  requestId = 'PR-2024-000123',
  onViewRequest,
  onStartNew
}: SubmissionSuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(requestId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const steps = [
    {
      title: 'Budget Baseline Verification',
      description: 'Finance verifies cost center allocation and proposed spend amount.',
      status: 'Current',
      icon: DollarSignIcon
    },
    {
      title: 'Procurement Assessment',
      description: 'Category manager reviews supplier due diligence and sourcing strategy.',
      status: 'Pending',
      icon: FileText
    },
    {
      title: 'Strategy Approval',
      description: 'Final governance review and sign-off for tender or direct award.',
      status: 'Pending',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 text-center animate-fade-in" data-testid="success-screen">
      {/* Animated Green Checkmark */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-emerald-100 text-[#10B981] shadow-lg animate-bounce-short">
        <Check className="w-12 h-12 stroke-[3]" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-25"></div>
      </div>

      {/* Header & Success Title */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Procurement Request Successfully Submitted!
        </h2>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          Your business case and supplier due diligence have been securely registered into the Enterprise Procurement workflow engine.
        </p>
      </div>

      {/* Request ID Pill */}
      <div className="inline-flex items-center space-x-3 bg-emerald-50 text-emerald-900 px-6 py-3 rounded-2xl border border-emerald-200 shadow-sm" data-testid="request-id-pill">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Request ID:</span>
        <span className="text-lg font-mono font-bold text-emerald-900">{requestId}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-xl hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center space-x-1 text-xs font-semibold"
          title="Copy Request ID"
          data-testid="copy-request-id-btn"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* What Happens Next Stepper Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-left space-y-6">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 rounded-xl bg-[#1E40AF]/10 text-[#1E40AF]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">What happens next?</h3>
            <p className="text-xs text-gray-500">Track the lifecycle of your procurement demand intake.</p>
          </div>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex items-start space-x-4">
              <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                idx === 0
                  ? 'bg-[#10B981] text-white shadow-sm'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {idx === 0 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {onViewRequest && (
          <button
            onClick={onViewRequest}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            View Request Status
          </button>
        )}
        <button
          onClick={onStartNew || (() => window.location.reload())}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1E40AF] text-white font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center justify-center space-x-2"
        >
          <span>Submit Another Request</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
