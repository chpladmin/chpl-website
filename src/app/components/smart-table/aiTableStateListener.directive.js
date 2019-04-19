angular.module('chpl.components')
    .directive('aiTableStateListener',function (){
        return {
            require: '^stTable',
            scope: {
                onChange: '&aiTableStateListener',
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
