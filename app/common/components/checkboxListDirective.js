;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CheckboxListController', ['$scope', '$log', function ($scope, $log) {
            var self = this;
            self.selection = $scope.selection;
            self.value = $scope.value;
            self.label = $scope.label;
            self.toggle = function(index) {
                var item = self.list[index],
                    i = self.selection.indexOf(item.value);
                item.checked = !item.checked;
                if (!item.checked && i > -1) {
                    self.selection.splice(i, 1);
                } else if (item.checked && i < 0) {
                    self.selection.push(item.value);
                }
            };

            $scope.$watch('items', function(value) {
                self.list = [];
                if (angular.isArray(value)) {
                    angular.forEach(value, function(item) {
                        self.list.push({
                            value: item[self.value],
                            label: item[self.label],
                            checked: self.selection.indexOf(item[self.value]) > -1
                        });
                    });
                }
            }, true);
        }]);

    angular.module('app.common')
        .directive('aiCheckboxList', function () {
            return {
                restrict: 'AE',
                replace: true,
                scope: { selection: '=selection',
                         items: '=items',
                         value: '@value',
                         label: '@label' },
                template:'<div ng-repeat="item in vm.list">' +
                    '<label>' +
                    '<input type="checkbox" value="{{item.value}}" ng-checked="item.checked" ng-click="toggle($index)"/>' +
                    '{{item.label}}' +
                    '</label>' +
                    '</div>',
                controllerAs: 'vm',
                controller: 'CheckboxListController'
            };
        });
 })();
