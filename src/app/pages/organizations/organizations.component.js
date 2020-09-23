export const OrganizationsComponent = {
    templateUrl: 'chpl.organizations/organizations.html',
    bindings: {
    },
    controller: class OrganizationsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }
    },
}

angular.module('chpl.organizations')
    .component('chplOrganizations', OrganizationsComponent);
