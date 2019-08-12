export const UploadMeaningfulUseComponent = {
    templateUrl: 'chpl.components/upload/meaningful-use.html',
    bindings: {},
    controller: class UploadMeaningfulUseController {
        constructor ($log, $state, API, Upload, authService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.Upload = Upload;
            this.muuAccurateAsOfDateObject = new Date();
            this.item = {
                url: API + '/meaningful_use/upload',
                headers: {
                    Authorization: 'Bearer ' + authService.getToken(),
                    'API-Key': authService.getApiKey(),
                },
            };
        }

        upload () {
            let item = angular.copy(this.item);
            if (this.muuAccurateAsOfDateObject && this.file) {
                item.data = {
                    file: this.file,
                };
                if (typeof this.muuAccurateAsOfDateObject === 'object') {
                    item.url += '?accurate_as_of=' + this.muuAccurateAsOfDateObject.getTime();
                } else if (typeof this.muuAccurateAsOfDateObject === 'string') {
                    item.url += '?accurate_as_of=' + new Date(this.muuAccurateAsOfDateObject).getTime();
                }
                let that = this;
                this.Upload.upload(item).then(() => {
                    that.$state.go('administration.jobs.background');
                }, response => {
                    that.uploadMessage = 'File "' + response.config.data.file.name + '" was not uploaded successfully.';
                    if (response.data.error) {
                        that.uploadErrors = [response.data.error];
                    } else {
                        that.uploadErrors = [];
                    }
                    that.uploadErrors = that.uploadErrors.concat(response.data.errorMessages);
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
    .component('chplUploadMeaningfulUse', UploadMeaningfulUseComponent);
