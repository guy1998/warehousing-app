import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  small: PropTypes.bool
};

export default function Logo({ disabledLink = false, sx, small=false }) {
  const { pathname } = useLocation();
  const [redirect, setRedirect] = useState('/');

  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  useEffect(() => {
    if (pathname.includes('auth')) setRedirect('/');
    if (pathname.includes('admin')) setRedirect('/admin');
    if (pathname.includes('agent')) setRedirect('/agent');
  }, [pathname]);

  const logo = (
    <Box sx={{ width: 175, height: 40, ...sx }}>
      {!small && <img src='/logo/logo_full_1.png' alt='random'/>}
      {small && <img src='/logo/logo_single.png' alt='random1'/>}
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to={redirect}>{logo}</RouterLink>;
}
