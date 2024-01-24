export type StatisticsCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

export default function StatisticsCard({ title, value, description }: StatisticsCardProps) {
  return (
    <div
      className="bg-card text-card-foreground rounded-xl border shadow"
      data-test="statistics-card"
    >
      <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      </div>
      <div className="p-4 pt-0">
        <div className="text-4xl font-bold">{value}</div>
      </div>
      {description && <div className="text-muted-foreground p-4 pt-0 text-xs">{description}</div>}
    </div>
  );
}
