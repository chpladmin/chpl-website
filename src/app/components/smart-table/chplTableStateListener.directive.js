angular.module('chpl.components')
    .directive('chplTableStateListener',function (){
        return {
            require: '^stTable',
            scope: {
                onChange: '&chplTableStateListener',
            },

            link: function (scope, element, attr, stTable) {
                scope.$watch(function () {
                    return stTable.tableState();
                },
                function (newVal) {
                    scope.onChange({tableState: newVal, tableController: stTable})
                },
                true)},
        }
    });
