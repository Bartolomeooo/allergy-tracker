import {Button, type ButtonProps} from '@mui/material';

type Props = Omit<ButtonProps, 'variant' | 'color'> & {
  tone?: 'primary' | 'neutral';
};

export default function ActionButton({tone = 'primary', ...props}: Props) {
  const variant = tone === 'primary' ? 'contained' : 'outlined';
  const color: ButtonProps['color'] =
    tone === 'primary' ? 'primary' : 'inherit';

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
