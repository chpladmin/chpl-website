import React, { createContext, useContext } from 'react';

import UserContext from './user-context';

const AnalyticsContext = createContext({
  analytics: {},
});
AnalyticsContext.displayName = 'analytics-context';

function AnalyticsProvider(props) {
  const { user } = useContext(UserContext);

  const data = {
    analytics: {
      group: user?.role,
      organization: user?.organizations?.length > 0 ? user.organizations.map((org) => org.name).join(';') : undefined,
    },
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return <AnalyticsContext.Provider value={data} {...props} />;
  /* eslint-enable react/jsx-props-no-spreading */
}

AnalyticsProvider.propTypes = {
};

function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}

export {
  AnalyticsContext, AnalyticsProvider, useAnalyticsContext,
};
