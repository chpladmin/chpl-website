;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertsController', ['$scope', '$log', function ($scope, $log) {
            var self = this;
            $scope.$watch('certs', function (newCerts) {
                if (newCerts) {
                    self.certs = newCerts;
                }}, true);
            $scope.$watch('cqms', function (newCqms) {
                if (newCqms) {
                    self.cqms = newCqms;
                }}, true);
            $scope.$watch('countCerts', function (newCount) {
                if (newCount) {
                    self.countCerts = newCount;
                }}, true);
            $scope.$watch('countCqms', function (newCount) {
                if (newCount) {
                    self.countCqms = newCount;
                }}, true);
            self.certs = $scope.certs;
            self.cqms = $scope.cqms;
            self.countCerts = $scope.countCerts;
            self.countCqms = $scope.countCqms;
            self.viewAllCerts = $scope.viewAllCerts;
            self.editMode = $scope.editMode;
            self.editCerts = {};
            self.editCqms = {};

            self.buildEditObject = function () {
                if (self.certs) {
                    for (var i = 0; i < self.certs.length; i++) {
                        self.editCerts[self.certs[i].number] = self.certs[i].success;
                    }
                }
                if (self.cqms) {
                    for (var i = 0; i < self.cqms.length; i++) {
                        if (self.cqms[i].version) {
                            self.editCqms[self.cqms[i].number] = [self.cqms[i].version];
                        } else {
                            self.editCqms[self.cqms[i].number] = self.cqms[i].success;
                        }
                    }
                }
            }

            if (self.editMode) {
                self.buildEditObject();
            }

            self.saveEdits = function () {
                $log.info('saving edits');
                $log.info(self.editCerts);
                $log.info(self.editCqms);
                self.isEditing = !self.isEditing
            }

            self.cancelEdits = function () {
                $log.info('cancelling edits');
                self.certs = $scope.certs;
                self.cqms = $scope.cqms;
                self.buildEditObject();
                self.isEditing = !self.isEditing
            }
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
                         editMode: '=editMode' },
                controllerAs: 'vm',
                controller: 'CertsController'
            };
        }]);
})();
