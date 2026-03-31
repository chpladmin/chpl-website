import { createContext } from 'react';

const UrlCheckerContext = createContext({
  url: '',
  setUrl: () => {},
});
UrlCheckerContext.displayName = 'url-checker';

export default UrlCheckerContext;
