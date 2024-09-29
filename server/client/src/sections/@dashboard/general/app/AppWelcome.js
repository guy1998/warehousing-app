import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { SeoIllustration } from '../../../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
  displayName: PropTypes.string,
};

export default function AppWelcome({ displayName }) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
          Welcome back, {!displayName ? '' : displayName}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          What cool things are you gonna do today?
        </Typography>

        <Button variant="contained" to="/admin/adjustments" component={RouterLink} style={{ margin: '5px 0px' }}>
          Adjust
        </Button>
        <Button variant="contained" to="/admin/products/list" component={RouterLink} style={{ margin: '5px 5px' }}>
          Edit products
        </Button>
        <Button variant="contained" to="/admin/sales/list" component={RouterLink} style={{ margin: '5px 0px' }}>
          View sales
        </Button>
        <Button variant="contained" to="/admin/user/list" component={RouterLink} style={{ margin: '0px 5px' }}>
          Manage users
        </Button>
        <Button variant="contained" to="/admin/client/list" component={RouterLink} style={{ margin: '0px 0px' }}>
          See clients
        </Button>
      </CardContent>

      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' },
        }}
      />
    </RootStyle>
  );
}
