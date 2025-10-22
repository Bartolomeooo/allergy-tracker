import {Button, type ButtonProps} from '@mui/material';

type Props = Omit<ButtonProps, 'variant' | 'color'> & {
  tone?: 'primary' | 'neutral' | 'danger';
};

export default function ActionButton({tone = 'primary', ...props}: Props) {
  const variant: ButtonProps['variant'] =
    tone === 'neutral' ? 'outlined' : 'contained';

  const color: ButtonProps['color'] =
    tone === 'neutral' ? 'inherit' : tone === 'danger' ? 'error' : 'primary';

  return (
    <Button
      {...props}
      variant={variant}
      color={color}
      sx={{
        borderRadius: 2,
        px: 2.5,
        ...props.sx,
      }}
    />
  );
}
