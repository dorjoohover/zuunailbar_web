export interface Slot {
  branch_id: string;
  artist_id: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  key: string;
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
  [service: string]: string[];
}
export interface ParallelOrderSlot {
  [service: string]: {
    [artist: string]: {
      artists: string[];
      slots: Record<string, string[]>;
    };
  };
}
