import type {NewEntry} from '../mocks/types';
import {Dayjs} from 'dayjs';

export function buildNewEntry(params: {
  date: Dayjs;
  upperResp: number;
  lowerResp: number;
  skin: number;
  eyes: number;
  exposures: string[];
  note: string;
}): NewEntry {
  const total = params.upperResp + params.lowerResp + params.skin + params.eyes;
  return {
    occurredOn: params.date.toDate().toISOString(),
    upperRespiratory: params.upperResp,
    lowerRespiratory: params.lowerResp,
    skin: params.skin,
    eyes: params.eyes,
    total,
    exposures: params.exposures,
    note: params.note || undefined,
  };
}

export function isEntryFormEmpty(params: {
  upperResp: number;
  lowerResp: number;
  skin: number;
  eyes: number;
  exposures: string[];
  note: string;
}): boolean {
  const {upperResp, lowerResp, skin, eyes, exposures, note} = params;
  return (
    upperResp === 0 &&
    lowerResp === 0 &&
    skin === 0 &&
    eyes === 0 &&
    exposures.length === 0 &&
    !note.trim()
  );
}
