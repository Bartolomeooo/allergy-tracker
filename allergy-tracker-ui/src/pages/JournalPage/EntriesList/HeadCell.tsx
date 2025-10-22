import {Stack, TableCell, Typography} from '@mui/material';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';

type Props = {
  label: string;
  onClick?: () => void;
  active?: boolean;
  dir?: 'asc' | 'desc';
  align?: 'left' | 'right' | 'center';
};

export default function HeadCell({
  label,
  onClick,
  active = false,
  dir = 'asc',
  align = 'left',
}: Props) {
  return (
    <TableCell
      onClick={onClick}
      align={align}
      sx={{
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        '&:hover': onClick ? {bgcolor: 'action.hover'} : undefined,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{justifyContent: 'center'}}
      >
        <span>{label}</span>
        {active ? (
          <Typography variant="caption" color="text.secondary">
            {dir === 'asc' ? '↑' : '↓'}
          </Typography>
        ) : (
          onClick && (
            <UnfoldMoreRoundedIcon
              fontSize="small"
              color="disabled"
              sx={{opacity: 0.7}}
            />
          )
        )}
      </Stack>
    </TableCell>
  );
}
