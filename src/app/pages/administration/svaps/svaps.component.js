export const SvapsComponent = {
    templateUrl: 'chpl.administration/svaps/svaps.html',
    bindings: {
        svaps: '<',
    },
    controller: class SvapsComponent {
        constructor ($log, networkService) {
            'ngInject';
            this.$log = $log;
            this.networkService = networkService;

            this.svap = null;
            this.isEditting = false;
        }

        $onChanges (changes) {
            if (changes.svaps) {
                this.svaps = angular.copy(changes.svaps.currentValue);
            }
        }

        editSvap (svap) {
            this.svap = svap;
            this.isEditting = true;
        }

        cancel () {
            let that = this;
            this.$log.info('in cancel');
            this.svap = null;
            this.isEditting = false;
            this.networkService.getSvaps()
                    .then(response => that.svaps = response);
        }

        save () {
            this.$log.info('in save');
            let that = this;
            this.networkService.updateSvap(this.svap)
                    .then(() => {
                        that.$log.info('saved - getting all the svaps');
                        that.cancel();
                    }, error => {
                        //that.errorMessages = [error.data.error ? error.data.error : error.statusText];
                    });
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
                this.$log.info('in takeActionBarAction - save');
                this.save();
                break;
                //no default
            }
        }
    },
};

angular.module('chpl.administration')
    .component('chplSvapsPage', SvapsComponent);
