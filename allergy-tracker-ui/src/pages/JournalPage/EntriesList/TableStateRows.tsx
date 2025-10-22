import {Alert, Skeleton, TableCell, TableRow} from '@mui/material';
import EmptyState from './EmptyState';

export function LoadingRows() {
  return (
    <>
      {Array.from({length: 3}, (_, i) => (
        <TableRow key={`s-${i}`}>
          {Array.from({length: 9}, (_, j) => (
            <TableCell key={j} align="center">
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function ErrorRow({error}: {error: string}) {
  return (
    <TableRow>
      <TableCell colSpan={9}>
        <Alert severity="error">{error}</Alert>
      </TableCell>
    </TableRow>
  );
}

export function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={9}>
        <EmptyState />
      </TableCell>
    </TableRow>
  );
}
