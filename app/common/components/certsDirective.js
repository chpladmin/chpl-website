;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertsController', ['$scope', '$log', function ($scope, $log) {
            var self = this;
            self.certs = [];
            self.cqms = [];
            self.builtCqms = [];
            $scope.$watch('certs', function (newCerts) {
                if (newCerts) {
                    self.certs = newCerts;
                }}, true);
            $scope.$watch('cqms', function (newCqms) {
                if (newCqms) {
                    self.cqms = newCqms;
                    self.addIds();
                }}, true);
            $scope.$watch('countCerts', function (newCount) {
                if (newCount) {
                    self.countCerts = newCount;
                }}, true);
            $scope.$watch('countCqms', function (newCount) {
                if (newCount) {
                    self.countCqms = newCount;
                }}, true);
            $scope.$watch('reportFileLocation', function (location) {
                if (location) {
                    self.reportFileLocation = location;
                }}, true);
            $scope.$watch('isEditing', function (editing) {
                if (editing !== null) {
                    self.isEditing = editing;
                }}, true);
            self.viewAllCerts = $scope.viewAllCerts;
            self.editMode = $scope.editMode;

            self.editCqms = {};

            self.addIds = function () {
                for (var i = 0; i < self.cqms.length; i++) {
                    self.cqms[i].id = i;
                }
            };

            self.saveEdits = function () {
                self.countCerts = 0;
                self.countCqms = 0;

                for (var i = 0; i < self.certs.length; i++) {
                    if (self.certs[i].success) {
                        self.countCerts += 1;
                    }
                }

                for (var i = 0; i < self.cqms.length; i++) {
                    if (self.cqms[i].success || self.cqms[i].successVersions.length > 0) {
                        self.countCqms += 1;
                    }
                }
            };

            self.cancelEdits = function () {
                $log.info('cancelling edits');
                self.certs = angular.copy($scope.certs);
                self.cqms = angular.copy($scope.cqms);
                self.isEditing = !self.isEditing
            };
        }]);

    angular.module('app.common')
        .directive('aiCerts', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/certs.html',
                scope: { certs: '=certs',
                         cqms: '=cqms',
                         viewAllCerts: '=defaultAll',
                         countCerts: '@countCerts',
                         countCqms: '@countCqms',
                         editMode: '=editMode',
                         reportFileLocation: '@',
                         isEditing: '=',
                         save: '&'
                       },
                controllerAs: 'vm',
                controller: 'CertsController',
                link: function (scope, element, attr, ctrl) {
                    var handler = scope.save({
                        handler: function () {
                            ctrl.saveEdits();
                        }
                    });
                    scope.$on('$destroy', handler);
                }
            };
        }]);
})();
