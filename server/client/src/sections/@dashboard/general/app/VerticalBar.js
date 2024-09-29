import merge from 'lodash/merge';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 'Week',
    data: [
      { name: 'Inbound Calls', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
      { name: 'Outbound Calls', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
    ],
  },
  {
    year: 'Month',
    data: [
      { name: 'Inbound Calls', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
      { name: 'Outbound Calls', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
    ],
  },
  {
    year: 'Year',
    data: [
      { name: 'Inbound Calls', data: [26, 42, 29, 41, 27, 48, 37] },
      { name: 'Outbound Calls', data: [30, 45, 34, 44, 20, 50, 45] },
    ],
  },
];

export default function VerticalBar() {
  const [seriesData, setSeriesData] = useState('Year');

  const handleChangeSeriesData = (event) => {
    setSeriesData(event.target.value);
  };

  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val}`,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Weekly Calls"
        subheader="(+43% Inbound Calls | +12% Outbound Calls) than last week"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 },
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="bar" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
