export const ApiDocumentationManagementComponent = {
    templateUrl: 'chpl.admin/components/apiDocumentation/apiDocumentation.html',
    bindings: {},
    controller: class ApiDocumentationManagementComponent {
        constructor ($location, $log, API, Upload, authService) {
            'ngInject'
            this.$location = $location;
            this.$log = $log;
            this.Upload = Upload;
            this.accurateAsOfDateObject = new Date();
            this.item = {
                url: API + '/files/api_documentation',
                headers: {
                    Authorization: 'Bearer ' + authService.getToken(),
                    'API-Key': authService.getApiKey(),
                },
            };
        }

        upload () {
            if (this.accurateAsOfDateObject && this.file) {
                this.item.data = {
                    file: this.file,
                };
                if (typeof this.accurateAsOfDateObject === 'object') {
                    this.item.url += '?file_update_date=' + this.accurateAsOfDateObject.getTime();
                } else if (typeof this.accurateAsOfDateObject === 'string') {
                    this.item.url += '?file_update_date=' + new Date(this.accurateAsOfDateObject).getTime();
                }
                let that = this;
                this.Upload.upload(this.item).then(response => {
                    that.uploadMessage = 'File "' + response.data.fileName + '" was uploaded successfully.';
                    that.uploadErrors = [];
                    that.uploadSuccess = true;
                }, response => {
                    that.uploadMessage = 'File "' + response.data.fileName + '" was not uploaded successfully.';
                    that.uploadErrors = response.errorMessages;
                    that.uploadSuccess = false;
                }, event => {
                    that.progressPercentage = parseInt(100.0 * event.loaded / event.total, 10);
                    that.$log.info('progress: ' + that.progressPercentage + '% ' + event.config.data.file.name);
                });
            }
        }
    },
}
angular
    .module('chpl.admin')
    .component('aiApiDocumentationManagement', ApiDocumentationManagementComponent);
