import { createContext } from 'react';

const FlagContext = createContext({
  cmsA9GracePeriodEndIsOn: () => {},
  demographicChangeRequestIsOn: () => {},
  isOn: () => {},
  ssoIsOn: () => {},
  uploadToUpdateIsOn: () => {},
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
