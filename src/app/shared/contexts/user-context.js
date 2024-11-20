import { createContext } from 'react';

const UserContext = createContext({
  canManageDeveloper: () => false,
  hasAnyRole: () => false,
  hasAuthorityOn: () => false,
  impersonating: false,
  setImpersonating: () => {},
  setUser: () => {},
  user: {},
});
UserContext.displayName = 'user-information';

export default UserContext;
