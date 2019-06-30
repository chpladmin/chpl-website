export const OncAcbsComponent = {
    templateUrl: 'chpl.organizations/onc-acbs/onc-acbs.html',
    bindings: {
        allAcbs: '<',
        editableAcbs: '<',
    },
    controller: class OncAcbsComponent {
        constructor ($anchorScroll, $log, $q, $scope, $state, authService, networkService, toaster, utilService) {
            'ngInject'
            this.$anchorScroll = $anchorScroll;
            this.$log = $log;
            this.$q = $q;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
            this.range = utilService.range;
            this.rangeCol = utilService.rangeCol;
            this.roles = ['ROLE_ACB'];
            this.columnCount = 2;
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', () => that.loadAcbs());
            this.$scope.$on('$destroy', loggedIn);
        }

        $onChanges (changes) {
            if (changes.allAcbs && changes.allAcbs.currentValue) {
                this.allAcbs = angular.copy(changes.allAcbs.currentValue.acbs);
            }
            if (changes.editableAcbs && changes.editableAcbs.currentValue) {
                this.editableAcbs = angular.copy(changes.editableAcbs.currentValue.acbs);
            }
            if (this.allAcbs) {
                this.prepAcbs();
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
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                this.networkService.getUsersAtAcb(this.activeAcb.id).then(results => this.users = results.users);
            }
        }

        prepAcbs () {
            this.allAcbs = this.allAcbs.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        }

        takeAction (action, data) {
            let that = this;
            if (!this.acb) {
                switch (action) {
                case 'view':
                    this.activeAcb = data;
                    this.isActive = true;
                    this.loadUsers();
                    this.$anchorScroll();
                    break;
                case 'edit':
                    this.activeAcb = data;
                    this.isEditing = true;
                    this.loadUsers();
                    this.$anchorScroll();
                    break;
                case 'save':
                    this.networkService.modifyACB(data).then(() => that.networkService.getAcbs(false).then(response => {
                        that.allAcbs = response.acbs;
                        that.prepAcbs();
                    }));
                    this.isEditing = false;
                    if (!this.isActive) {
                        this.activeAcb = undefined;
                    }
                    break;
                case 'cancel':
                    if (this.isActive && this.isEditing) {
                        this.isEditing = false;
                    } else if (this.isActive) {
                        this.isActive = false;
                        this.activeAcb = undefined;
                    } else if (this.isEditing) {
                        this.isEditing = false;
                        this.activeAcb = undefined;
                    }
                    this.isCreating = false;
                    break;
                case 'create':
                    this.networkService.createACB(data).then(() => {
                        let promises = [
                            that.networkService.getAcbs(false).then(response => {
                                that.allAcbs = response.acbs;
                                that.prepAcbs();
                            }),
                            that.networkService.getAcbs(true).then(response => that.editableAcbs = response.acbs),
                        ];
                        that.$q.all(promises);
                    });
                    this.isCreating = false;
                    break;
                    //no default
                }
            } else if (action === 'save') {
                this.networkService.modifyACB(data).then(() => that.networkService.getAcbs(false).then(response => {
                    that.allAcbs = response.acbs;
                    that.prepAcbs();
                }));
            }
        }

        takeUserAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromAcb(data, this.activeAcb.id)
                    .then(() => that.loadUsers());
                break;
            case 'invite':
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.activeAcb.id,
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
