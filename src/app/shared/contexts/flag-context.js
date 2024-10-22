import { createContext } from 'react';

const FlagContext = createContext({
  cmsA9GracePeriodEndIsOn: false,
  demographicChangeRequestIsOn: false,
  ssoIsOn: false,
  uploadToUpdateIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
