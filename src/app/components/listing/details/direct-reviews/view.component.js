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
                this.directReviews = changes.directReviews.currentValue.map(dr => dr);
            }
        }
    },
}

angular
    .module('chpl.components')
    .component('chplDirectReviews', DirectReviewsComponent);
