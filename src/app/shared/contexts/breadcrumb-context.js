import { createContext } from 'react';

const BreadcrumbContext = createContext({
  append: () => {},
  drop: () => {},
});
BreadcrumbContext.displayName = 'breadcrumbs';

export default BreadcrumbContext;
