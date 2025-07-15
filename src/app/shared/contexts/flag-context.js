import { createContext } from 'react';

const FlagContext = createContext({
  demographicChangeRequestIsOn: false,
  domainIsOn: false,
  insightsIsOn: false,
  sbulChangeRequestIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
