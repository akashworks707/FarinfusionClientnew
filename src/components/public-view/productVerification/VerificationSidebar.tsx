"use client";

import { Button } from "@/components/ui/button";
import { Clock, Flame, TrendingUp } from "lucide-react";
import { IProductVerification } from "@/types/productVerification";

interface VerificationSidebarProps {
  allVerifications: IProductVerification[];
  onSelectVerification: (verification: IProductVerification) => void;
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  items: IProductVerification[];
  onSelectVerification: (verification: IProductVerification) => void;
}

function SidebarSection({
  title,
  icon,
  items,
  onSelectVerification,
}: SidebarSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
        {icon}
        <h3>{title}</h3>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No items yet
          </p>
        ) : (
          items.map((item) => (
            <Button
              key={item._id}
              variant="ghost"
              onClick={() => onSelectVerification(item)}
              className="h-auto w-full justify-start px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {item.title}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.views ?? 0} views
                </p>
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );
}

export function VerificationSidebar({
  allVerifications,
  onSelectVerification,
}: VerificationSidebarProps) {
  const mostViewed = [...allVerifications]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 3);

  const featured = allVerifications
    .filter((v) => v.featured)
    .slice(0, 3);

  const recent = [...allVerifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <aside className="sticky top-20 hidden space-y-8 lg:block">
      <SidebarSection
        title="Most Viewed"
        icon={<TrendingUp className="h-4 w-4" />}
        items={mostViewed}
        onSelectVerification={onSelectVerification}
      />

      {featured.length > 0 && (
        <SidebarSection
          title="Featured"
          icon={<Flame className="h-4 w-4" />}
          items={featured}
          onSelectVerification={onSelectVerification}
        />
      )}

      <SidebarSection
        title="Recent"
        icon={<Clock className="h-4 w-4" />}
        items={recent}
        onSelectVerification={onSelectVerification}
      />
    </aside>
  );
}