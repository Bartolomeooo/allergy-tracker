import * as React from 'react';
import {Stack, Typography} from '@mui/material';
import {useEntries} from '../../hooks/useEntries';
import StatsSectionCard from './StatsSectionCard';
import ExposureFrequencyChart from './charts/ExposureFrequencyChart';
import {getTopExposures} from '../../utils/stats/getTopExposures';

export default function StatsPage() {
  const {data: entries, loading, error} = useEntries();

  const top = React.useMemo(
    () => getTopExposures(entries, {topN: 10}),
    [entries],
  );

  if (loading) return <Typography sx={{p: 3}}>Ładowanie…</Typography>;
  if (error)
    return (
      <Typography sx={{p: 3, color: 'error.main'}}>Błąd: {error}</Typography>
    );

  return (
    <Stack gap={2} sx={{p: 2}}>
      <StatsSectionCard
        title="Najczęstsze ekspozycje"
        subheader="Top 10 od początku prowadzenia dziennika"
        height={400}
        empty={top.length === 0}
      >
        <ExposureFrequencyChart data={top} />
      </StatsSectionCard>
    </Stack>
  );
}
