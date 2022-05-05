const DirectReviewsComponent = {
  templateUrl: 'chpl.components/direct-reviews/view.html',
  bindings: {
    directReviews: '<',
  },
  controller: class DirectReviewsController {
    constructor($log, DateUtil) {
      'ngInject';

      this.$log = $log;
      this.DateUtil = DateUtil;
    }

    $onChanges(changes) {
      if (changes.directReviews && changes.directReviews.currentValue) {
        this.directReviews = changes.directReviews.currentValue
          .map((dr) => {
            const open = dr.nonConformities
              .filter((nc) => nc.nonConformityStatus === 'Open')
              .length;
            const total = dr.nonConformities.length;
            let { ncSummary } = dr;
            if (open > 0) {
              ncSummary = `${open} open / ${total}`;
            } else if (total > 0) {
              ncSummary = `${total} closed`;
            } else {
              ncSummary = 'no';
            }
            ncSummary += ` non-conformit${total !== 1 ? 'ies' : 'y'} found`;
            const startDate = dr.nonConformities
              .filter((nc) => nc.capApprovalDate)
              .sort((a, b) => a.capApprovalDate - b.capApprovalDate)[0]?.capApprovalDate;
            const endDates = dr.nonConformities
              .filter((nc) => nc.capApprovalDate)
              .filter((nc) => nc.capEndDate)
              .sort((a, b) => b.capEndDate - a.capEndDate);
            const endDate = open === 0 && endDates[0]?.capEndDate;
            return {
              ...dr,
              startDate,
              endDate,
              ncSummary,
              nonConformities: dr.nonConformities
                .map((nc) => ({
                  ...nc,
                  friendlyCapApprovalDate: this.DateUtil.getDisplayDateFormat(nc.capApprovalDate, 'Has not been determined'),
                  friendlyCapMustCompleteDate: this.DateUtil.getDisplayDateFormat(nc.capMustCompleteDate, 'Has not been determined'),
                  friendlyCapEndDate: this.DateUtil.getDisplayDateFormat(nc.capEndDate, 'Has not been completed'),
                }))
                .sort((a, b) => {
                  if (a.capApprovalDate && b.capApprovalDate) {
                    if (a.capApprovalDate < b.capApprovalDate) { return 1; }
                    if (a.capApprovalDate > b.capApprovalDate) { return -1; }
                  }
                  if (a.capEndDate && b.capEndDate) {
                    if (a.capEndDate < b.capEndDate) { return 1; }
                    if (a.capEndDate > b.capEndDate) { return -1; }
                  }
                  if (a.capEndDate) { return -1; }
                  if (b.capEndDate) { return 1; }
                  return 0;
                }),

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

export default DirectReviewsComponent;
