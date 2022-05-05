export const DirectReviewsNonConformitiesComponent = {
  templateUrl: 'chpl.components/direct-reviews/non-conformities/view.html',
  bindings: {
    nonConformities: '<',
  },
  controller: class DirectReviewsNonConformitiesController {
    constructor ($log, DateUtil) {
      'ngInject';
      this.$log = $log;
      this.DateUtil = DateUtil;
    }

    $onChanges (changes) {
      if (changes.nonConformities && changes.nonConformities.currentValue) {
        this.nonConformities = changes.nonConformities.currentValue
          .map((nc) => ({
            ...nc,
            friendlyCapApprovalDate: this.DateUtil.getDisplayDateFormat(nc.capApprovalDate, 'Has not been determined'),
            friendlyCapMustCompleteDate: this.DateUtil.getDisplayDateFormat(nc.capMustCompleteDate, 'Has not been determined'),
            friendlyCapEndDate: this.DateUtil.getDisplayDateFormat(nc.capEndDate, 'Has not been completed'),
          }))
          .sort((a, b) => {
            if (a.nonConformityStatus && b.nonConformityStatus) {
              return a.nonConformityStatus < b.nonConformityStatus ? 1 : a.nonConformityStatus > b.nonConformityStatus ? -1 : 0;
            }
            if (!a.nonConformityStatus && !b.nonConformityStatus) {
              return 0;
            }
            return a.nonConformityStatus ? -1 : 1;
          });
      }
    }
  },
};

angular
  .module('chpl.components')
  .component('chplDirectReviewsNonConformities', DirectReviewsNonConformitiesComponent);
