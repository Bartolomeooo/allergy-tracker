import {Box} from '@mui/material';

export default function SeverityPill({value}: {value: number}) {
  const bg =
    value === 6
      ? 'error.main'
      : value === 5
        ? 'error.light'
        : value === 4
          ? 'warning.main'
          : value === 3
            ? 'warning.light'
            : value === 2
              ? 'success.light'
              : 'success.main';

  return (
    <Box
      component="span"
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1.5,
        bgcolor: bg,
        color: 'text.primary',
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      {value}
    </Box>
  );
}
