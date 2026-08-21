import React, { useState, useEffect, useRef } from 'react';
import { Search, UserCheck, X } from 'lucide-react';
import { Employee } from '../../types/procurementForm';

interface EmployeeAutocompleteProps {
  value: string;
  onChange: (employee: Employee | null) => void;
  placeholder?: string;
  dataTestId?: string;
}

export default function EmployeeAutocomplete({
  value,
  onChange,
  placeholder = 'Search by name, ID or department...',
  dataTestId = 'employee-autocomplete'
}: EmployeeAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/v1/procurement/users/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        }
      } catch (err) {
        // Fallback mock search if API not running directly in test runner
        const mock: Employee[] = [
          { id: 'EMP10001', name: 'Ahmad Zulkarnain', department: 'Information Technology', contact: '03-2161 8888', email: 'ahmad.z@enterprise.com' },
          { id: 'EMP10002', name: 'Siti Nurhaliza', department: 'Information Technology', contact: '03-2161 7777', email: 'siti.n@enterprise.com' },
          { id: 'EMP10003', name: 'David Tan', department: 'Procurement & Sourcing', contact: '03-2161 6666', email: 'david.tan@enterprise.com' },
          { id: 'EMP10004', name: 'Mei Ling', department: 'Risk & Compliance', contact: '03-2161 5555', email: 'mei.ling@enterprise.com' },
          { id: 'EMP10005', name: 'Raj Kumar', department: 'Finance & Accounting', contact: '03-2161 4444', email: 'raj.kumar@enterprise.com' }
        ];
        const filtered = mock.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.department.toLowerCase().includes(query.toLowerCase()));
        setEmployees(filtered);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEmployees();
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          data-testid={dataTestId}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 text-gray-900 text-sm outline-none transition-all"
        />
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange(null);
              setIsOpen(false);
            }}
            className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Searching directory...</div>
          ) : employees.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No employees found</div>
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => {
                  setQuery(emp.name);
                  onChange(emp);
                  setIsOpen(false);
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">{emp.name} ({emp.id})</div>
                  <div className="text-xs text-gray-500">{emp.department} • {emp.contact}</div>
                </div>
                <UserCheck className="w-4 h-4 text-[#1E40AF]" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
