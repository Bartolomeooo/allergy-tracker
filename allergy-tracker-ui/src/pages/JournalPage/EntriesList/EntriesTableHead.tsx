import {TableHead, TableRow} from '@mui/material';
import HeadCell from './HeadCell';

type Props = {
  sortKey: 'occurredOn' | 'total';
  sortDir: 'asc' | 'desc';
  onToggle: (key: 'occurredOn' | 'total') => void;
};

export default function EntriesTableHead({sortKey, sortDir, onToggle}: Props) {
  return (
    <TableHead>
      <TableRow>
        <HeadCell
          label="Data"
          align="center"
          active={sortKey === 'occurredOn'}
          dir={sortDir}
          onClick={() => onToggle('occurredOn')}
        />
        <HeadCell label="Górny układ oddechowy" align="center" />
        <HeadCell label="Dolny układ oddechowy" align="center" />
        <HeadCell label="Zmiany skórne" align="center" />
        <HeadCell label="Podrażnienie oczu" align="center" />
        <HeadCell
          label="Nasilenie objawów"
          align="center"
          active={sortKey === 'total'}
          dir={sortDir}
          onClick={() => onToggle('total')}
        />
        <HeadCell label="Ekspozycje" align="center" />
        <HeadCell label="Notatka" align="center" />
        <HeadCell label="" align="center" />
      </TableRow>
    </TableHead>
  );
}
