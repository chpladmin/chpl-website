export const ApiKeysComponent = {
    templateUrl: 'chpl.administration/api-keys/api-keys.html',
    bindings: {
        apiKeys: '<',
    },
    controller: class ApiKeysComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.apiKeys) {
                this.apiKeys = angular.copy(changes.apiKeys.currentValue);
            }
        }

        revoke (key) {
            let that = this;
            if (key.key) {
                this.networkService.revokeApi(key).then(() => that.networkService.getApiUsers().then(response => that.apiKeys = response));
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplApiKeys', ApiKeysComponent);
