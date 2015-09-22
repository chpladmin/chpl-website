;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdditionalSoftwareController', ['$log', '$scope', function ($log, $scope) {
            var self = this;
            $scope.$watch('additionalSoftware', function (newSw) {
                if (newSw) {
                    self.additionalSoftware = newSw;
                    self.format();
                }}, true);
            $scope.$watch('isEditing', function (editing) {
                if (editing) {
                    self.isEditing = editing;
                }}, true);

            self.format = function () {
                var newString = "";
                for (var i = 0; i < self.additionalSoftware.length; i++) {
                    newString += self.additionalSoftware[i].name + "; ";
                }
                newString = newString.substring(0, newString.length - 2);
                self.prettyPrint = newString;
            };

            self.addItem = function () {
                if (self.newItem.length > 0) {
                    self.additionalSoftware.push({name: self.newItem});
                    self.newItem = '';
                    self.format();
                }
            };
        }])
        .directive('aiAdditionalSoftware', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/additionalSoftware.html',
                scope: {
                    additionalSoftware: '=',
                    isEditing: '='
                },
                controllerAs: 'vm',
                controller: 'AdditionalSoftwareController'
            };
        }]);
})();
