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
                    if (self.editMode)
                        self.buildEditObject();
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
            $scope.$watch('applicableCqmCriteria', function (cqmCriteria) {
                if (cqmCriteria) {
                    self.applicableCqmCriteria = cqmCriteria;
                    self.buildCqmObject();
                }}, true);
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
                if (self.builtCqms) {
                    for (var i = 0; i < self.builtCqms.length; i++) {
                        if (self.builtCqms[i].version) {
                            self.editCqms[self.builtCqms[i].number] = self.builtCqms[i].version;
                        } else {
                            self.editCqms[self.builtCqms[i].number] = self.builtCqms[i].success;
                        }
                    }
                }
            };

            self.buildCqmObject = function () {
                self.allCqms = {};
                var active;
                for (var i = 0; i < self.applicableCqmCriteria.length; i++) {
                    active = self.applicableCqmCriteria[i];
                    if (!self.allCqms[active.number]) {
                        self.allCqms[active.number] = {number: active.number,
                                                       title: active.title,
                                                       versions: []};
                    }
                    if (active.cqmVersion) {
                        self.allCqms[active.number].hasVersion = true;
                        self.allCqms[active.number].versions.push(active.cqmVersion);
                    } else {
                        self.allCqms[active.number].hasVersion = false;
                    }
                }
                if (self.cqms) {
                    self.compileCqms();
                }
            };

            self.compileCqms = function () {
                var foundCqms = [];
                self.builtCqms = [];
                for (var i = 0; i < self.cqms.length; i++) {
                    var cqm = self.cqms[i];
                    if (foundCqms.indexOf(cqm.number) >= 0) {
                        if (cqm.version) {
                            for (var j = 0; j < self.builtCqms.length; j++) {
                                if (self.builtCqms[j].number === cqm.number) {
                                    self.builtCqms[j].version.push(cqm.version);
                                }
                            }
                        }
                    } else {
                        if (cqm.version) {
                            cqm.hasVersion = true;
                            cqm.version = [cqm.version];
                        }
                        self.builtCqms.push(cqm);
                        foundCqms.push(cqm.number);
                    }
                }
                for (var cqm in self.allCqms) {
                    if (foundCqms.indexOf(cqm) < 0) {
                        self.builtCqms.push({
                            number: self.allCqms[cqm].number,
                            title: self.allCqms[cqm].title,
                            success: false,
                            hasVersion: self.allCqms[cqm].hasVersion
                        })
                    }
                }

                if (self.editMode) {
                    self.buildEditObject();
                }
            };

            self.saveEdits = function () {
                $log.info('saving edits');
                $log.info(self.editCerts);
                $log.info(self.editCqms);
                self.isEditing = !self.isEditing
            };

            self.cancelEdits = function () {
                $log.info('cancelling edits');
                self.certs = $scope.certs;
                self.cqms = $scope.cqms;
                self.buildEditObject();
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
                         applicableCqmCriteria: '='
                       },
                controllerAs: 'vm',
                controller: 'CertsController'
            };
        }]);
})();
