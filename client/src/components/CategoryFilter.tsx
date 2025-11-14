import React from 'react'

export interface Category {
  id: string
  label: string
  icon?: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: Set<string>
  onToggleCategory: (categoryId: string) => void
  onClearAll?: () => void
  title?: string
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearAll,
  title = 'Filter by Category',
}: CategoryFilterProps) {
  const hasSelections = selectedCategories.size > 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
        {hasSelections && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onToggleCategory(cat.id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
              selectedCategories.has(cat.id)
                ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/60 text-slate-600'
            }`}
          >
            {cat.icon && <span>{cat.icon}</span>}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
