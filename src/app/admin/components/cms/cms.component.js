export const CmsManagementComponent = {
    templateUrl: 'chpl.admin/components/cms/cms.html',
    bindings: {},
    controller: class CmsManagementController {
        constructor ($location, $log, API, FileUploader, authService, networkService) {
            'ngInject'
            this.$location = $location;
            this.$log = $log;
            this.API = API;
            this.FileUploader = FileUploader;
            this.authService = authService;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onInit () {
            this.muuAccurateAsOfDateObject = new Date();

            let ctrl = this;
            this.uploader = new this.FileUploader({
                url: this.API + '/meaningful_use/upload',
                removeAfterUpload: true,
                headers: {
                    Authorization: 'Bearer ' + this.authService.getToken(),
                    'this.API-Key': this.authService.getApiKey(),
                },
                filters: [{
                    name: 'csvFilter',
                    fn: (item) => {
                        const extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                        return '|csv|'.indexOf(extension) !== -1;
                    },
                }],
                onSuccessItem: () => {
                    ctrl.$location.url('/admin/jobsManagement');
                },
                onErrorItem: (fileItem, response) => {
                    ctrl.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                    ctrl.uploadErrors = response.errorMessages;
                    ctrl.uploadSuccess = false;
                },
            });
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

        setAccurateDate (item) {
            this.uploader.url += '?accurate_as_of=' + this.muuAccurateAsOfDateObject.getTime();
            item.url += '?accurate_as_of=' + this.muuAccurateAsOfDateObject.getTime();
            item.upload();
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiCmsManagement', CmsManagementComponent);
