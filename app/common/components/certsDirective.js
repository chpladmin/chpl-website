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
            $scope.$watch('isEditing', function (editing) {
                if (editing !== null) {
                    self.isEditing = editing;
                }}, true);
            $scope.$watch('applicableCqmCriteria', function (cqmCriteria) {
                if (cqmCriteria) {
                    self.applicableCqmCriteria = cqmCriteria;
                    self.buildCqmObject();
                }}, true);
            self.viewAllCerts = $scope.viewAllCerts;
            self.editMode = $scope.editMode;

            self.editCqms = {};

            self.buildCqmObject = function () {
                self.allCqms = {};
                var active;
                for (var i = 0; i < self.applicableCqmCriteria.length; i++) {
                    active = self.applicableCqmCriteria[i];
                    if (active.cmsId) {
                        if (!self.allCqms[active.cmsId]) {
                            self.allCqms[active.cmsId] = angular.copy(active);
                            delete self.allCqms[active.cmsId].cqmVersion;
                            delete self.allCqms[active.cmsId].cqmVersionId;
                            delete self.allCqms[active.cmsId].criterionId;
                            self.allCqms[active.cmsId].versions = [];
                            self.allCqms[active.cmsId].hasVersion = true;
                            self.allCqms[active.cmsId].id = active.cmsId;
                        }
                        self.allCqms[active.cmsId].versions.push(active.cqmVersion);
                    } else {
                        self.allCqms['NQF-' + active.nqfNumber] = {id: 'NQF-' + active.nqfNumber,
                                                                   title: active.title,
                                                                   hasVersion: false};
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
                    if (cqm.cmsId && foundCqms.indexOf(cqm.cmsId) >= 0) {
                        for (var j = 0; j < self.builtCqms.length; j++) {
                            if (self.builtCqms[j].id === cqm.cmsId) {
                                self.builtCqms[j].version.push(cqm.version);
                            }
                        }
                    } else {
                        if (cqm.cmsId) {
                            cqm.id = cqm.cmsId;
                            cqm.hasVersion = true;
                            if (typeof(cqm.version) === 'string') {
                                cqm.version = [cqm.version];
                            }
                        } else {
                            cqm.id = 'NQF-' + cqm.nqfNumber;
                            cqm.hasVersion = false;
                        }
                        self.builtCqms.push(cqm);
                        foundCqms.push(cqm.id);
                    }
                }
                for (var cqm in self.allCqms) {
                    if (foundCqms.indexOf(cqm) < 0) {
                        var newCqm = angular.copy(self.allCqms[cqm]);
                        newCqm.success = false;
                        delete newCqm.versions;
                        self.builtCqms.push(newCqm)
                    }
                }

                if (self.editMode) {
                    self.buildEditObject();
                }
            };

            self.buildEditObject = function () {
                if (self.builtCqms) {
                    for (var i = 0; i < self.builtCqms.length; i++) {
                        if (self.builtCqms[i].version) {
                            self.editCqms[self.builtCqms[i].cmsId] = self.builtCqms[i].version;
                        } else {
                            self.editCqms[self.builtCqms[i].id] = self.builtCqms[i].success;
                        }
                    }
                }
            };

            self.saveEdits = function () {
                self.countCerts = 0;
                self.countCqms = 0;

                console.debug('save');

                for (var i = 0; i < self.certs.length; i++) {
                    if (self.certs[i].success) {
                        self.countCerts += 1;
                    }
                }

                $scope.cqms = [];
                for (var i = 0; i < self.builtCqms.length; i++) {
                    if (self.editCqms[self.builtCqms[i].cmsId]) {
                        if (self.editCqms[self.builtCqms[i].cmsId].length > 0) {
                            self.builtCqms[i].success = true;
                            self.builtCqms[i].version = self.editCqms[self.builtCqms[i].cmsId];
                            self.countCqms += 1;
                            for (var j = 0; j < self.builtCqms[i].version.length; j++) {
                                var cqm = angular.copy(self.builtCqms[i]);
                                cqm.success = true;
                                cqm.version = self.builtCqms[i].version[j];
                                $scope.cqms.push(cqm);
                            }
                        } else {
                            self.builtCqms[i].success = false;
                            delete(self.builtCqms[i].version);
                        }
                    } else {
                        if (!self.builtCqms[i].cmsId) {
                            self.builtCqms[i].success = self.editCqms[self.builtCqms[i].id];
                            if (self.builtCqms[i].success) {
                                self.countCqms += 1;
                            }
                            $scope.cqms.push(self.builtCqms[i]);
                        }
                    }
                }
            };

            self.cancelEdits = function () {
                $log.info('cancelling edits');
                self.certs = angular.copy($scope.certs);
                self.cqms = angular.copy($scope.cqms);
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
                         isEditing: '=',
                         applicableCqmCriteria: '=',
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
