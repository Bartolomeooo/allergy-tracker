export interface ExposureType {
  id: number;
  name: string;
}

export interface Entry {
  id: number;
  occurredOn: string;
  upperRespiratory: number;
  lowerRespiratory: number;
  skin: number;
  eyes: number;
  total: number;
  exposures: string[];
  note?: string;
}

export type NewEntry = Omit<Entry, 'id'>;

export interface ApiResponse<T> {
  data: T;
}
