import { useState, useEffect } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import { fNumber } from '../../../../utils/formatNumber';
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

const CHART_DATA = [12244, 53345, 44313, 78343];

export default function VisitsGraph() {
  const theme = useTheme();

  const visits = ['Successful', 'Unsuccessful', 'Ongoing'];
  const [count, setCount] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.dark,
      theme.palette.primary.main,
      theme.palette.primary.lighter,
      theme.palette.primary.light,
    ],
    labels: visits,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (val) => fNumber(val),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
  });

  useEffect(async () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: 'include',
    };

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/stats/visits`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const resultJSON = JSON.parse(result);
        const { successfulVisits, unsuccessfulVisits, ongoingVisits } = resultJSON;
        setCount((prevState) => [...prevState, successfulVisits, unsuccessfulVisits, ongoingVisits]);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Card>
      <CardHeader title="Visits" />
      {!loading &&
        count && ( // Render the chart only when count data is available and loading is false
          <ChartWrapperStyle dir="ltr">
            <ReactApexChart type="donut" series={count} options={chartOptions} height={280} />
          </ChartWrapperStyle>
        )}
    </Card>
  );
}
