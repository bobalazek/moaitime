export interface EventInterface {
  id: string;
  title: string;
  description?: string;
  isAllDay: boolean;
  startsAt: string;
  endsAt: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventWithVerticalPosition = EventInterface & { left: number; width: number };
