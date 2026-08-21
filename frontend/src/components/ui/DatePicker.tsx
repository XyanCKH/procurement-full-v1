import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD or DD/MM/YYYY
  onChange: (dateStr: string) => void;
  minDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export default function DatePicker({
  value,
  onChange,
  minDate,
  disabled = false,
  className = '',
  'data-testid': dataTestId = 'target-end-date-picker'
}: DatePickerProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="date"
        data-testid={dataTestId}
        value={value}
        min={minDate}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-[#E2E8F0] px-4 py-3 pl-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFB81D] focus:border-[#1E40AF] transition-colors ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white'
        }`}
      />
      <CalendarIcon className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}
