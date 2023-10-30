export const SurveillanceReportQuarterComponent = {
  templateUrl: 'chpl.surveillance/reporting/quarter.html',
  bindings: {
    report: '<',
    relevantListing: '<',
    relevantListings: '<',
    surveillanceOutcomes: '<',
    surveillanceProcessTypes: '<',
    onCancel: '&',
    onSave: '&',
    takeAction: '&',
  },
  controller: class SurveillanceReportQuarterComponent {
    constructor ($log, authService, networkService, toaster) {
      'ngInject';
      this.$log = $log;
      this.backup = {};
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
      this.disallowedFilters = ['certificationBodies', 'receivedDate', 'closedDate'];
    }

    $onInit () {
      this.displayEdit = this.hasAnyRole((['CHPL-ADMIN', 'ROLE_ACB']));
    }

    $onChanges (changes) {
      if (changes.report) {
        this.report = angular.copy(changes.report.currentValue);
        this.backup.report = angular.copy(this.report);
        const fmt = 'yyyy-MM-dd';
        this.bonusQuery = [
          `certificationBodies=${this.report.acb.name}`,
          `openDuringDateRange=${this.report.startDay},${this.report.endDay}`,
        ].sort((a, b) => a < b ? -1 : 1).join('&');
      }
      if (changes.relevantListings) {
        this.relevantListings = angular.copy(changes.relevantListings.currentValue);
      }
      if (this.relevantListings) {
        this.parseRelevantListings(this.relevantListings);
      }
      if (changes.surveillanceOutcomes) {
        this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
      }
      if (changes.surveillanceProcessTypes) {
        this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
      }
    }

    save () {
      this.onSave({report: this.report});
    }

    can (action) {
      return action === 'delete' && this.hasAnyRole(['CHPL-ADMIN', 'ROLE_ACB']);
    }

    cancel () {
      this.report = angular.copy(this.backup.report);
      this.onCancel();
    }

    delete () {
      this.takeAction({report: this.report, action: 'delete'});
    }

    takeActionBarAction (action) {
      switch (action) {
      case 'cancel':
        this.cancel();
        break;
      case 'delete':
        this.delete();
        break;
      case 'save':
        this.save();
        break;
      //no default
      }
    }

    generateReport () {
      let that = this;
      this.networkService.generateQuarterlySurveillanceReport(this.report.id)
        .then(response => {
          let name = response.job.jobDataMap.user.friendlyName || response.job.jobDataMap.user.fullName;
          let email = response.job.jobDataMap.user.email;
          that.toaster.pop({
            type: 'success',
            title: 'Report is being generated',
            body: `Quarterly Surveillance report is being generated, and will be emailed to ${name} at ${email} when ready.`,
          });
        }, error => {
          let message = error.data.error;
          that.toaster.pop({
            type: 'error',
            title: 'Report could not be generated',
            body: message,
          });
        });
    }

    saveRelevantListing (listing) {
      let that = this;
      this.networkService.updateRelevantListing(this.report.id, listing).then(() => {
        that.networkService.getRelevantListings(that.report.id).then(results => {
          that.relevantListings = results;
          that.parseRelevantListings(that.relevantListings);
        });
      }, () => {
        that.networkService.getRelevantListings(that.report.id).then(results => {
          that.relevantListings = results;
          that.parseRelevantListings(that.relevantListings);
        });
      });
    }

    isRelevantSurveillance (surveillance) {
      let reportStart = this.report.startDay;
      let reportEnd = this.report.endDay;
      let surveillanceStart = surveillance.startDay;
      let surveillanceEnd = surveillance.endDay ? surveillance.endDay : false;
      return surveillanceStart <= reportEnd &&
                (!surveillanceEnd || surveillanceEnd >= reportStart);
    }

    parseRelevantListings (listings) {
      this.excludedListings = angular.copy(listings);
      this.relevantListings = listings.map(l => {
        l.surveillances = l.surveillances.filter(s => this.isRelevantSurveillance(s));
        return l;
      }).filter(l => l.surveillances && l.surveillances.length > 0);
      if (this.relevantListing) {
        this.areListingsShown = true;
        this.relevantListing = this.relevantListings.find(l => l.id === this.relevantListing);
      }
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplSurveillanceReportQuarter', SurveillanceReportQuarterComponent);
