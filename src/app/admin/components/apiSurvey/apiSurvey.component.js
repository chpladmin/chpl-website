let getFileUploader = (ctrl) => {
    let uploader = new ctrl.FileUploader({
        url: ctrl.API + '/files/api_documentation',
        removeAfterUpload: true,
        headers: {
            Authorization: 'Bearer ' + ctrl.authService.getToken(),
            'API-Key': ctrl.authService.getApiKey(),
        },
    });
    uploader.onSuccessItem = (fileItem, response, status, headers) => {
        ctrl.$log.info('onSuccessItem', fileItem, response, status, headers);
        if (ctrl.$location.url() !== '/admin/apiSurveyManagement') {
            ctrl.$location.url('/admin/apiSurveyManagement');
        } else {
            ctrl.$route.reload();
        }
    };
    uploader.onCompleteItem = (fileItem, response, status, headers) => {
        ctrl.$log.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = (fileItem, response, status, headers) => {
        ctrl.$log.info('onErrorItem', fileItem, response, status, headers);
        ctrl.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
        ctrl.uploadErrors = response.errorMessages;
        ctrl.uploadSuccess = false;
    };
    uploader.onCancelItem = (fileItem, response, status, headers) => {
        ctrl.$log.info('onCancelItem', fileItem, response, status, headers);
    };
    return uploader;
}

export const ApiSurveyManagementComponent = {
    templateUrl: 'chpl.admin/components/apiSurvey/apiSurvey.html',
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
            item.url += '?file_upload_date=' + this.accurateAsOfDateObject.getTime();
            item.upload();
        }
    },
}
angular
    .module('chpl.admin')
    .component('aiApiSurveyManagement', ApiSurveyManagementComponent);
