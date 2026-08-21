import React from 'react';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { number: 1, label: 'Request Type & Scope' },
  { number: 2, label: 'Demand Justification' },
  { number: 3, label: 'Requester & Stakeholders' },
  { number: 4, label: 'Supplier Due Diligence' },
  { number: 5, label: 'Supporting Documents' },
  { number: 6, label: 'Review & Submit' }
];

export default function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-8 py-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress connecting line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#CBD5E1] z-0 mx-10 hidden md:block" />

          {STEPS.map((step) => {
            const isCompleted = step.number < currentStep;
            const isActive = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div
                key={step.number}
                onClick={() => isCompleted && onStepClick && onStepClick(step.number)}
                className={`relative z-10 flex flex-col items-center group ${
                  isCompleted ? 'cursor-pointer' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 shadow-sm ${
                    isCompleted
                      ? 'bg-[#1E40AF] text-white ring-4 ring-[#1E40AF]/10'
                      : isActive
                      ? 'bg-[#1E40AF] text-white ring-4 ring-[#FFB81D]/40 border-2 border-[#FFB81D]'
                      : 'bg-[#CBD5E1] text-gray-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs font-semibold uppercase tracking-wider ${
                      isActive ? 'text-[#1E40AF]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    Step {step.number}
                  </span>
                  <span
                    className={`block text-xs font-medium max-w-[120px] truncate ${
                      isActive ? 'text-gray-900 font-bold' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
