import { ChplEllipsis, reactToAngularComponent } from './util/';

angular
    .module('chpl.components', [
        'angularMoment',
        'angulartics',
        'chpl.services',
        'feature-flags',
        'ngAvatar',
        'ngCytoscape',
        'ngFileUpload',
        'ngIdle',
        'ngResource',
        'ngStorage',
        'smart-table',
        'toaster',
        'ui.bootstrap',
        'ui.router',
    ])
    .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis));
