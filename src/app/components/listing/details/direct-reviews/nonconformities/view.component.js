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
                    .map(dr => dr)
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
    .component('chplDirectReviewsNonconformities', DirectReviewsNonconformitiesComponent);
