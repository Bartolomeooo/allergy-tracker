import {Slider, Stack, Typography} from '@mui/material';

type Props = {
  label: string;
  helperText?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export default function SymptomSlider({
  label,
  helperText,
  value,
  onChange,
  min = 0,
  max = 5,
  step = 1,
}: Props) {
  return (
    <Stack spacing={2} sx={{p: 1}}>
      <Stack
        spacing={3}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="subtitle1">{label}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {min}–{max}
        </Typography>
      </Stack>

      <Slider
        value={value}
        onChange={(_, v) => onChange(v)}
        min={min}
        max={max}
        step={step}
        marks
        valueLabelDisplay="auto"
        aria-label={label}
      />

      {helperText && (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </Stack>
  );
}
