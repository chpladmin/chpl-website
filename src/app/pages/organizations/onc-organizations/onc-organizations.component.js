export const OncOrganizationsComponent = {
    templateUrl: 'chpl.organizations/onc-organizations/onc-organizations.html',
    bindings: {
        allOrgs: '<',
        editableOrgs: '<',
        roles: '<',
        key: '@',
        type: '@',
        functions: '<',
    },
    controller: class OncOrganizationsComponent {
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
            this.columnCount = 2;
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', () => that.loadOrgs());
            this.$scope.$on('$destroy', loggedIn);
            if (this.$state.params.id) {
                this.loadUsers();
            }
        }

        $onChanges (changes) {
            if (changes.allOrgs && changes.allOrgs.currentValue) {
                this.allOrgs = angular.copy(changes.allOrgs.currentValue[this.key]);
            }
            if (changes.editableOrgs && changes.editableOrgs.currentValue) {
                this.editableOrgs = angular.copy(changes.editableOrgs.currentValue[this.key]);
            }
            if (changes.roles && changes.roles.currentValue) {
                this.roles = angular.copy(changes.roles.currentValue);
            }
            if (changes.functions && changes.functions.currentValue) {
                this.functions = angular.copy(changes.functions.currentValue);
            }
            if (this.allOrgs) {
                this.prepOrgs();
            }
        }

        canEdit (org) {
            return this.editableOrgs && this.editableOrgs.reduce((acc, cur) => acc || cur.id.toString() === org, false);
        }

        edit ($event) {
            this.isEditing = true;
            this.generalCollapsed = false;
            this.loadUsers();
            this.$anchorScroll();
            $event.preventDefault();
            $event.stopPropagation();
        }

        toggleGeneral () {
            if (!this.isEditing) {
                this.generalCollapsed = !this.generalCollapsed;
            }
        }

        loadOrgs () {
            let that = this;
            this.networkService[this.functions.get](true).then(response => that.editableOrgs = angular.copy(response[that.key]));
        }

        loadUsers (id) {
            if (!id) {
                id = this.$state.params.id;
            }
            let allowedRoles = ['ROLE_ADMIN', 'ROLE_ONC'];
            allowedRoles.push(this.roles[0]);
            if (this.hasAnyRole(allowedRoles)) {
                this.networkService[this.functions.getUsers](id).then(results => this.users = results.users);
            }
        }

        prepOrgs () {
            this.allOrgs = this.allOrgs.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        }

        showOrg (org) {
            if (this.$state.includes('**.organization')) {
                this.$state.go('^.organization', {
                    id: org.id,
                    name: org.name,
                });
            } else {
                this.$state.go('.organization', {
                    id: org.id,
                    name: org.name,
                });
            }
            this.loadUsers(org.id);
            this.$anchorScroll();
        }

        create () {
            this.isCreating = true;
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'save':
                this.networkService[this.functions.modify](data).then(() => that.networkService[that.functions.get](false).then(response => {
                    that.allOrgs = response[that.key];
                    that.prepOrgs();
                    that.$state.reload();
                }));
                this.isEditing = false;
                this.$anchorScroll();
                break;
            case 'cancel':
                this.isEditing = false;
                this.isCreating = false;
                this.$anchorScroll();
                break;
            case 'create':
                this.networkService[this.functions.create](data).then(newOrg => {
                    let promises = [
                        that.networkService[that.functions.get](false).then(allOrgs => {
                            that.allOrgs = allOrgs[that.key];
                            that.prepOrgs();
                        }),
                        that.networkService[that.functions.get](true).then(editableOrgs => that.editableOrgs = editableOrgs[that.key]),
                    ];
                    that.$q.all(promises);
                    that.showOrg(newOrg);
                });
                this.isCreating = false;
                break;
                //no default
            }
        }

        takeUserAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService[this.functions.removeUser](data, this.$state.params.id)
                    .then(() => that.loadUsers());
                break;
            case 'invite':
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.$state.params.id,
                }).then(() => that.toaster.pop({
                    type: 'success',
                    title: 'Email sent',
                    body: 'Email sent successfully to ' + data.email,
                }));
                break;
            case 'refresh':
                that.loadUsers();
                break;
            case 'impersonate':
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplOncOrganizations', OncOrganizationsComponent);
