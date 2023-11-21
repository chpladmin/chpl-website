import { createContext } from 'react';

const CriterionContext = createContext({
  criterion: {},
  setCriterion: () => {},
});
CriterionContext.displayName = 'criterion-information';

export default CriterionContext;
