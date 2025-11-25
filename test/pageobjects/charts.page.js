import Page from './page.es6';

class ChartsPage extends Page {
  constructor() {
    super();
    this.name = 'Charts';
    this.elements = {
      title: 'h1',
      criteriaAttributes: '#report-CriteriaAttributes',
      criteriaMigrationReport: '#report-CriteriaMigration-a9tob11',
      developerStatistics: '#report-DeveloperStatistics',
      listingAttributes: '#report-ListingAttributes',
      listingStatistics: '#report-ListingStatistics',
      nonConformityCounts: '#report-Non-conformityCounts',
      productStatistics: '#report-ProductStatistics',
      svapUsageByCriteria: '#report-SVAPUsageByCriteria',
      svapUsageBySvap: '#report-SVAPUsageBySVAP',
      serviceBaseUrlReport: '#report-ServiceBaseUrlListReport',
      uniqueProducts: '#report-UniqueProducts',
    };
  }

  async open() {
    await super.open('charts');
  }

  get title() {
    return $(this.elements.title);
  }

  get criteriaAttributesButton() {
    return $(this.elements.criteriaAttributes);
  }

  get criteriaMigrationReportButton() {
    return $(this.elements.criteriaMigrationReport);
  }

  get developerStatisticsButton() {
    return $(this.elements.developerStatistics);
  }

  get listingAttributesButton() {
    return $(this.elements.listingAttributes);
  }

  get listingStatisticsButton() {
    return $(this.elements.listingStatistics);
  }

  get nonConformityCountsButton() {
    return $(this.elements.nonConformityCounts);
  }

  get productStatisticsButton() {
    return $(this.elements.productStatistics);
  }

  get svapUsageByCriteriaButton() {
    return $(this.elements.svapUsageByCriteria);
  }

  get svapUsageBySvapButton() {
    return $(this.elements.svapUsageBySvap);
  }

  get serviceBaseUrlReportButton() {
    return $(this.elements.serviceBaseUrlReport);
  }

  get uniqueProductsButton() {
    return $(this.elements.uniqueProducts);
  }
}

export default ChartsPage;
