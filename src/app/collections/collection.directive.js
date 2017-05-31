(function () {
    'use strict';

    angular.module('chpl.collections')
        .directive('aiCollection', aiCollection)
        .controller('CollectionController', CollectionController);

    /** @ngInject */
    function aiCollection () {
        return {
            bindToController: {
                columns: '=',
                dataStore: '@',
                filter: '&',
            },
            controller: 'CollectionController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/collections/collection.html',
            transclude: {
                bodyText: 'bodyText',
                footerText: '?footerText',
                title: 'title',
            },
        };
    }

    /** @ngInject */
    function CollectionController ($log, commonService) {
        var vm = this;


        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }
    }
})();
