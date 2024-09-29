import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authorize } from '../sections/auth/login/scripts';

function SafeRoute(props) {
  const POLLING_INTERVAL = 60000; // Poll every 1 minute
  const navigator = useNavigate();

  useEffect(() => {
    authorize(navigator, window.location.pathname);
    const intervalId = setInterval(() => {
      authorize(navigator, window.location.pathname);
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [window.location.pathname]);

  return <>{props.children}</>;
}

export default SafeRoute;
