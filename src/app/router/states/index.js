import administration from './administration';
import charts from './charts';
import compare from './compare';
import complianceDashboard from './compliance-dashboard';
import listing from './listing';
import organizations from './organizations';
import registration from './registration';
import reports from './reports';
import resources from './resources';
import search from './search';
import subscriptions from './subscriptions';
import surveillance from './surveillance';
import users from './users';

// The whole state tree, flattened. Registration order does not matter: the
// state registry queues a child until its parent exists.
const states = [
  ...administration,
  ...charts,
  ...compare,
  ...complianceDashboard,
  ...listing,
  ...organizations,
  ...registration,
  ...reports,
  ...resources,
  ...search,
  ...subscriptions,
  ...surveillance,
  ...users,
];

export default states;
