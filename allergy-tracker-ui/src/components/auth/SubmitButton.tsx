import {Button, type ButtonProps} from '@mui/material';

export default function SubmitButton(props: ButtonProps) {
  const {sx, ...rest} = props;

  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      sx={{
        alignSelf: 'center',
        px: 3,
        mt: 1,
        ...(sx ?? {}),
      }}
      {...rest}
    />
  );
}
