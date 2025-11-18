import React from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface BlogFiltersProps {
  categories: string[];
  filterCategory: string;
  filterQuery: string;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

export function BlogFilters({
  categories,
  filterCategory,
  filterQuery,
  onCategoryChange,
  onQueryChange,
  onClear,
}: BlogFiltersProps) {
  const { t } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const el = document.getElementById('blog-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchClick = () => {
    const el = document.getElementById('blog-results');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClear();
    }
  };

  const hasActiveFilters = filterCategory !== 'All' || filterQuery.trim().length > 0;

  return (
    <div 
      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6"
      role="search"
      aria-label="Blog filters"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <label 
            htmlFor="category-filter"
            className="text-sm text-slate-600 font-medium"
          >
            {t('pages.blog.filters.all')}
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={e => onCategoryChange(e.target.value)}
            aria-label={t('pages.blog.filters.all')}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? t('pages.blog.filters.all') : cat === 'Recent' ? t('pages.blog.filters.recent') : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor="search-input" className="sr-only">
            {t('pages.blog.filters.searchPlaceholder')}
          </label>
          <input
            id="search-input"
            type="text"
            value={filterQuery}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('pages.blog.filters.searchPlaceholder')}
            aria-label={t('pages.blog.filters.searchPlaceholder')}
            className="w-full sm:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            onClick={handleSearchClick}
            aria-label={t('pages.blog.filters.searchPlaceholder')}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            {t('pages.blog.filters.searchPlaceholder').replace('...', '')}
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              onKeyDown={handleClearKeyDown}
              aria-label={t('pages.blog.filters.clearFilters')}
              className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
            >
              {t('pages.blog.filters.clearFilters')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
