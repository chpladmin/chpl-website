import { createContext } from 'react';

const FlagContext = createContext({
  cmsA9GracePeriodEndIsOn: false,
  demographicChangeRequestIsOn: false,
  insightsIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
