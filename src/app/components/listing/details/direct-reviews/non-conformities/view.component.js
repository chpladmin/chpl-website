export const DirectReviewsNonConformitiesComponent = {
    templateUrl: 'chpl.components/listing/details/direct-reviews/non-conformities/view.html',
    bindings: {
        nonConformities: '<',
    },
    controller: class DirectReviewsNonConformitiesController {
        constructor ($log, utilService) {
            'ngInject';
            this.$log = $log;
            this.utilService = utilService;
        }

        $onChanges (changes) {
            if (changes.nonConformities && changes.nonConformities.currentValue) {
                this.nonConformities = changes.nonConformities.currentValue
                    .map(nc => {
                        nc.friendlyCapApprovalDate = nc.capApprovalDate ? this.makeFriendlyDate(nc.capApprovalDate) : 'Has not been approved';
                        nc.friendlyCapEndDate = nc.capEndDate ? this.makeFriendlyDate(nc.capEndDate) : 'Has not ended';
                        nc.friendlyCapMustCompleteDate = nc.capMustCompleteDate ? this.makeFriendlyDate(nc.capMustCompleteDate) : 'Has not been approved';
                        nc.friendlyCapStartDate = nc.capStartDate ? this.makeFriendlyDate(nc.capStartDate) : 'Has not started';
                        nc.friendlyDateOfDetermination = nc.dateOfDetermination ? this.makeFriendlyDate(nc.dateOfDetermination) : 'Has not been determined';
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

        makeFriendlyDate (date) {
            return [...date.month.toLowerCase()].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('').substring(0,3) + ' ' + date.dayOfMonth + ', ' + date.year;
        }
    },
}

angular
    .module('chpl.components')
    .component('chplDirectReviewsNonConformities', DirectReviewsNonConformitiesComponent);
