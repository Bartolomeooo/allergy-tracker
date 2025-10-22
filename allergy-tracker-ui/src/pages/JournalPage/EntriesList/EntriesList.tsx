import {useMemo, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {Stack, TableBody} from '@mui/material';
import ExposureDetailsDialog from '../../../components/ExposureDetailsDialog';
import {useEntries} from '../../../hooks/useEntries';
import {useExposureMap} from '../../../hooks/useExposureMap';
import FiltersBar from './FiltersBar';
import TableLayout from './TableLayout';
import EntriesTableHead from './EntriesTableHead';
import EntryRow from './EntryRow';
import {EmptyRow, ErrorRow, LoadingRows} from './TableStateRows';
import type {Entry} from '../../../mocks/types';

type SortKey = 'occurredOn' | 'total';
type SortDir = 'asc' | 'desc';

export default function EntriesList({
  onEdit,
  onDelete,
}: {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) {
  const {data, loading, error} = useEntries();
  const nameToId = useExposureMap();

  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('occurredOn');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [previewId, setPreviewId] = useState<number | null>(null);

  const inRange = (iso: string, start: Dayjs | null, end: Dayjs | null) => {
    if (!start && !end) return true;
    const d = dayjs(iso);
    const afterMin = !start || d.isSame(start) || d.isAfter(start);
    const beforeMax = !end || d.isSame(end) || d.isBefore(end);
    return afterMin && beforeMax;
  };

  const rows = useMemo(() => {
    const filtered = data.filter((r) => inRange(r.occurredOn, from, to));
    const mult = sortDir === 'asc' ? 1 : -1;
    return filtered.sort((a, b) =>
      sortKey === 'occurredOn'
        ? (dayjs(a.occurredOn).valueOf() - dayjs(b.occurredOn).valueOf()) * mult
        : (a.total - b.total) * mult,
    );
  }, [data, from, to, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <Stack gap={3}>
      <FiltersBar
        from={from}
        to={to}
        onFrom={setFrom}
        onTo={setTo}
        onClear={() => {
          setFrom(null);
          setTo(null);
        }}
      />

      <TableLayout>
        <EntriesTableHead
          sortKey={sortKey}
          sortDir={sortDir}
          onToggle={toggleSort}
        />

        <TableBody>
          {loading && <LoadingRows />}
          {!loading && error && <ErrorRow error={error} />}
          {!loading && !error && rows.length === 0 && <EmptyRow />}

          {!loading &&
            !error &&
            rows.map((r: Entry) => (
              <EntryRow
                key={r.id}
                row={r}
                nameToId={nameToId}
                onPreview={setPreviewId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </TableBody>
      </TableLayout>

      <ExposureDetailsDialog
        open={previewId != null}
        id={previewId}
        onClose={() => setPreviewId(null)}
      />
    </Stack>
  );
}
