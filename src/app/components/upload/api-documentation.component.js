export const UploadApiDocumentationComponent = {
    templateUrl: 'chpl.components/upload/api-documentation.html',
    bindings: {},
    controller: class UploadApiDocumentationComponent {
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
                    that.file = undefined;
                }, error => {
                    if (error.data.fileName) {
                        that.uploadMessage = 'File "' + error.data.fileName + '" was not uploaded successfully.';
                    } else if (error.config.data.file.name) {
                        that.uploadMessage = 'File "' + error.config.data.file.name + '" was not uploaded successfully.';
                    } else {
                        that.uploadMessage = 'File was not uploaded successfully.';
                    }
                    that.uploadErrors = error.data.errorMessages;
                    that.uploadSuccess = false;
                    that.file = undefined;
                }, event => {
                    that.progressPercentage = parseInt(100.0 * event.loaded / event.total, 10);
                    that.$log.info('progress: ' + that.progressPercentage + '% ' + event.config.data.file.name);
                });
            }
        }
    },
}
angular
    .module('chpl.components')
    .component('chplUploadApiDocumentation', UploadApiDocumentationComponent);
