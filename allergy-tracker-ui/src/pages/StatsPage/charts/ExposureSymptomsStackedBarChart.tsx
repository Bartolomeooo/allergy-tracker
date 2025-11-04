import * as React from 'react';
import {Box} from '@mui/material';
import {BarChart} from '@mui/x-charts/BarChart';
import type {HeatmapAxis} from '../../../utils/stats/getExposureSymptoms.ts';

function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [width, setWidth] = React.useState<number>(600);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 600;
      setWidth(Math.max(520, Math.floor(w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return {ref, width};
}

export default function ExposureSymptomsStackedBarChart({
  xLabels,
  yLabels,
  matrix,
}: HeatmapAxis) {
  const {ref, width} = useContainerWidth<HTMLDivElement>();

  const series = React.useMemo(
    () =>
      xLabels.map((label, xi) => ({
        label,
        data: yLabels.map((_, yi) => matrix[yi][xi] ?? 0),
        stack: 'total' as const,
        valueFormatter: (v: number | null) => (v == null ? '' : `${v}%`),
      })),
    [xLabels, yLabels, matrix],
  );

  const height = Math.max(360, 44 * (yLabels.length + 2));

  const yAxisWidth = React.useMemo(() => {
    const longest = Math.max(0, ...yLabels.map((y) => y.length));
    return Math.min(240, Math.max(80, 8 * longest + 16));
  }, [yLabels]);

  return (
    <Box ref={ref} sx={{height: '100%', width: '100%'}}>
      <BarChart
        width={width}
        height={height}
        layout="horizontal"
        xAxis={[
          {
            min: 0,
            max: 100,
            label: 'Udział (%)',
            valueFormatter: (v: number | null) => (v == null ? '' : `${v}%`),
          },
        ]}
        series={series}
        yAxis={[{data: yLabels, scaleType: 'band', width: yAxisWidth}]}
        margin={{top: 12, right: 16, bottom: 40, left: 16}}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {vertical: 'bottom', horizontal: 'center'},
          },
        }}
        sx={{
          '& .MuiChartsAxis-label': {fontSize: 12},
          '& .MuiChartsLegend-root': {mb: 2},
        }}
      />
    </Box>
  );
}
