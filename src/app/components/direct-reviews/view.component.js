export const DirectReviewsComponent = {
    templateUrl: 'chpl.components/direct-reviews/view.html',
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
                this.directReviews = changes.directReviews.currentValue
                    .map(dr => {
                        let open = dr.nonconformities
                            .filter(nc => nc.nonconformityStatus === 'Open')
                            .length;
                        let total = dr.nonconformities.length;
                        if (open > 0) {
                            dr.ncSummary = open + ' open / ' + total;
                        } else if (total > 0) {
                            dr.ncSummary = total + ' closed';
                        } else {
                            dr.ncSummary = 'no';
                        }
                        dr.ncSummary += ' non-conformit' + (total !== 1 ? 'ies' : 'y') + ' found';
                        return dr;
                    })
                    .sort((a, b) => {
                        if (a.endDate && b.endDate) {
                            return a.endDate < b.endDate ? 1 : -1;
                        }
                        if (!a.endDate && !b.endDate) {
                            return a.startDate < b.startDate ? 1 : -1;
                        }
                        return a.endDate ? 1 : -1;
                    });
            }
        }
    },
}

angular
    .module('chpl.components')
    .component('chplDirectReviews', DirectReviewsComponent);
