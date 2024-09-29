import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import MyAvatar from '../../../components/MyAvatar';
import { getOwnInformation } from '../../../sections/@dashboard/user/scripts';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse, userRole }) {
  const [user, setUser] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
  }, []);

  return (
    <Link
      underline="none"
      color="inherit"
      component={RouterLink}
      to={user?.role === 'admin' ? PATH_DASHBOARD.user.account : '/agent/user/account'}
    >
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          {user ? (
            <>
              <Typography variant="subtitle2" noWrap>
                {`${user?.name} ${user?.surname}`}
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                {(() => {
                  if (user) {
                    switch (user.role) {
                      case 'retail_agent':
                        return 'Retail Agent';
                      case 'horeca_agent':
                        return 'Horeca Agent';
                      default:
                        return user.role;
                    }
                  } else {
                    return null;
                  }
                })()}
              </Typography>
            </>
          ) : (
            <CircularProgress color="success" />
          )}
        </Box>
      </RootStyle>
    </Link>
  );
}
