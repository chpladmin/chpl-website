import React from 'react';

import { reactToAngularComponent } from 'services/angular-react-helper';

import ChplAnnouncementsFabWrapper from './announcements-fab-wrapper';

angular
  .module('chpl.components')
  .component('chplAnnouncementsFabBridge', reactToAngularComponent(ChplAnnouncementsFabWrapper));
