import { createContext } from 'react';

const ChangeRequestContext = createContext({
  changeRequest: {},
  setChangeRequest: () => {},
});
ChangeRequestContext.displayName = 'change-request-information';

export default ChangeRequestContext;
