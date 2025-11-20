export type ExposureType = {
  id: string;
  name: string;
  description?: string;
};

export type Entry = {
  id: string;
  userId: string;
  occurredOn: string;
  upperRespiratory: number;
  lowerRespiratory: number;
  skin: number;
  eyes: number;
  total: number;
  exposures: string[];
  note?: string;
};

export type NewEntry = Omit<Entry, 'id' | 'userId'>;
