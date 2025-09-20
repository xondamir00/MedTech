import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const otherSetting = {
  height: 300,
  grid: { horizontal: true },
};

const dataset = [
  {
    seoul: 30,
    month: 'Dushanba',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'February',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'March',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'April',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  }
];

const valueFormatter = (value: number | null) => `${value}mm`;

export default function FormatterDemo() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'month',
                  },
      ]}
      series={[{ dataKey: 'seoul', label: 'Tashrif buyuruvchilar', valueFormatter }]}
      {...otherSetting}
    />
  );
}