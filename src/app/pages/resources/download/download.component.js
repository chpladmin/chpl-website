export const ResourcesDownloadComponent = {
    templateUrl: 'chpl.resources/download/download.html',
    bindings: {
    },
    controller: class ResourcesDownloadController {
        constructor ($log, API, authService, featureFlags) {
            'ngInject'
            this.$log = $log;
            this.API = API;
            this.authService = authService;
            this.isOn = featureFlags.isOn;
        }

        $onInit () {
            this.API_KEY = this.authService.getApiKey();
            this.getToken = this.authService.getToken;

            this.downloadOptions = [
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015', label: '2015 XML', display: '2015 edition products (xml)'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014', label: '2014 XML', display: '2014 edition products (xml)'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2011', label: '2011 XML', display: '2011 edition products (xml)'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015&format=csv', label: '2015 CSV', display: '2015 edition summary (csv)'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014&format=csv', label: '2014 CSV', display: '2014 edition summary (csv)'},
                { value: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=all', label: 'Surveillance', display: 'Surveillance Activity'},
                { value: this.API + '/surveillance/download?api_key=' + this.API_KEY, label: 'Non-Conformities', display: 'Non-Conformities'},
            ]
            this.definitionOptions = [
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015&definition=true', label: '2015 XML', display: '2015 edition products (xml) Definition File'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014&definition=true', label: '2014 XML', display: '2014 edition products (xml) Definition File'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2011&definition=true', label: '2011 XML', display: '2011 edition products (xml) Definition File'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015&format=csv&definition=true', label: '2015 CSV', display: '2015 edition summary (csv) Definition File'},
                { value: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014&format=csv&definition=true', label: '2014 CSV', display: '2014 edition summary (csv) Definition File'},
                { value: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=all&definition=true', label: 'Surveillance', display: 'Surveillance Activity Definition File'},
                { value: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&definition=true', label: 'Non-Conformities', display: 'Non-Conformities Definition File'},
            ]

            if (this.showRestricted()) {
                this.downloadOptions.splice(6, 0, { value: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=basic&authorization=Bearer%20' + this.getToken(), label: 'Surveillance (Basic)', display: 'Surveillance (Basic)'});
                this.definitionOptions.splice(6, 0, { value: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=basic&definition=true&authorization=Bearer%20' + this.getToken(), label: 'Surveillance (Basic)', display: 'Surveillance (Basic) Definition File'});
            }

            this.downloadOption = this.downloadOptions[0];
            this.definitionOption = this.definitionOptions[0];
        }

        changeDownload () {
            for (var i = 0; i < this.downloadOptions.length; i++) {
                if (this.downloadOption === this.downloadOptions[i]) {
                    this.definitionOption = this.definitionOptions[i];
                    break;
                }
            }
        }

        showRestricted () {
            return this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
        }
    },
}

angular
    .module('chpl.resources')
    .component('aiResourcesDownload', ResourcesDownloadComponent);
