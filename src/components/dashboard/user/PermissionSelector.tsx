'use client';

import React, { useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { availablePages, type PageAccess } from '@/lib/permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PermissionSelectorProps {
  selectedPages: PageAccess[];
  onChange: (pages: PageAccess[]) => void;
  disabled?: boolean;
  maxPages?: number;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPages,
  onChange,
  disabled = false,
  maxPages = 11,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectPage = useCallback(
    (pageId: PageAccess, checked: boolean) => {
      if (checked) {
        if (selectedPages.length >= maxPages) {
          return;
        }
        onChange([...selectedPages, pageId]);
      } else {
        onChange(selectedPages.filter((p) => p !== pageId));
      }
    },
    [selectedPages, onChange, maxPages]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedPages.length === availablePages.length) {
      onChange([]);
    } else {
      onChange(availablePages.map((p) => p.id));
    }
  }, [selectedPages, onChange]);

  const filteredPages = availablePages.filter((page) =>
    page.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = selectedPages.length === availablePages.length;

  return (
    <Card className="border border-amber-200/20 dark:border-amber-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Page Access Permissions</CardTitle>
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950">
            {selectedPages.length}/{availablePages.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-950 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />

        {/* Select All */}
        <div className="flex items-center gap-2 p-3 border border-amber-200/20 dark:border-amber-900/20 rounded-lg bg-amber-50/30 dark:bg-amber-950/20">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            disabled={disabled}
            className="cursor-pointer"
          />
          <Label
            htmlFor="select-all"
            className="flex-1 cursor-pointer font-semibold text-amber-900 dark:text-amber-100"
          >
            {isAllSelected ? 'Deselect All' : 'Select All Pages'}
          </Label>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
          {filteredPages.map((page) => {
            const isSelected = selectedPages.includes(page.id);
            return (
              <div
                key={page.id}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            
              >
                <Checkbox
                  id={page.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleSelectPage(page.id, checked as boolean)}
                  disabled={disabled}
                  className="cursor-pointer"
                />
                <Label
                  htmlFor={page.id}
                  className="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-lg">{page.icon}</span>
                  <span className="text-sm font-medium">{page.label}</span>
                </Label>
                {isSelected && <Check className="h-4 w-4 text-amber-600" />}
              </div>
            );
          })}
        </div>

        {/* Selected Pages Summary */}
        {selectedPages.length > 0 && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Selected Pages ({selectedPages.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedPages.map((page) => {
                const pageLabel = availablePages.find((p) => p.id === page)?.label;
                return (
                  <Badge
                    key={page}
                    variant="secondary"
                    className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 flex items-center gap-1"
                  >
                    {pageLabel}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectPage(page, false)} />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionSelector;
