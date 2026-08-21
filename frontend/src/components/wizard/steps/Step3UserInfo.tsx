import React, { useState } from 'react';
import { ProcurementFormData, Employee } from '../../../types/procurementForm';
import EmployeeAutocomplete from '../../ui/EmployeeAutocomplete';
import { User, Phone, Building2, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

interface Step3UserInfoProps {
  formData: ProcurementFormData;
  onChange: (updates: Partial<ProcurementFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3UserInfo({
  formData,
  onChange,
  onNext,
  onBack
}: Step3UserInfoProps) {
  const [error, setError] = useState<string | null>(null);

  // Default initial session requester if empty
  const requesterName = formData.requesterName || 'Alex bin Abdullah';
  const requesterDept = formData.requesterDept || 'Enterprise Procurement & Sourcing';
  const requesterId = formData.requesterId || 'EMP90012';
  const requesterContact = formData.requesterContact !== undefined ? formData.requesterContact : '+603-2161 9999';

  // Malaysian phone validation regex: e.g. 03-1234 5678 / +603-1234 5678 / 012-345 6789 / +6012-345 6789
  const phoneRegex = /^(\+?6?0[1-9][0-9]?-[0-9]{3,4}\s?[0-9]{4})$|^(\+?6?0[1-9][0-9]{8,9})$|^(0[1-9][0-9]{7,9})$/;

  const handleNext = () => {
    setError(null);

    // Validate Contact
    if (!requesterContact || !phoneRegex.test(requesterContact.trim())) {
      setError('Please provide a valid Malaysian contact number (e.g. 03-1234 5678 or 012-345 6789).');
      return;
    }

    // Validate IT related requirement
    if (formData.isItRelated && !formData.itUserName) {
      setError('Please provide IT contact information for IT-related procurements.');
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Step 3: User Information & Stakeholder Integration</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review business user identity, configure submit-on-behalf delegations, and specify IT technical stakeholders.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Business User Name & Department */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
          <div className="p-2 rounded-xl bg-[#1E40AF]/10 text-[#1E40AF]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Business Requester Profile</h3>
            <p className="text-xs text-gray-500">Auto-populated from Enterprise Active Directory session claims.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Business User Name</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={requesterName}
                data-testid="requester-name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm font-medium cursor-not-allowed"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Department / Division</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={requesterDept}
                data-testid="requester-dept"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm font-medium cursor-not-allowed"
              />
              <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 2. Business User Contact */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Business User Contact Number *</label>
          <div className="relative">
            <input
              type="text"
              value={requesterContact}
              onChange={(e) => onChange({ requesterContact: e.target.value, requesterId, requesterName, requesterDept })}
              placeholder="e.g. 03-1234 5678 / 012-345 6789"
              data-testid="requester-contact"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
            />
            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">Malaysian format accepted (Landline e.g. 03-xxxx xxxx or Mobile e.g. 01x-xxx xxxx).</p>
        </div>
      </div>

      {/* 3. Submit on Behalf Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Submit on Behalf of Another Employee</h3>
            <p className="text-xs text-gray-500">Enable if initiating this procurement demand on behalf of a colleague or business unit manager.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOnBehalf}
              onChange={(e) => onChange({ isOnBehalf: e.target.checked })}
              data-testid="submit-on-behalf-toggle"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E40AF]"></div>
          </label>
        </div>

        {formData.isOnBehalf && (
          <div className="pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Select On-Behalf Employee</label>
            <EmployeeAutocomplete
              value={formData.onBehalfUserName || ''}
              onChange={(emp) => {
                if (emp) {
                  onChange({
                    onBehalfUserId: emp.id,
                    onBehalfUserName: emp.name,
                    onBehalfUserDept: emp.department,
                    onBehalfUserContact: emp.contact
                  });
                } else {
                  onChange({
                    onBehalfUserId: '',
                    onBehalfUserName: '',
                    onBehalfUserDept: '',
                    onBehalfUserContact: ''
                  });
                }
              }}
              placeholder="Search employee directory for delegacy..."
              dataTestId="on-behalf-employee-autocomplete"
            />
            {formData.onBehalfUserName && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex flex-col space-y-1">
                <div><span className="font-bold">Delegated To:</span> {formData.onBehalfUserName} ({formData.onBehalfUserId})</div>
                <div><span className="font-bold">Department:</span> {formData.onBehalfUserDept}</div>
                <div><span className="font-bold">Contact:</span> {formData.onBehalfUserContact}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. IT User Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">IT Technical Stakeholder Integration</h3>
          <p className="text-xs text-gray-500 mt-1">Specify whether this demand involves IT hardware, software licenses, SaaS, cloud infrastructure, or security integrations.</p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Is this an IT-related procurement? *</label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="isItRelated"
                checked={formData.isItRelated === true}
                onChange={() => onChange({ isItRelated: true })}
                data-testid="it-related-radio-yes"
                className="w-4 h-4 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <span className="text-sm font-medium text-gray-800">Yes</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="isItRelated"
                checked={formData.isItRelated === false}
                onChange={() => onChange({ isItRelated: false, itUserId: '', itUserName: '' })}
                data-testid="it-related-radio-no"
                className="w-4 h-4 text-[#1E40AF] focus:ring-[#1E40AF]"
              />
              <span className="text-sm font-medium text-gray-800">No</span>
            </label>
          </div>
        </div>

        {formData.isItRelated && (
          <div className="pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider" data-testid="it-related-radio">
              IT Lead / Technical Stakeholder Name *
            </label>
            <EmployeeAutocomplete
              value={formData.itUserName || ''}
              onChange={(emp) => {
                if (emp) {
                  onChange({
                    itUserId: emp.id,
                    itUserName: emp.name,
                    itUserDept: emp.department,
                    itUserContact: emp.contact
                  });
                } else {
                  onChange({
                    itUserId: '',
                    itUserName: '',
                    itUserDept: '',
                    itUserContact: ''
                  });
                }
              }}
              placeholder="Search IT department employee directory..."
              dataTestId="it-user-autocomplete"
            />

            {formData.itUserName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">IT Department</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.itUserDept || ''}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">IT Contact</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.itUserContact || ''}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#1E3A8A] transition-colors shadow-sm"
        >
          <span>Next: Vendor Due Diligence</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
