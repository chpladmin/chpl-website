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
                    .map(nc => {
                        nc.friendlyCapApprovalDate = nc.capApprovalDate ? this.DateUtil.getDisplayDateFormat(nc.capApprovalDate) : 'Has not been approved';
                        nc.friendlyCapEndDate = nc.capEndDate ? this.DateUtil.getDisplayDateFormat(nc.capEndDate) : 'Has not ended';
                        nc.friendlyCapMustCompleteDate = nc.capMustCompleteDate ? this.DateUtil.getDisplayDateFormat(nc.capMustCompleteDate) : 'Has not been approved';
                        nc.friendlyCapStartDate = nc.capStartDate ? this.DateUtil.getDisplayDateFormat(nc.capStartDate) : 'Has not started';
                        nc.friendlyDateOfDetermination = nc.dateOfDetermination ? this.DateUtil.getDisplayDateFormat(nc.dateOfDetermination) : 'Has not been determined';
                        return nc;
                    })
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
}

angular
    .module('chpl.components')
    .component('chplDirectReviewsNonConformities', DirectReviewsNonConformitiesComponent);
