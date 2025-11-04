import * as React from 'react';
import {Stack, Typography} from '@mui/material';
import {useEntries} from '../../hooks/useEntries';
import StatsSectionCard from './StatsSectionCard';
import ExposureFrequencyChart from './charts/ExposureFrequencyChart';
import SymptomsShareChart from './charts/SymptomsShareChart';
import {getTopExposures} from '../../utils/stats/getTopExposures';
import {getSymptomsShare} from '../../utils/stats/getSymptomsShare';
import {getExposureSymptoms} from '../../utils/stats/getExposureSymptoms.ts';
import ExposureSymptomsStackedBarChart from './charts/ExposureSymptomsStackedBarChart.tsx';

export default function StatsPage() {
  const {data: entries, loading, error} = useEntries();

  const top = React.useMemo(
    () => getTopExposures(entries, {topN: 10}),
    [entries],
  );

  const symptomsShare = React.useMemo(
    () => getSymptomsShare(entries),
    [entries],
  );

  const heat = React.useMemo(
    () => getExposureSymptoms(entries, {topN: 10}),
    [entries],
  );

  if (loading) return <Typography sx={{p: 3}}>Ładowanie…</Typography>;
  if (error)
    return (
      <Typography sx={{p: 3, color: 'error.main'}}>Błąd: {error}</Typography>
    );

  return (
    <Stack spacing={5} sx={{p: 4}}>
      <StatsSectionCard
        title="Najczęstsze ekspozycje"
        subheader="10 najczęstszych ekspozycji w różnych dniach od początku prowadzenia dziennika"
        height={400}
        empty={top.length === 0}
      >
        <ExposureFrequencyChart data={top} />
      </StatsSectionCard>

      <StatsSectionCard
        title="Udział objawów"
        subheader="Udział poszczególnych grup objawów w całkowitej liczbie objawów od początku prowadzenia dziennika"
        height={370}
        empty={symptomsShare.length === 0}
      >
        <SymptomsShareChart data={symptomsShare} />
      </StatsSectionCard>

      <StatsSectionCard
        title="Wpływ ekspozycji na objawy"
        subheader="Średni procentowy udział grup objawów w całkowitej liczbie objawów, gdy dana ekspozycja wystąpiła"
        height={Math.max(360, 28 * (heat.yLabels.length + 5))}
        empty={heat.yLabels.length === 0}
      >
        <ExposureSymptomsStackedBarChart {...heat} />
      </StatsSectionCard>
    </Stack>
  );
}
