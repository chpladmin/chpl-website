export const EditAtlComponent = {
    templateUrl: 'chpl.admin/components/atl/edit.html',
    bindings: {
        atl: '<',
        action: '@',
        isChplAdmin: '<',
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
                if (this.atl.retirementDate) {
                    this.atl.retirementDateObject = new Date(this.atl.retirementDate);
                }
            }
            if (changes.isChplAdmin) {
                this.isChplAdmin = angular.copy(changes.isChplAdmin.currentValue);
            }
        }

        update () {
            const change = {
                atl: angular.copy(this.atl),
                valid: this.editForm.$valid,
            };
            if (this.atl.retirementDateObject) {
                change.atl.retirementDate = this.atl.retirementDateObject.getTime();
            } else {
                change.atl.retirementDate = null;
            }
            this.onChange(change);
        }
    },
}

angular.module('chpl.admin')
    .component('aiEditAtl', EditAtlComponent);
