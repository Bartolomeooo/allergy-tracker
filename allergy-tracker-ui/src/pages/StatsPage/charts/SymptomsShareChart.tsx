import * as React from 'react';
import {Box} from '@mui/material';
import {PieChart} from '@mui/x-charts/PieChart';
import type {SymptomsShareDatum} from '../../../utils/stats/getSymptomsShare';

function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [width, setWidth] = React.useState<number>(400);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 400;
      setWidth(Math.max(240, Math.floor(w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return {ref, width};
}

export default function SymptomsShareChart({
  data,
}: {
  data: SymptomsShareDatum[];
}) {
  const {ref, width} = useContainerWidth<HTMLDivElement>();

  return (
    <Box ref={ref} sx={{height: '100%', width: '100%'}}>
      <PieChart
        series={[
          {
            data: data.map((d) => ({
              id: d.id,
              value: d.value,
              label: d.label,
            })),
          },
        ]}
        width={width}
        height={350}
        margin={{top: 8, right: 8, bottom: 48, left: 8}}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {vertical: 'bottom', horizontal: 'center'},
          },
        }}
        sx={{
          height: '100%',
          '& .MuiChartsLegend-root': {
            justifyContent: 'center',
          },
        }}
      />
    </Box>
  );
}
