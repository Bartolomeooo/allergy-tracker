import {styled, useTheme} from '@mui/material/styles';
import {
  BarChart,
  type BarProps,
  type BarLabelProps,
} from '@mui/x-charts/BarChart';
import {useAnimate, useAnimateBar, useDrawingArea} from '@mui/x-charts/hooks';
import {interpolateObject} from '@mui/x-charts-vendor/d3-interpolate';

export type ExposureFrequencyRow = {
  name: string;
  days: number;
};

type Props = {
  data: ExposureFrequencyRow[];
  height?: number;
};

const COLORS = [
  '#1976d2',
  '#9c27b0',
  '#2e7d32',
  '#ef6c00',
  '#d32f2f',
  '#455a64',
  '#7b1fa2',
  '#388e3c',
  '#0288d1',
  '#c2185b',
];

export default function ExposureFrequencyChart({data, height = 360}: Props) {
  return (
    <BarChart
      height={height}
      dataset={data}
      layout="horizontal"
      series={[
        {
          id: 'days',
          dataKey: 'days',
        },
      ]}
      xAxis={[
        {
          min: 0,
          tickMinStep: 1,
          label: 'Liczba dni z objawami po ekspozycji na alergeny',
        },
      ]}
      yAxis={[{scaleType: 'band', dataKey: 'name', width: 180}]}
      margin={{top: 16, right: 24, bottom: 16, left: 16}}
      barLabel={(v) => `${v.value} dni`}
      slots={{
        bar: ColoredBar,
        barLabel: BarLabelAtBase,
      }}
      slotProps={{
        tooltip: {trigger: 'none'},
      }}
    />
  );
}

function ColoredBar(props: BarProps) {
  const {ownerState, dataIndex, x, y, height} = props;
  const theme = useTheme();
  const {width: plotWidth} = useDrawingArea();
  const animatedProps = useAnimateBar(props);

  return (
    <>
      <rect
        x={x}
        y={y}
        width={plotWidth}
        height={height}
        fill={(theme.vars || theme).palette.text.primary}
        opacity={theme.palette.mode === 'dark' ? 0.05 : 0.08}
      />
      <rect
        {...animatedProps}
        fill={COLORS[dataIndex % COLORS.length]}
        filter={ownerState.isHighlighted ? 'brightness(115%)' : undefined}
        opacity={ownerState.isFaded ? 0.35 : 1}
        data-highlighted={ownerState.isHighlighted || undefined}
        data-faded={ownerState.isFaded || undefined}
      />
    </>
  );
}

const Text = styled('text')(({theme}) => ({
  ...theme.typography.body2,
  stroke: 'none',
  fill: (theme.vars || theme).palette.common.white,
  textAnchor: 'start',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  fontWeight: 600,
}));

function BarLabelAtBase(props: BarLabelProps) {
  const {xOrigin, y, height, skipAnimation, ...otherProps} = props;

  const animatedProps = useAnimate(
    {x: xOrigin + 8, y: y + height / 2},
    {
      initialProps: {x: xOrigin, y: y + height / 2},
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (el: SVGTextElement, p) => {
        el.setAttribute('x', p.x.toString());
        el.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return <Text {...otherProps} {...animatedProps} />;
}
