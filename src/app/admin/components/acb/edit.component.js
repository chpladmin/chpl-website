export const EditAcbComponent = {
    templateUrl: 'chpl.admin/components/acb/edit.html',
    bindings: {
        acb: '<',
        action: '@',
        isChplAdmin: '<',
        onChange: '&',
    },
    controller: class EditAcbController {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
                if (this.acb.retirementDate) {
                    this.acb.retirementDateObject = new Date(this.acb.retirementDate);
                }
            }
            if (changes.isChplAdmin) {
                this.isChplAdmin = angular.copy(changes.isChplAdmin.currentValue);
            }
        }

        update () {
            const change = {
                acb: angular.copy(this.acb),
                valid: this.editForm.$valid,
            };
            if (this.acb.retirementDateObject) {
                change.acb.retirementDate = this.acb.retirementDateObject.getTime();
            } else {
                change.acb.retirementDate = null;
            }
            this.onChange(change);
        }
    },
}

angular.module('chpl.admin')
    .component('aiEditAcb', EditAcbComponent);
