export const SvapsComponent = {
    templateUrl: 'chpl.administration/svaps/svaps.html',
    bindings: {
        svaps: '<',
    },
    controller: class SvapsComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
            this.svap = null;
            this.isEditting = false;

            this.$log.info(this.isEditting);
        }

        $onChanges (changes) {
            if (changes.svaps) {
                this.svaps = angular.copy(changes.svaps.currentValue);
            }
        }

        editSvap (svap) {
            this.svap = svap;
            this.isEditting = true;
            this.$log.info(this.isEditting);
        }

        cancel () {
            this.svap = null;
            this.isEditting = false;
            this.$log.info(this.isEditting);
        }

        takeActionBarAction (action) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'delete':
                this.delete();
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

angular.module('chpl.administration')
    .component('chplSvapsPage', SvapsComponent);
