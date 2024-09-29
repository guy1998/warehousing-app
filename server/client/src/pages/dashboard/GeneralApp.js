import { useEffect, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { CircularProgress, Container, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppTopInstalledCountries,
  VerticalBar,
  ClientGraph,
  VisitsGraph,
} from '../../sections/@dashboard/general/app';
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';

import { getOwnInformation } from '../../sections/@dashboard/user/scripts';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const [user, setUser] = useState(null);
  const [sales, setSales] = useState();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
  }, []);
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/stats/sales`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const resultJSON = JSON.parse(result);
        setSales(resultJSON);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Page title="Prendi il Caffee">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto' }}
          >
            {user ? (
              <AppWelcome displayName={user?.name} />
            ) : (
              <CircularProgress color="success" style={{ margin: 'auto auto' }} />
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <ClientGraph />
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <VisitsGraph />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <AnalyticsWidgetSummary title="Sales Today" total={sales} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
