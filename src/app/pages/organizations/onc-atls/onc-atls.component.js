export const OncAtlsComponent = {
    templateUrl: 'chpl.organizations/onc-atls/onc-atls.html',
    bindings: {
        allAtls: '<',
        editableAtls: '<',
    },
    controller: class OncAtlsComponent {
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
            this.roles = ['ROLE_ATL'];
            this.columnCount = 2;
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', () => that.loadAtls());
            this.$scope.$on('$destroy', loggedIn);
        }

        $onChanges (changes) {
            if (changes.allAtls && changes.allAtls.currentValue) {
                this.allAtls = angular.copy(changes.allAtls.currentValue.atls);
            }
            if (changes.editableAtls && changes.editableAtls.currentValue) {
                this.editableAtls = angular.copy(changes.editableAtls.currentValue.atls);
            }
            if (this.allAtls) {
                this.prepAtls();
            }
        }

        canEdit (atl) {
            return this.editableAtls && this.editableAtls.reduce((acc, cur) => acc || cur.id === atl.id, false);
        }

        loadAtls () {
            let that = this;
            this.networkService.getAtls(true).then(response => that.editableAtls = angular.copy(response.atls));
        }

        loadUsers () {
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ATL'])) {
                this.networkService.getUsersAtAtl(this.activeAtl.id).then(results => this.users = results.users);
            }
        }

        prepAtls () {
            this.allAtls = this.allAtls.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        }

        takeAction (action, data) {
            let that = this;
            if (!this.atl) {
                switch (action) {
                case 'view':
                    this.activeAtl = data;
                    this.isActive = true;
                    this.loadUsers();
                    this.$anchorScroll();
                    break;
                case 'edit':
                    this.activeAtl = data;
                    this.isEditing = true;
                    this.loadUsers();
                    this.$anchorScroll();
                    break;
                case 'save':
                    this.networkService.modifyATL(data).then(() => that.networkService.getAtls(false).then(response => {
                        that.allAtls = response.atls;
                        that.prepAtls();
                    }));
                    this.isEditing = false;
                    if (!this.isActive) {
                        this.activeAtl = undefined;
                    }
                    break;
                case 'cancel':
                    if (this.isActive && this.isEditing) {
                        this.isEditing = false;
                    } else if (this.isActive) {
                        this.isActive = false;
                        this.activeAtl = undefined;
                    } else if (this.isEditing) {
                        this.isEditing = false;
                        this.activeAtl = undefined;
                    }
                    this.isCreating = false;
                    break;
                case 'create':
                    this.networkService.createATL(data).then(() => {
                        let promises = [
                            that.networkService.getAtls(false).then(response => {
                                that.allAtls = response.atls;
                                that.prepAtls();
                            }),
                            that.networkService.getAtls(true).then(response => that.editableAtls = response.atls),
                        ];
                        that.$q.all(promises);
                    });
                    this.isCreating = false;
                    break;
                    //no default
                }
            } else if (action === 'save') {
                this.networkService.modifyATL(data).then(() => that.networkService.getAtls(false).then(response => {
                    that.allAtls = response.atls;
                    that.prepAtls();
                }));
            }
        }

        takeUserAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromAtl(data, this.activeAtl.id)
                    .then(() => that.loadUsers());
                break;
            case 'invite':
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.activeAtl.id,
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
    .component('chplOncAtls', OncAtlsComponent);
