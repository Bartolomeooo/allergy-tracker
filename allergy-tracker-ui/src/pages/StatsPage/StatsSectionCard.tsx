import * as React from 'react';
import {Card, CardContent, CardHeader, Box, Typography} from '@mui/material';

type Props = {
  title: string;
  subheader?: string;
  children: React.ReactNode;
  height?: number | string;
  empty?: boolean;
  emptyMessage?: string;
  action?: React.ReactNode;
  contentSx?: object;
};

export default function StatsSectionCard({
  title,
  subheader,
  children,
  height = 380,
  empty = false,
  emptyMessage = 'Brak danych do wyświetlenia.',
  action,
  contentSx,
}: Props) {
  return (
    <Card elevation={2}>
      <CardHeader title={title} subheader={subheader} action={action} />
      <CardContent sx={contentSx}>
        {empty ? (
          <Typography color="text.secondary">{emptyMessage}</Typography>
        ) : (
          <Box sx={{height}}>{children}</Box>
        )}
      </CardContent>
    </Card>
  );
}
