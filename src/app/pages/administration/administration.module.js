/* global MINUTES_BETWEEN_KEEPALIVE MINUTES_UNTIL_IDLE MINUTES_UNTIL_LOGOUT */
import 'ng-file-upload';
import ChplCmsWrapper from './cms/cms-wrapper';
import ChplJobsWrapper from './jobs/jobs-wrapper';
import ChplLoginPage from './login';
import ChplStandardsWrapper from './standards/standards-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.administration', [
    'angular-confirm',
    'chpl.constants',
    'chpl.services',
    'feature-flags',
    'ngCsv',
    'ngFileUpload',
    'ngIdle',
    'ngSanitize',
    'smart-table',
    'toaster',
    'ui.bootstrap',
    'ui.router',
  ])
  .config((IdleProvider, KeepaliveProvider) => {
    /*
     * All are measured in seconds, though the constants are in minutes
     * .idle is how long until the user is marked as "idle"
     * .timeout is how long, while idle, until they're timed out and explicitly logged out; the title of the page changes during this time
     * .interval is how frequently the system refreshes the token
     * values are defined in the webpack.config.js file
     */
    IdleProvider.idle(60 * MINUTES_UNTIL_IDLE);
    IdleProvider.timeout(60 * MINUTES_UNTIL_LOGOUT);
    KeepaliveProvider.interval(60 * MINUTES_BETWEEN_KEEPALIVE);
  })
  .component('chplCmsWrapperBridge', reactToAngularComponent(ChplCmsWrapper))
  .component('chplJobsWrapperBridge', reactToAngularComponent(ChplJobsWrapper))
  .component('chplLoginPageBridge', reactToAngularComponent(ChplLoginPage))
  .component('chplStandardsWrapperBridge', reactToAngularComponent(ChplStandardsWrapper));
