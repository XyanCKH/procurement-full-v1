import React from 'react';

interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

export default function CurrencyInput({
  value,
  onChange,
  disabled = false,
  placeholder = '0.00',
  className = '',
  'data-testid': dataTestId = 'budget-amount-input'
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    if (rawVal === '') {
      onChange(null);
      return;
    }
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const formattedValue = value !== null && !isNaN(value)
    ? value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '';

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="absolute left-3.5 text-sm font-bold text-gray-700 select-none">
        RM
      </span>
      <input
        type="text"
        data-testid={dataTestId}
        disabled={disabled}
        value={disabled ? '' : formattedValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-[#E2E8F0] pl-12 pr-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB81D] focus:border-[#1E40AF] transition-colors ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white'
        }`}
      />
    </div>
  );
}
