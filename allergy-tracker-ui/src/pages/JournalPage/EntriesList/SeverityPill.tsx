import {Box} from '@mui/material';

export default function SeverityPill({value}: {value: number}) {
  const bg =
    value >= 19
      ? 'error.main'
      : value >= 17
        ? 'error.light'
        : value >= 13
          ? 'warning.main'
          : value >= 9
            ? 'warning.light'
            : value >= 5
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
