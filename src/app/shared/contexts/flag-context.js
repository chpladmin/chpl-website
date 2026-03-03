import { createContext } from 'react';

const FlagContext = createContext({
  demographicChangeRequestIsOn: false,
  domainIsOn: false,
  insightsConnectionIsOn: false,
  insightsDisplayIsOn: false,
  rwtChangeRequestIsOn: false,
  sbulChangeRequestIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
