export const DirectReviewsComponent = {
    templateUrl: 'chpl.components/listing/details/direct-reviews/view.html',
    bindings: {
        directReviews: '<',
    },
    controller: class DirectReviewsController {
        constructor ($log, utilService) {
            'ngInject';
            this.$log = $log;
            this.utilService = utilService;
        }

        $onChanges (changes) {
            if (changes.directReviews && changes.directReviews.currentValue) {
                this.directReviews = changes.directReviews.currentValue.map(dr => {
                    dr.friendlyStartDate = dr.startDate.dayOfMonth + ' ' + [...dr.startDate.month.toLowerCase()].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('') + ' ' + dr.startDate.year;
                    if (dr.endDate) {
                        dr.friendlyEndDate = dr.endDate.dayOfMonth + ' ' + [...dr.endDate.month.toLowerCase()].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('') + ' ' + dr.endDate.year;
                    } else {
                        dr.friendlyEndDate = 'Has not ended';
                    }
                    return dr;
                });
            }
        }
    },
}

angular
    .module('chpl.components')
    .component('chplDirectReviews', DirectReviewsComponent);
