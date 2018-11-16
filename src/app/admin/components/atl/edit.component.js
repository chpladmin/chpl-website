export const EditAtlComponent = {
    templateUrl: 'chpl.admin/components/atl/edit.html',
    bindings: {
        atl: '<',
        action: '@',
        onChange: '&',
    },
    controller: class EditAtlController {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.atl) {
                this.atl = angular.copy(changes.atl.currentValue);
            }
        }

        update () {
            const change = {
                atl: angular.copy(this.atl),
                valid: this.editForm.$valid,
            };
            this.onChange(change);
        }
    },
}

angular.module('chpl.admin')
    .component('aiEditAtl', EditAtlComponent);
