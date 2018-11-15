export const EditAcbComponent = {
    templateUrl: 'chpl.admin/components/acb/edit.html',
    bindings: {
        acb: '<',
        action: '@',
        onChange: '&',
    },
    controller: class EditAcbController {

        constructor () {
            'ngInject'
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
            }
        }
    },
}

angular.module('chpl.admin')
    .component('aiAcbEdit', EditAcbComponent);
