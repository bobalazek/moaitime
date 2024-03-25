import type { LucideIcon } from 'lucide-react';

export type StatisticsCardProps = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
};

export default function StatisticsCard({ title, value, icon, description }: StatisticsCardProps) {
  const Icon = icon;

  return (
    <div
      className="bg-card text-card-foreground rounded-xl border shadow"
      data-test="statistics-card"
    >
      <div className="flex flex-row items-center justify-between p-4 pb-2">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        {Icon && (
          <div className="text-2xl">
            <Icon />
          </div>
        )}
      </div>
      <div className="p-4 pt-0">
        <div className="text-4xl font-bold">{value}</div>
      </div>
      {description && <div className="text-muted-foreground p-4 pt-0 text-xs">{description}</div>}
    </div>
  );
}
