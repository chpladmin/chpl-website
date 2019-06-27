export const OncAcbsComponent = {
    templateUrl: 'chpl.organizations/onc-acbs/onc-acbs.html',
    bindings: {
        acb: '<',
        allAcbs: '<',
        editableAcbs: '<',
    },
    controller: class OncAcbsComponent {
        constructor ($log, $scope, $state, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
            this.roles = ['ROLE_ACB'];

            this.showAcb = acb => {
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
                this.loadUsers();
            }
        }

        canEdit (acb) {
            return this.editableAcbs && this.editableAcbs.reduce((acc, cur) => acc || cur.id === acb.id, false);
        }

        loadAcbs () {
            let that = this;
            this.networkService.getAcbs(true).then(response => that.editableAcbs = angular.copy(response.acbs));
        }

        loadUsers () {
            this.networkService.getUsersAtAcb(this.activeAcb).then(results => this.users = results.users);
        }

        takeAction (action, data) {
            let that = this;
            if (!this.acb) {
                switch (action) {
                case 'edit':
                    this.activeAcb = data.id;
                    this.loadUsers();
                    break;
                case 'save':
                    this.networkService.modifyACB(data).then(() => that.networkService.getAcbs(false).then(response => that.allAcbs = response.acbs));
                    this.activeAcb = undefined;
                    break;
                case 'cancel':
                    this.activeAcb = undefined;
                    break;
                    //no default
                }
            } else if (action === 'save') {
                this.networkService.modifyACB(data).then(() => that.networkService.getAcbs(false).then(response => that.allAcbs = response.acbs));
            }
        }

        takeUserAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromAcb(data, this.activeAcb)
                    .then(() => that.loadUsers());
                break;
            case 'invite':
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.activeAcb,
                }).then(() => that.toaster.pop({
                    type: 'success',
                    title: 'Email sent',
                    body: 'Email sent successfully to ' + data.email,
                }));
                break;
            case 'refresh':
                that.loadUsers();
                break;
            case 'reload':
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplOncAcbs', OncAcbsComponent);
