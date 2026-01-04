import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Tag, ChevronDown, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { REPORTS } from '../reports';
import { useSettings } from '../context/SettingsContext';

// --- Reusable Dropdown Component ---
interface DropdownProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  icon?: React.ComponentType<any>;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selected, onSelect, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-theme border-[length:var(--border-width)] transition-all text-xs md:text-sm font-medium min-w-[160px] justify-between ${isOpen ? 'bg-accent-primary/10 border-accent-primary text-text-primary' : 'bg-card/60 border-border text-text-secondary hover:border-accent-primary/50 hover:text-text-primary hover:bg-card/80'}`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} />}
          <span className="truncate max-w-[120px]">{selected || label}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full mt-2 left-0 w-full min-w-[200px] max-h-60 overflow-y-auto glass-panel z-50 py-2 custom-scrollbar shadow-2xl"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-text-primary/5 transition-colors ${selected === opt ? 'text-accent-primary font-semibold bg-accent-primary/5' : 'text-text-secondary'}`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ReportArchive = () => {
  const { isPlainText } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest' | 'A-Z'>('Newest');

  const gridTopRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 10;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(REPORTS.map(r => r.category));
    return ['All Categories', ...Array.from(cats).sort()];
  }, []);

  // Filter & Sort Logic
  const processedReports = useMemo(() => {
    let result = REPORTS.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All Categories' ? true : report.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === 'Oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === 'A-Z') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(processedReports.length / itemsPerPage);
  const currentReports = processedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Smart Pagination
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [searchQuery, selectedCategory, sortOrder]);

  useEffect(() => {
    setExpandedId(null);
    if (gridTopRef.current) {
      const rect = gridTopRef.current.getBoundingClientRect();
      if (rect.top < 100) {
        gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  const cycleSort = () => {
    if (sortOrder === 'Newest') setSortOrder('Oldest');
    else if (sortOrder === 'Oldest') setSortOrder('A-Z');
    else setSortOrder('Newest');
  };

  if (isPlainText) {
    // ... Plain text implementation remains same ...
    return (
      <div className="w-full" ref={gridTopRef}>
        <div className="mb-8 border-b border-white/20 pb-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">04_INTELLIGENCE_ARCHIVE</h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="[SEARCH_DATABASE]"
              className="bg-black border border-white/30 p-2 text-white font-mono text-sm w-full max-w-md focus:border-white outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="text-xs font-mono text-green-500">
              <span>[CATEGORY]: {selectedCategory}</span> | <span>[SORT]: {sortOrder}</span>
            </div>

            <div className="flex gap-2 flex-wrap text-xs text-white/50">
              <button onClick={() => { setSelectedCategory('All Categories'); setSearchQuery(''); }} className="hover:text-white underline">[RESET FILTER]</button>
              <button onClick={cycleSort} className="hover:text-white underline">[CYCLE SORT]</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentReports.map((report) => (
            <div key={report.id} className="border-l-2 border-white/20 pl-4">
              <div className="flex flex-wrap items-baseline gap-x-4 mb-1">
                <span className="text-green-500 font-bold font-mono">{report.id}</span>
                <h3 className="text-white font-bold">{report.title}</h3>
                <span className="text-white/40 text-xs font-mono">[{report.category}]</span>
              </div>
              <p className="text-white/70 text-sm mb-2 max-w-3xl">{report.summary}</p>
              <div className="text-xs text-white/30 font-mono">
                TAGS: {report.tags.join(', ')} | DATE: {report.date}
              </div>
            </div>
          ))}
          {processedReports.length === 0 && <p className="text-white/50">[NO_DATA_FOUND]</p>}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex gap-4 text-sm font-mono text-white/60">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="hover:text-white disabled:opacity-30">[PREV]</button>
            <span>PAGE {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="hover:text-white disabled:opacity-30">[NEXT]</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full" ref={gridTopRef}>
      <div className="flex flex-col gap-6 mb-12">
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-text-secondary group-focus-within:text-accent-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border-[length:var(--border-width)] border-border rounded-theme leading-5 bg-card/40 text-text-primary placeholder-text-secondary focus:outline-none focus:bg-card/80 focus:border-accent-primary transition-all duration-300"
            placeholder="Search intelligence database by keyword, tag, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-4 z-20">
            <Dropdown
              label="Category"
              options={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              icon={Filter}
            />
            <Dropdown
              label="Sort By"
              options={['Newest', 'Oldest', 'A-Z']}
              selected={sortOrder}
              onSelect={(val) => setSortOrder(val as 'Newest' | 'Oldest' | 'A-Z')}
              icon={ArrowUpDown}
            />
          </div>

          <div className="text-text-secondary text-xs md:text-sm font-mono">
            Showing {currentReports.length} of {processedReports.length} Artifacts
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 min-h-[500px] content-start">
        <AnimatePresence>
          {currentReports.map((report, index) => (
            <motion.div
              key={report.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
              className={`
                relative overflow-hidden cursor-pointer group
                glass-panel
                transition-all duration-500
                hover:border-accent-primary
                ${expandedId === report.id ? 'border-accent-primary shadow-[0_0_30px_rgba(var(--accent-primary),0.2)]' : ''}
              `}
            >
              <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono tracking-wider text-accent-primary px-2 py-0.5 rounded border border-accent-primary/20 bg-accent-primary/5">
                      {report.id}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider text-text-secondary uppercase bg-white/5 px-2 py-0.5 rounded">
                      {report.category}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                    {report.title}
                  </h3>
                </div>

                <div className="flex items-center gap-6 text-sm text-text-secondary font-mono mt-2 md:mt-0">
                  <div className="hidden md:block whitespace-nowrap">{report.date}</div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <FileText size={14} />
                    {report.readTime}
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-500 ${expandedId === report.id ? 'rotate-180 text-text-primary' : ''}`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedId === report.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-border mt-2">
                      <div className="py-6 grid md:grid-cols-[2fr_1fr] gap-8">
                        <div>
                          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Executive Summary</h4>
                          <p className="text-text-primary leading-relaxed text-sm md:text-base font-light">
                            {report.summary}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Tag size={12} /> Related Topics
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {report.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-1 rounded bg-card text-text-secondary border border-border">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-6">
                            <button className="w-full py-3 rounded-lg bg-accent-primary/10 hover:bg-accent-primary text-accent-primary hover:text-bg text-xs font-bold uppercase tracking-wider transition-colors border border-accent-primary/20 hover:border-accent-primary">
                              Read Full Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-text-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 md:gap-4 mt-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-border hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1 md:gap-2 overflow-x-auto max-w-[240px] md:max-w-none hide-scrollbar">
            {getPageNumbers().map((page, i) => (
              page === '...' ? (
                <span key={`dots-${i}`} className="text-text-secondary px-1 md:px-2 font-mono">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`min-w-[2rem] h-8 rounded-lg text-xs md:text-sm font-mono transition-all ${currentPage === page ? 'bg-accent-primary text-bg font-bold scale-110 shadow-lg shadow-accent-primary/20' : 'bg-card text-text-secondary hover:bg-card/80'}`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-border hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
