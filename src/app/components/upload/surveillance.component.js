export const UploadSurveillanceComponent = {
    templateUrl: 'chpl.components/upload/surveillance.html',
    bindings: {
        onChange: '&',
    },
    controller: class UploadSurveillanceComponent {
        constructor ($filter, $log, API, Upload, authService, networkService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.Upload = Upload;
            this.networkService = networkService;
            this.item = {
                url: API + '/surveillance/upload',
                headers: {
                    Authorization: 'Bearer ' + authService.getToken(),
                    'API-Key': authService.getApiKey(),
                },
            };
        }

        upload () {
            let item = angular.copy(this.item);
            this.showConfirmLink = false;
            if (this.file) {
                item.data = {
                    file: this.file,
                };
                let that = this;
                this.Upload.upload(item).then(response => {
                    if (response.data.pendingSurveillance) {
                        that.uploadMessage = 'File "' + response.config.data.file.name + '" was uploaded successfully. ' + response.data.pendingSurveillance.length + ' pending surveillance records are ready for confirmation.';
                        that.showConfirmLink = true;
                    } else {
                        that.uploadMessage = 'File "' + response.config.data.file.name + '" was uploaded successfully. The file will be processed and an email will be sent to ' + response.data.user.email + ' when processing is complete.';
                    }
                    that.uploadErrors = [];
                    that.uploadSuccess = true;
                    that.file = undefined;
                    that.onChange();
                }, response => {
                    that.uploadMessage = 'File "' + response.config.data.file.name + '" was not uploaded successfully.';
                    that.uploadErrors = response.data.errorMessages;
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

angular.module('chpl.components')
    .component('chplUploadSurveillance', UploadSurveillanceComponent);
