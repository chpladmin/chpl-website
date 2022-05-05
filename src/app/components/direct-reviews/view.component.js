export const DirectReviewsComponent = {
  templateUrl: 'chpl.components/direct-reviews/view.html',
  bindings: {
    directReviews: '<',
  },
  controller: class DirectReviewsController {
    constructor ($log, DateUtil) {
      'ngInject';
      this.$log = $log;
      this.DateUtil = DateUtil;
    }

    $onChanges (changes) {
      if (changes.directReviews && changes.directReviews.currentValue) {
        this.directReviews = changes.directReviews.currentValue
          .map(dr => {
            let open = dr.nonConformities
                .filter(nc => nc.nonConformityStatus === 'Open');
            let total = dr.nonConformities.length;
            if (open.length > 0) {
              dr.ncSummary = open.length + ' open / ' + total;
            } else if (total > 0) {
              dr.ncSummary = total + ' closed';
            } else {
              dr.ncSummary = 'no';
            }
            dr.ncSummary += ' non-conformit' + (total !== 1 ? 'ies' : 'y') + ' found';
            const startDate = dr.nonConformities
                  .filter((nc) => nc.capApprovalDate)
                  .sort((a, b) => a.capApprovalDate - b.capApprovalDate)
            [0]?.capApprovalDate;
            const endDates = dr.nonConformities
                  .filter((nc) => nc.capApprovalDate)
                  .filter((nc) => nc.capEndDate)
                  .sort((a, b) => b.capEndDate - a.capEndDate);
            const endDate = open.length === 0 && endDates[0]?.capEndDate;
            console.log(dr.startDate, startDate, dr.endDate, endDate);
            return {
              ...dr,
              startDate,
              endDate,
            };
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
};

angular
  .module('chpl.components')
  .component('chplDirectReviews', DirectReviewsComponent);
