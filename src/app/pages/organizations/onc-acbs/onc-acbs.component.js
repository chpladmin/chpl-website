export const OncAcbsComponent = {
    templateUrl: 'chpl.organizations/onc-acbs/onc-acbs.html',
    bindings: {
        acb: '<',
        allAcbs: '<',
        editableAcbs: '<',
    },
    controller: class OncAcbsComponent {
        constructor ($log, $scope, $state, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;

            this.showAcb = (acb) => {
                let ret = !this.activeAcb || this.activeAcb === acb.id;
                return ret;
            }
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', () => that.loadAcbs());
            this.$scope.$on('$destroy', loggedIn);
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
            }
            if (changes.allAcbs && changes.allAcbs.currentValue) {
                this.allAcbs = angular.copy(changes.allAcbs.currentValue.acbs);
            }
            if (changes.editableAcbs && changes.editableAcbs.currentValue) {
                this.editableAcbs = angular.copy(changes.editableAcbs.currentValue.acbs);
            }
            if (this.acb) {
                this.activeAcb = this.acb.id;
            }
        }

        canEdit (acb) {
            return this.editableAcbs && this.editableAcbs.reduce((acc, cur) => acc || cur.id === acb.id, false);
        }

        loadAcbs () {
            let that = this;
            this.networkService.getAcbs(this.hasAnyRole()).then(response => that.editableAcbs = angular.copy(response.acbs));
        }

        takeAction (action, data) {
            if (!this.acb) {
                switch (action) {
                case 'edit':
                    this.activeAcb = data.id;
                    break;
                case 'save':
                    this.$log.info('saving', data);
                    this.activeAcb = undefined;
                    break;
                case 'cancel':
                    this.activeAcb = undefined;
                    break;
                    //no default
                }
            } else if (action === 'save') {
                this.$log.info('saving', data);
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplOncAcbs', OncAcbsComponent);
