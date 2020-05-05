export const OrganizationsComponent = {
    templateUrl: 'chpl.organizations/organizations.html',
    bindings: {
    },
    controller: class OrganizationsComponent {
        constructor ($log, featureFlags) {
            'ngInject'
            this.$log = $log;
            this.isOn = featureFlags.isOn;
        }
    },
}

angular.module('chpl.organizations')
    .component('chplOrganizations', OrganizationsComponent);
