import { createContext } from 'react';

const DeveloperContext = createContext({
  developer: {},
  setDeveloper: () => {},
});
DeveloperContext.displayName = 'developer-information';

export default DeveloperContext;
