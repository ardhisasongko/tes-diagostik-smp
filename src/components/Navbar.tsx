import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BookOpen, 
  Copy, 
  Check,
  FileSpreadsheet
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'student-portal' | 'form' | 'dashboard' | 'list' | 'rubric';
  setActiveTab: (tab: 'student-portal' | 'form' | 'dashboard' | 'list' | 'rubric') => void;
  evaluatedCount: number;
  totalCount: number;
  onOpenPromptModal: () => void;
  onExportCSV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  evaluatedCount,
  totalCount,
  onOpenPromptModal,
  onExportCSV
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="font-black text-sm sm:text-base leading-tight tracking-tight text-white truncate max-w-[220px] sm:max-w-none">
                  SMP PLUS AT-THAHIRIN
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-extrabold px-1.5 sm:px-2 py-0.5 rounded border border-amber-400/30 shrink-0">
                  Kelas 9
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 flex items-center gap-1">
                <span className="font-semibold text-indigo-300">Asesmen Diagnostik Bahasa Inggris</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex text-emerald-400 font-bold items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Gemini AI
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions & System Prompt Copy */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenPromptModal}
              className="px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 min-h-[40px] sm:min-h-0"
              title="Lihat & Salin Instruksi Sistem untuk AI Studio"
            >
              <Copy className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Instruksi System AI Studio</span>
              <span className="sm:hidden text-[11px]">Prompt</span>
            </button>

            <button
              onClick={onExportCSV}
              className="px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow-sm min-h-[40px] sm:min-h-0"
              title="Ekspor CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>

            <div className="hidden lg:flex bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700 text-xs text-slate-300">
              Evaluasi: <span className="text-emerald-400 font-bold ml-1">{evaluatedCount}</span>/{totalCount} Siswa
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Mobile Friendly Scrollable */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('student-portal')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'student-portal'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Mode Siswa (Isi Mandiri)</span>
          </button>

          <div className="w-px h-6 bg-slate-800 my-auto mx-1 shrink-0" />

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard Guru</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'form'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>+ Input & Evaluasi</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Daftar Siswa ({totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'rubric'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Rubrik Asesmen</span>
          </button>
        </div>
      </div>
    </header>
  );
};
