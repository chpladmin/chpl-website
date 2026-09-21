// Import base SCSS file and then all SCSS files in directories
import 'swagger-ui-react/swagger-ui.css';
import './index.scss';
import '../assets/favicons/favicons';

import angular from 'angular';
import 'angular-ui-router';

// import app modules
import administration from './pages/administration/index';
import /* chartsModule from */ './pages/charts/index';
import compare from './pages/compare/index';
import /* complianceDashboardModule from */ './pages/compliance-dashboard/index';
import /* componentsModule from */ './components/index';
import listing from './pages/listing/index';
import organizations from './pages/organizations/index';
import reports from './pages/reports/index';
import resources from './pages/resources/index';
import /* registrationModule from */ './pages/registration/index';
import './pages/search/index';
import services from './services/index';
import /* sharedModule from */ './shared/index';
import subscriptions from './pages/subscriptions/index';
import surveillance from './pages/surveillance/index';
import users from './pages/users/index';

function importAll(r) {
  r.keys().forEach(r);
}
importAll(
  require.context('./', true, /^.*\/.*\.scss$/),
);

const dependencies = [
  'ui.router',
  administration.name,
  compare.name,
  listing.name,
  organizations.name,
  reports.name,
  resources.name,
  services.name,
  subscriptions.name,
  surveillance.name,
  users.name,
  'chpl.charts',
  'chpl.compliance-dashboard',
  'chpl.search',
  'chpl.components',
  'chpl.registration',
  'chpl.shared',
];

const appModule = angular.module('chpl', dependencies);

require('./index.route');
require('./index.run');
require('./index.config');

export default appModule;
