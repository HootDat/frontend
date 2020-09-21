import React, { useEffect } from 'react';

import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics: React.FC = () => {
  const { pathname, search } = useLocation();
  const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GA_ID;

  useEffect(() => {
    const path = `${pathname}${search}`;

    if (GOOGLE_ANALYTICS_ID && GOOGLE_ANALYTICS_ID !== '') {
      ReactGA.initialize(GOOGLE_ANALYTICS_ID);
      ReactGA.pageview(path);
    }
  }, [GOOGLE_ANALYTICS_ID, pathname, search]); // trigger only if path changes

  return <></>;
};

export default GoogleAnalytics;
