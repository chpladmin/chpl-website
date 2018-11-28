let getFileUploader = (ctrl) => {
    let uploader = new ctrl.FileUploader({
        url: ctrl.API + '/files/api_documentation',
        removeAfterUpload: true,
        headers: {
            Authorization: 'Bearer ' + ctrl.authService.getToken(),
            'API-Key': ctrl.authService.getApiKey(),
        },
    });
    uploader.onSuccessItem = (fileItem) => {
        ctrl.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully.';
        ctrl.uploadErrors = [];
        ctrl.uploadSuccess = true;
    };
    uploader.onErrorItem = (fileItem, response) => {
        ctrl.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
        ctrl.uploadErrors = response.errorMessages;
        ctrl.uploadSuccess = false;
    };
    return uploader;
}

export const ApiDocumentationManagementComponent = {
    templateUrl: 'chpl.admin/components/apiDocumentation/apiDocumentation.html',
    bindings: {},
    controller: class ApiSurveController {
        constructor ($location, $log, $route, API, FileUploader, authService) {
            'ngInject'
            this.$location = $location;
            this.$log = $log;
            this.$route = $route;
            this.API = API;
            this.FileUploader = FileUploader;
            this.authService = authService;
            this.accurateAsOfDateObject = new Date();
            this.uploader = getFileUploader(this);
        }

        setAccurateDate (item) {
            if (this.accurateAsOfDateObject && typeof this.accurateAsOfDateObject === 'object') {
                item.url += '?file_upload_date=' + this.accurateAsOfDateObject.getTime();
                item.upload();
            } else if (this.accurateAsOfDateObject && typeof this.accurateAsOfDateObject === 'string') {
                item.url += '?file_upload_date=' + new Date(this.accurateAsOfDateObject).getTime();
                item.upload();
            }
        }
    },
}
angular
    .module('chpl.admin')
    .component('aiApiDocumentationManagement', ApiDocumentationManagementComponent);
