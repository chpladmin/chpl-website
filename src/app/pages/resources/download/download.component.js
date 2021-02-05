export const ResourcesDownloadComponent = {
  templateUrl: 'chpl.resources/download/download.html',
  bindings: {},
  controller: class ResourcesDownloadComponent {
    constructor ($log, API, authService) {
      'ngInject';
      this.$log = $log;
      this.API = API;
      this.authService = authService;
    }

    $onInit () {
      this.API_KEY = this.authService.getApiKey();
      this.getToken = this.authService.getToken;

      this.downloadOptions = [
        { data: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015', definition: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015&definition=true', label: '2015 XML', display: '2015 edition products (xml)'},
        { data: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014', definition: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014&definition=true', label: '2014 XML', display: '2014 edition products (xml)'},
        { data: this.API + '/download?api_key=' + this.API_KEY + '&edition=2011', definition: this.API + '/download?api_key=' + this.API_KEY + '&edition=2011&definition=true', label: '2011 XML', display: '2011 edition products (xml)'},
        { data: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015&format=csv', definition: this.API + '/download?api_key=' + this.API_KEY + '&edition=2015&format=csv&definition=true', label: '2015 CSV', display: '2015 edition summary (csv)'},
        { data: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014&format=csv', definition: this.API + '/download?api_key=' + this.API_KEY + '&edition=2014&format=csv&definition=true', label: '2014 CSV', display: '2014 edition summary (csv)'},
        { data: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=all', definition: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=all&definition=true', label: 'Surveillance', display: 'Surveillance Activity'},
        { data: this.API + '/surveillance/download?api_key=' + this.API_KEY, definition: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&definition=true', label: 'Surveillance Non-Conformities', display: 'Surveillance Non-Conformities'},
        { data: this.API + '/developers/direct-reviews/download?api_key=' + this.API_KEY, definition: this.API + '/developers/direct-reviews/download?api_key=' + this.API_KEY + '&definition=true', label: 'Direct Review Activity', display: 'Direct Review Activity'},
      ];
      if (this.showRestricted()) {
        this.downloadOptions.splice(6, 0, { data: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=basic&authorization=Bearer%20' + this.getToken(), definition: this.API + '/surveillance/download?api_key=' + this.API_KEY + '&type=basic&definition=true&authorization=Bearer%20' + this.getToken(), label: 'Surveillance (Basic)', display: 'Surveillance (Basic)'});
      }

      this.downloadOption = this.downloadOptions[0];
    }

    showRestricted () {
      return this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
    }
  },
};

angular
  .module('chpl.resources')
  .component('chplResourcesDownload', ResourcesDownloadComponent);
