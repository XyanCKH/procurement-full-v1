import React, { ReactNode } from 'react';
import { Home, FileText, ShoppingCart, Settings, ShieldAlert, User, Bell } from 'lucide-react';

interface FinanceShellLayoutProps {
  children: ReactNode;
}

export default function FinanceShellLayout({ children }: FinanceShellLayoutProps) {
  return (
    <div className="flex h-screen bg-[#FAFBFC] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-gradient-to-b from-[#0B1220] to-[#111A2E] text-white border-r border-[#1E293B]">
        <div className="p-6 flex items-center space-x-3 border-b border-[#1E293B]/50">
          <div className="w-9 h-9 rounded-lg bg-[#FFB81D] flex items-center justify-center font-bold text-[#0B1220]">
            PS
          </div>
          <div>
            <h2 className="font-bold text-base tracking-wide">Procurement</h2>
            <p className="text-xs text-gray-400">Enterprise System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <a
            href="#dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#FFB81D]/10 text-[#FFB81D] border border-[#FFB81D]/20 shadow-sm"
          >
            <Home className="w-5 h-5 text-[#FFB81D]" />
            <span>Dashboard</span>
          </a>

          <a
            href="#demands"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-400" />
            <span>Demand Intake</span>
          </a>

          <a
            href="#orders"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span>Purchase Orders</span>
          </a>

          <a
            href="#compliance"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ShieldAlert className="w-5 h-5 text-gray-400" />
            <span>Compliance</span>
          </a>

          <a
            href="#settings"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-[#1E293B]">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-black/20">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">john.doe@enterprise.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-800">Finance System Shell</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFB81D]/20 text-amber-800 border border-[#FFB81D]/40">
              Production V1
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFB81D] rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">Administrator</span>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#FAFBFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
