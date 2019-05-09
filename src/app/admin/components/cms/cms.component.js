export const CmsManagementComponent = {
    templateUrl: 'chpl.admin/components/cms/cms.html',
    bindings: {},
    controller: class CmsManagementController {
        constructor ($location, $log, API, Upload, authService, networkService) {
            'ngInject'
            this.$location = $location;
            this.$log = $log;
            this.Upload = Upload;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.muuAccurateAsOfDateObject = new Date();
            this.item = {
                url: API + '/meaningful_use/upload',
                headers: {
                    Authorization: 'Bearer ' + authService.getToken(),
                    'API-Key': authService.getApiKey(),
                },
            };
        }

        $onInit () {
            this.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
            this.csvHeader = ['CMS ID', 'Creation Date'];
            this.csvColumnOrder = ['certificationId', 'created'];
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                this.csvHeader.push('CHPL Product(s)');
                this.csvColumnOrder.push('products');
            }
            this.isReady = false;
            this.isProcessing = false;
        }

        getDownload () {
            this.isProcessing = true;
            this.networkService.getCmsDownload()
                .then(result => {
                    this.cmsArray = result.map(res => {
                        res.created = new Date(res.created).toISOString().substring(0, 10);
                        return res;
                    });
                    this.cmsArray = result
                    this.isProcessing = false;
                    this.isReady = true;
                });
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
                    that.$location.url('/admin/jobsManagement');
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
    .module('chpl.admin')
    .component('aiCmsManagement', CmsManagementComponent);
