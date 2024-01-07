export const PRIORITIES = [
  {
    name: 'Low',
    value: 3,
    color: '#3B82F6',
  },
  {
    name: 'Medium',
    value: 2,
    color: '#F59E0B',
  },
  {
    name: 'High',
    value: 1,
    color: '#EF4444',
  },
];

export const prioritiesColorMap = new Map<number, string>(
  PRIORITIES.map((priority) => [priority.value, priority.color] as [number, string])
);
