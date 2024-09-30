import ChplActivityWrapper from './activity/activity-wrapper';
import ChplQuestionableActivityWrapper from './questionable-activity/questionable-activity-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.reports', [
    'chpl.services',
    'feature-flags',
    'ngCsv',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplActivityWrapperBridge', reactToAngularComponent(ChplActivityWrapper))
  .component('chplQuestionableActivityWrapperBridge', reactToAngularComponent(ChplQuestionableActivityWrapper));
