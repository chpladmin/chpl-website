/* global DEVELOPER_MODE ENABLE_LOGGING */
//import thunkMiddleware from 'redux-thunk'
//import { createLogger } from 'redux-logger';
//import reducers from './reducers';

(function () {
    'use strict';

    angular
        .module('chpl')
        .config(config);

    /** @ngInject */
    function config ($analyticsProvider, $locationProvider, $logProvider/*, $ngReduxProvider*/, TitleProvider, stConfig) {
        // Enable/disable analytics tracking
        $analyticsProvider.developerMode(DEVELOPER_MODE);
        /*
        $analyticsProvider.developerMode(false);
        if (ENABLE_LOGGING) {
            $analyticsProvider.registerPageTrack(function (path) {
                console.log('Page tracking: ', path);
            });
            $analyticsProvider.registerEventTrack(function (action, properties) {
                console.log('Event tracking: ', action, properties);
            });
        }
        */
        $locationProvider.hashPrefix('');

        // Enable log
        $logProvider.debugEnabled(ENABLE_LOGGING);

        // Set smart-table pagination template
        stConfig.pagination.template = 'chpl.components/smart_table/stPagination.html';

        TitleProvider.enabled(false);

        // Set up Redux store
        /*
        const logger = createLogger({
            level: 'info',
            collapsed: true,
        });
        $ngReduxProvider
            .createStoreWith(reducers, [logger, thunkMiddleware], [window.__REDUX_DEVTOOLS_EXTENSION__()]);
            */
    }
})();
