import React, { useState } from 'react';
import { ProcurementFormData } from '../../../types/procurementForm';
import SupplierAutocomplete from '../vendor/SupplierAutocomplete';
import SelectedVendorCard, { VendorCardData } from '../vendor/SelectedVendorCard';
import { Building2, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

interface Step4VendorInfoProps {
  formData: ProcurementFormData;
  onChange: (updates: Partial<ProcurementFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4VendorInfo({
  formData,
  onChange,
  onNext,
  onBack
}: Step4VendorInfoProps) {
  const [error, setError] = useState<string | null>(null);

  // Local state for selected vendor card if registered
  const [selectedVendor, setSelectedVendor] = useState<VendorCardData | null>(
    formData.vendorName
      ? {
          companyName: formData.vendorName,
          regNo: formData.vendorRegNo || '202001012345-T',
          status: 'Active',
          email: formData.vendorEmail || 'contact@vendor.com.my',
          phone: formData.vendorPhone || '+603-2161 9999'
        }
      : null
  );

  // Manual vendor fields state if unregistered
  const [newVendorName, setNewVendorName] = useState(formData.vendorName || '');
  const [contactPerson, setContactPerson] = useState(formData.vendorContactPerson || '');
  const [email, setEmail] = useState(formData.vendorEmail || '');
  const [officePhone, setOfficePhone] = useState(formData.vendorPhone || '');
  const [hpNumber, setHpNumber] = useState(formData.vendorHp || '');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Malaysian phone regex
  const phoneRegex = /^(\+?6?0[1-9][0-9]?-[0-9]{3,4}\s?[0-9]{4})$|^(\+?6?0[1-9][0-9]{8,9})$|^(0[1-9][0-9]{7,9})$/;

  const handleNext = () => {
    setError(null);

    if (formData.isVendorRegistered) {
      if (!selectedVendor && !formData.vendorName) {
        setError('Please search and select a registered vendor from the Supplier Master.');
        return;
      }
    } else {
      // Unregistered vendor validation
      if (!newVendorName.trim()) {
        setError('Vendor Company Name is required.');
        return;
      }
      if (!contactPerson.trim()) {
        setError('Contact Person is required.');
        return;
      }
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!hpNumber.trim()) {
        setError('HP Number is required.');
        return;
      }
    }

    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Step 4: Supplier Due Diligence & Discovery</h2>
        <p className="text-sm text-gray-500 mt-1">
          Search the centralized Supplier Master database or capture complete new vendor credentials for unregistered suppliers.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Vendor Registered Radio Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
          Is the vendor registered in the Enterprise Supplier Master? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="vendor-registered-radio">
          <label
            onClick={() => {
              onChange({ isVendorRegistered: true });
              setError(null);
            }}
            className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
              formData.isVendorRegistered
                ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-bold shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="vendorRegistered"
              checked={formData.isVendorRegistered}
              onChange={() => onChange({ isVendorRegistered: true })}
              className="text-[#1E40AF] focus:ring-[#1E40AF]"
            />
            <div className="flex flex-col">
              <span className="text-sm">Yes (Registered in Supplier Master)</span>
              <span className="text-xs text-gray-500 font-normal">Search live active vendor directory</span>
            </div>
          </label>

          <label
            onClick={() => {
              onChange({ isVendorRegistered: false, vendorName: '', vendorRegNo: '' });
              setSelectedVendor(null);
              setError(null);
            }}
            className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
              !formData.isVendorRegistered
                ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-bold shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="vendorRegistered"
              checked={!formData.isVendorRegistered}
              onChange={() => {
                onChange({ isVendorRegistered: false, vendorName: '', vendorRegNo: '' });
                setSelectedVendor(null);
              }}
              className="text-[#1E40AF] focus:ring-[#1E40AF]"
            />
            <div className="flex flex-col">
              <span className="text-sm">No / Not Sure (New / Unregistered)</span>
              <span className="text-xs text-gray-500 font-normal">Enter manual vendor credentials</span>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Registered Vendor Search & Card Display */}
      {formData.isVendorRegistered ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
            <div className="p-2 rounded-xl bg-[#1E40AF]/10 text-[#1E40AF]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Supplier Master Search</h3>
              <p className="text-xs text-gray-500">Search by company name or registration number (e.g. ABC Solutions).</p>
            </div>
          </div>

          {!selectedVendor ? (
            <div className="space-y-4">
              <SupplierAutocomplete
                value={formData.vendorName || ''}
                onSelect={(vendor) => {
                  if (vendor) {
                    setSelectedVendor(vendor);
                    onChange({
                      vendorName: vendor.companyName,
                      vendorRegNo: vendor.regNo,
                      vendorEmail: vendor.email,
                      vendorPhone: vendor.phone
                    });
                  } else {
                    setSelectedVendor(null);
                    onChange({
                      vendorName: '',
                      vendorRegNo: '',
                      vendorEmail: '',
                      vendorPhone: ''
                    });
                  }
                }}
                dataTestId="supplier-search-input"
              />
            </div>
          ) : (
            <SelectedVendorCard
              vendor={selectedVendor}
              onSelectDifferent={() => {
                setSelectedVendor(null);
                onChange({
                  vendorName: '',
                  vendorRegNo: '',
                  vendorEmail: '',
                  vendorPhone: ''
                });
              }}
              dataTestId="selected-vendor-card"
            />
          )}
        </div>
      ) : (
        /* 3. Manual New Vendor Inputs */
        <div data-testid="new-vendor-inputs" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Unregistered Vendor Details</h3>
              <p className="text-xs text-gray-500">Provide complete credentials for vendor onboarding and due diligence review.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Vendor Company Name *</label>
              <input
                type="text"
                value={newVendorName}
                onChange={(e) => {
                  setNewVendorName(e.target.value);
                  onChange({ vendorName: e.target.value });
                }}
                placeholder="e.g. NextGen Technologies Sdn Bhd"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Person *</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => {
                  setContactPerson(e.target.value);
                  onChange({ vendorContactPerson: e.target.value });
                }}
                placeholder="e.g. Mr. Kelvin Tan"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  onChange({ vendorEmail: e.target.value });
                }}
                placeholder="e.g. kelvin@nextgen.com.my"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Office Phone</label>
              <input
                type="text"
                value={officePhone}
                onChange={(e) => {
                  setOfficePhone(e.target.value);
                  onChange({ vendorPhone: e.target.value });
                }}
                placeholder="e.g. 03-7955 1234"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">HP Number *</label>
              <input
                type="text"
                value={hpNumber}
                onChange={(e) => {
                  setHpNumber(e.target.value);
                  onChange({ vendorHp: e.target.value });
                }}
                placeholder="e.g. 012-345 6789"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 flex items-center space-x-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-xl bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#1E40AF]/90 shadow-lg shadow-[#1E40AF]/20 flex items-center space-x-2 transition-all"
        >
          <span>Continue to Step 5</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
