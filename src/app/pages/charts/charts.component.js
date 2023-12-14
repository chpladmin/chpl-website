export const ChartsComponent = {
  templateUrl: 'chpl.charts/charts.html',
  bindings: {
  },
  controller: class ChartsComponent {
    constructor ($analytics, $log, networkService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.networkService = networkService;
    }

    $onInit () {
      this.chartState = {
        tab: 'product',
      };
      this.loadCriterionProductCountChart();
      this.loadIncumbentDevelopersCountChart();
      this.loadListingCountCharts();
      this.loadNonconformityCountChart();
      this.loadSedParticipantCountChart();
      this.loadParticipantGenderCountChart();
      this.loadParticipantAgeCountChart();
      this.loadParticipantEducationCountChart();
      this.loadParticipantProfessionalExperienceCountChart();
      this.loadParticipantComputerExperienceCountChart();
      this.loadParticipantProductExperienceCountChart();
    }

    changeTab (target) {
      this.chartState.tab = target;
      let title;
      switch (target) {
      case 'product': title = 'Unique Product'; break;
      case 'developer': title = 'Developer'; break;
      case 'sed': title = 'SED Participants'; break;
      case 'nonconformity': title = 'Non-conformity'; break;
        //no default
      }
      this.$analytics.eventTrack('Switch to ' + title + ' Charts', { category: 'Charts' });
    }

    ////////////////////////////////////////////////////////////////////

    loadCriterionProductCountChart () {
      let that = this;
      this.networkService.getCriterionProductStatistics().then(data => that.criterionProduct = data);
    }

    loadIncumbentDevelopersCountChart () {
      let that = this;
      this.networkService.getIncumbentDevelopersStatistics().then(data => that.incumbentDevelopers = data);
    }

    loadListingCountCharts () {
      let that = this;
      this.networkService.getListingCountStatistics().then(data => that.listingCountData = data);
    }

    loadNonconformityCountChart () {
      let that = this;
      this.networkService.getNonconformityStatisticsCount().then(data => that.nonconformityCriteriaCount = data);
    }

    loadSedParticipantCountChart () {
      let that = this;
      this.networkService.getSedParticipantStatisticsCount().then(data => that.sedParticipantStatisticsCount = data);
    }

    loadParticipantGenderCountChart () {
      let that = this;
      this.networkService.getParticipantGenderStatistics().then(data => that.participantGenderCount = data);
    }

    loadParticipantAgeCountChart () {
      let that = this;
      this.networkService.getParticipantAgeStatistics().then(data => that.participantAgeCount = data);
    }

    loadParticipantEducationCountChart () {
      let that = this;
      this.networkService.getParticipantEducationStatistics().then(data => that.participantEducationCount = data);
    }

    loadParticipantProfessionalExperienceCountChart () {
      let that = this;
      this.networkService.getParticipantProfessionalExperienceStatistics().then(data => that.participantProfessionalExperienceCount = data);
    }

    loadParticipantComputerExperienceCountChart () {
      let that = this;
      this.networkService.getParticipantComputerExperienceStatistics().then(data => that.participantComputerExperienceCount = data);
    }

    loadParticipantProductExperienceCountChart () {
      let that = this;
      this.networkService.getParticipantProductExperienceStatistics().then(data => that.participantProductExperienceCount = data);
    }
  },
};

angular.module('chpl.charts')
  .component('chplCharts', ChartsComponent);
