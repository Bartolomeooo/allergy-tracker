import dayjs from 'dayjs';
import {
  Chip,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SeverityPill from './SeverityPill';
import type {Entry} from '../../../mocks/types';

type Props = {
  row: Entry;
  nameToId: Record<string, string>;
  onPreview: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function EntryRow({
  row,
  nameToId,
  onPreview,
  onEdit,
  onDelete,
}: Props) {
  return (
    <TableRow hover>
      <TableCell align="center" sx={{whiteSpace: 'nowrap'}}>
        {dayjs(row.occurredOn).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell align="center">{row.upperRespiratory}</TableCell>
      <TableCell align="center">{row.lowerRespiratory}</TableCell>
      <TableCell align="center">{row.skin}</TableCell>
      <TableCell align="center">{row.eyes}</TableCell>
      <TableCell align="center">
        <SeverityPill value={row.total} />
      </TableCell>

      <TableCell>
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {row.exposures.map((x) => (
            <Chip
              key={x}
              label={x}
              size="small"
              variant="outlined"
              clickable
              onClick={() => {
                const id = nameToId[x];
                if (id) onPreview(id);
              }}
            />
          ))}
        </Stack>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          title={row.note}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            lineHeight: 1.4,
          }}
        >
          {row.note ?? '—'}
        </Typography>
      </TableCell>

      <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>
        <Tooltip title="Edytuj">
          <IconButton size="small" onClick={() => onEdit?.(row.id)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Usuń">
          <IconButton size="small" onClick={() => onDelete?.(row.id)}>
            <DeleteOutlineOutlinedIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
