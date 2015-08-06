;(function () {
    'use strict';

    angular.module('app.common')
        .directive('aiCerts', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/certs.html',
                scope: { certs: '=certs',
                         viewAllCerts: '=defaultAll',
                         editMode: '=editMode'},
                controllerAs: 'vm',
                controller: function ($scope) {
                    var self = this;
                    $scope.$watch('certs', function (newCerts) {
                        if (newCerts) {
                            self.certs = newCerts;
                        }}, true);
                    self.certs = $scope.certs;
                    self.viewAllCerts = $scope.viewAllCerts;
                    self.editMode = $scope.editMode;
                    self.editCerts = {};

                    self.buildEditObject = function () {
                        for (var i = 0; i < self.certs.length; i++) {
                            for (var j = 0; j < self.certs[i].certs.length; j++) {
                                if (self.certs[i].certs[j].hasVersion) {
                                    self.editCerts[self.certs[i].certs[j].number] = [self.certs[i].certs[j].version];
                                } else {
                                    self.editCerts[self.certs[i].certs[j].number] = self.certs[i].certs[j].isActive;
                                }
                            }
                        }};
                    if (self.editMode) {
                        $log.info('building edit object');
                        self.buildEditObject();
                    }

                    self.saveEdits = function () {
                        $log.debug('saving edits');
                        $log.debug(self.editCerts);
                        self.isEditing = !self.isEditing
                    }

                    self.cancelEdits = function () {
                        $log.debug('cancelling edits');
                        self.certs = $scope.certs;
                        self.buildEditObject();
                        self.isEditing = !self.isEditing
                    }
                }
            };
        }]);
})();
