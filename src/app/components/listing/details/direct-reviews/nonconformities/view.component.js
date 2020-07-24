export const DirectReviewsNonconformitiesComponent = {
    templateUrl: 'chpl.components/listing/details/direct-reviews/nonconformities/view.html',
    bindings: {
        nonconformities: '<',
    },
    controller: class DirectReviewsNonconformitiesController {
        constructor ($log, utilService) {
            'ngInject';
            this.$log = $log;
            this.utilService = utilService;
        }

        $onChanges (changes) {
            if (changes.nonconformities && changes.nonconformities.currentValue) {
                this.nonconformities = changes.nonconformities.currentValue
                    .map(nc => {
                        nc.friendlyCapApprovalDate = nc.capApprovalDate ? this.makeFriendlyDate(nc.capApprovalDate) : 'Has not been approved';
                        nc.friendlyCapEndDate = nc.capEndDate ? this.makeFriendlyDate(nc.capEndDate) : 'Has not ended';
                        nc.friendlyCapMustCompleteDate = nc.capMustCompleteDate ? this.makeFriendlyDate(nc.capMustCompleteDate) : 'Has not been approved';
                        nc.friendlyCapStartDate = nc.capStartDate ? this.makeFriendlyDate(nc.capStartDate) : 'Has not started';
                        nc.friendlyDateOfDetermination = nc.dateOfDetermination ? this.makeFriendlyDate(nc.dateOfDetermination) : 'Has not been determined';
                        return nc;
                    })
                    .sort((a, b) => {
                        if (a.nonconformityStatus && b.nonconformityStatus) {
                            return a.nonconformityStatus < b.nonconformityStatus ? 1 : a.nonconformityStatus > b.nonconformityStatus ? -1 : 0;
                        }
                        if (!a.nonconformityStatus && !b.nonconformityStatus) {
                            return 0;
                        }
                        return a.nonconformityStatus ? -1 : 1;
                    });
            }
        }

        makeFriendlyDate (date) {
            return date.dayOfMonth + ' ' + [...date.month.toLowerCase()].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('') + ' ' + date.year;
        }
    },
}

angular
    .module('chpl.components')
    .component('chplDirectReviewsNonconformities', DirectReviewsNonconformitiesComponent);
