const DevelopersEditComponent = {
  templateUrl: 'chpl.organizations/developers/developer/edit.html',
  bindings: {
    developer: '<',
  },
  controller: class DevelopersEditComponent {
    constructor($log, $scope, $state, authService, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
      this.backup = {};
      this.activeAcbs = [];
      this.closeConfirmation = this.closeConfirmation.bind(this);
    }

    $onInit() {
      const that = this;
      this.networkService.getAcbs(true).then((response) => {
        that.allowedAcbs = response.acbs;
      });
    }

    $onChanges(changes) {
      if (changes.developer) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.backup.developer = angular.copy(this.developer);
      }
    }

    cancel() {
      this.developer = angular.copy(this.backup.developer);
      this.$state.go('organizations.developers.developer', {
        developerId: this.developer.developerId,
        productId: undefined,
      }, { reload: true });
    }

    closeConfirmation() {
      this.action = undefined;
      this.$state.go('^', undefined, { reload: true });
    }

    save(developer) {
      if (this.hasAnyRole(['ROLE_DEVELOPER'])) {
        this.saveRequest(developer);
      } else {
        const that = this;
        this.developer = developer;
        this.networkService.updateDeveloper(this.developer).then((response) => {
          let body;
          if (!response.status || response.status === 200 || angular.isObject(response.status)) {
            that.developer = response;
            that.backup.developer = angular.copy(response);
            that.$state.go('^', undefined, { reload: true });
          } else if (response.data.errorMessages) {
            body = response.data.errorMessages.join(', ');
          } else if (response.data.error) {
            body = response.data.error;
          } else {
            body = 'An unexpected error has occurred.';
          }
          if (body) {
            that.toaster.pop({
              type: 'error',
              title: 'Error',
              body,
            });
          }
        }, (error) => {
          let body;
          if (error.data.errorMessages) {
            body = error.data.errorMessages.join(', ');
          } else if (error.data.error) {
            body = error.data.error;
          } else {
            body = 'An unexpected error has occurred.';
          }
          that.toaster.pop({
            type: 'error',
            title: 'Error',
            body,
          });
        });
      }
    }

    saveRequest(data) {
      const that = this;
      const request = {
        developer: this.developer,
        details: data,
      };
      this.networkService.submitChangeRequest(request)
        .then(that.handleResponse.bind(that), that.handleError.bind(that));
    }

    handleResponse() {
      let confirmationText = 'The submission has been completed successfully. It will be reviewed by an ONC-ACB or ONC. Once the submission has been approved, it will be displayed on the CHPL.';
      if (this.isWithdrawing) {
        confirmationText = 'Your change request has been successfully withdrawn.';
      }
      this.networkService.getChangeRequests().then((response) => { this.changeRequests = response; });
      this.action = 'confirmation';
      this.confirmationText = confirmationText;
      this.isWithdrawing = false;
    }

    handleError(error) {
      let messages;
      let type = 'error';
      let title = 'Error in submission';
      if (error && error.data && error.data.error
                && error.data.error === 'No data was changed.') {
        messages = ['Cannot "Submit" a change request when no changes have been made.'];
        type = 'info';
        title = 'Please check your input';
      } else {
        messages = error.data.errorMessages ? error.data.errorMessages : [];
      }
      const body = messages.length > 0 ? `Message${messages.length > 1 ? 's' : ''}:<ul>${messages.map((e) => `<li>${e}</li>`).join('')}</ul>`
        : 'An unexpected error occurred. Please try again or contact ONC for support';
      this.toaster.pop({
        type,
        title,
        body,
        bodyOutputType: 'trustedHtml',
      });
    }
  },
};

angular.module('chpl.organizations')
  .component('chplDevelopersEdit', DevelopersEditComponent);

export default DevelopersEditComponent;
