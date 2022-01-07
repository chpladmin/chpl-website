import { createContext } from 'react';

const UserContext = createContext({
  hasAnyRole: () => false,
  impersonating: false,
  setImpersonating: () => {},
  setUser: () => {},
  user: {},
});
UserContext.displayName = 'user-information';

export default UserContext;
