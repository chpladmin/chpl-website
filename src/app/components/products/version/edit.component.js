export const VersionEditComponent = {
    templateUrl: 'chpl.components/products/version/edit.html',
    bindings: {
        version: '<',
        product: '<',
        takeAction: '&',
    },
    controller: class VersionEditComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.version) {
                this.version = angular.copy(changes.version.currentValue);
            }
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
            }
        }

        cancel () {
            this.takeAction({action: 'cancel'});
        }

        isValid () {
            return this.form.$valid; // form validation
        }

        save () {
            let request = angular.copy(this.version);
            this.takeAction({action: 'edit', data: request});
        }

        takeActionBarAction (action) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'mouseover':
                this.showFormErrors = true;
                break;
            case 'save':
                this.save();
                break;
                //no default
            }
        }
    },
};

angular.module('chpl.components')
    .component('chplVersionEdit', VersionEditComponent);
