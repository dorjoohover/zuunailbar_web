export interface Slot {
  id: string;
  date: Date;
  artist_id: string;
  slots: string[];
  branch_id: string;
  created_at?: Date;
}
export interface ISlot {
  id?: string;
  date?: Date;
  artist_id?: string;
  slots?: string[];
  branch_id?: string;
  created_at?: Date;
}

export interface OrderSlot {
  [artist: string]: {
    slots: Record<string, string[]>;
  };
}
export interface ParallelOrderSlot {
  [service: string]: {
    [artist: string]: {
      artists: string[];
      slots: Record<string, string[]>;
    };
  };
}
