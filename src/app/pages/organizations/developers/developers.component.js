export const DevelopersComponent = {
    templateUrl: 'chpl.organizations/developers/developers.html',
    bindings: {
        developers: '<',
    },
    controller: class DevelopersComponent {
        constructor ($log, $state, authService) {
            'ngInject';
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.activeAcbs = [];
        }

        $onChanges (changes) {
            if (changes.developers) {
                let acbs = {};
                this.developers = changes.developers.currentValue.developers.map(d => {
                    d.transMap = {};
                    d.transparencyAttestations.forEach(att => {
                        d.transMap[att.acbName] = att.attestation;
                        acbs[att.acbName] = true;
                    });
                    return d;
                });
                angular.forEach(acbs, (value, key) => this.activeAcbs.push(key));
            }
        }

        loadDeveloper () {
            this.$state.go('organizations.developers.developer', {
                developerId: this.developerToLoad.developerId,
            });
        }
    },
};

angular.module('chpl.organizations')
    .component('chplDevelopers', DevelopersComponent);
