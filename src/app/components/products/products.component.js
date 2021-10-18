import compliance from '../smart-table/filters/compliance';

const getListingCounts = (product) => {
  const counts = product.versions
    .filter((v) => v.version !== 'All')
    .reduce((acc, v) => {
      acc.active += v.listings
        .filter((l) => l.displayed)
        .filter((l) => l.certificationStatus === 'Active')
        .length;
      acc.total += v.listings
        .filter((l) => l.displayed)
        .length;
      return acc;
    }, { active: 0, total: 0 });
  let ret = '';
  if (counts.active > 0) {
    ret += `${counts.active} active / `;
  }
  ret += `${counts.total} listing`;
  if (counts.total !== 1) {
    ret += 's';
  }
  return ret;
};

const ProductsComponent = {
  templateUrl: 'chpl.components/products/products.html',
  bindings: {
    onCancel: '&?',
    onEdit: '&?',
    products: '<',
    productId: '@',
    versionId: '@',
    searchOptions: '<',
  },
  controller: class ProductsComponent {
    constructor($log, $q, $state, $uibModal, DateUtil, authService, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.$q = $q;
      this.$state = $state;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.filter = {
        items: [],
        surveillance: {
          compliance: undefined,
          matchAll: undefined,
          NC: {
            never: undefined,
            closed: undefined,
            open: undefined,
          },
        },
      };
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.statusFont = utilService.statusFont;
      this.defaultRefine = {
        Active: true,
        Retired: false,
        'Suspended by ONC-ACB': true,
        'Withdrawn by Developer': true,
        'Withdrawn by Developer Under Surveillance/Review': true,
        'Withdrawn by ONC-ACB': true,
        'Suspended by ONC': true,
        'Terminated by ONC': true,
      };
    }

    $onChanges(changes) {
      if (changes.products) {
        this.products = changes.products.currentValue
          .map((p) => {
            const all = {
              version: 'All',
              listings: [],
            };
            p.versions
              .forEach((v) => {
                v.listings = v.listings.map((l) => {
                  l.compliance = JSON.stringify({
                    complianceCount: l.surveillanceCount,
                    openNonConformityCount: l.openSurveillanceNonConformityCount,
                    closedNonConformityCount: l.closedSurveillanceNonConformityCount,
                  });
                  return l;
                });
                all.listings = all.listings.concat(v.listings);
              });
            p.versions.unshift(all);
            p.activeVersion = p.versions[0];
            return p;
          })
          .sort((a, b) => {
            if (a.hasActiveListings !== b.hasActiveListings) {
              return a.hasActiveListings ? -1 : 1;
            }
            return a.name < b.name ? -1 : 1;
          });
      }
      if (changes.searchOptions && changes.searchOptions.currentValue && changes.searchOptions.currentValue.certificationStatuses) {
        this.statusItems = changes.searchOptions.currentValue.certificationStatuses
          .map((cs) => {
            const status = {
              value: cs.name,
              selected: this.defaultRefine[cs.name],
            };
            return status;
          })
          .sort((a, b) => (a.value < b.value ? -1 : 1));
      }
      if (this.products && this.productId) {
        this.activeProduct = this.products
          .filter((p) => p.productId === parseInt(this.productId, 10))[0];
      }
      if (this.products && this.statusItems) {
        this.backupStatusItems = angular.copy(this.statusItems);
        this.filter.items = this.statusItems;
        this.doFilter();
      }
    }

    cancel() {
      this.activeProduct = undefined;
      this.onCancel();
    }

    clearFilters() {
      this.statusItems = angular.copy(this.backupStatusItems);
      this.filter.items = [...this.statusItems];
      this.filter.surveillance = {
        compliance: undefined,
        matchAll: undefined,
        NC: {
          never: undefined,
          closed: undefined,
          open: undefined,
        },
      };
      this.doFilter();
    }

    doFilter() {
      this.displayedProducts = this.products
        .map((p) => {
          p.openSurveillance = 0;
          p.totalSurveillance = 0;
          p.hasActiveListings = false;
          p.availableVersions = p.versions
            .map((v) => {
              if (v.listings) {
                v.listings.forEach((l) => {
                  l.displayed = this.filter.items.find((i) => i.value === l.certificationStatus).selected
                    && (!this.filter.surveillance.compliance || compliance(l.compliance, this.filter.surveillance));
                  if (v.version !== 'All' && l.displayed) {
                    p.openSurveillance += l.openSurveillanceCount;
                    p.totalSurveillance += l.surveillanceCount;
                    p.hasActiveListings = p.hasActiveListings || l.certificationStatus === 'Active';
                  }
                });
              }
              return v;
            })
            .filter((v) => v.listings.filter((l) => l.displayed).length > 0);
          p.listingCounts = getListingCounts(p);
          return p;
        })
        .filter((p) => p.listingCounts !== '0 listings')
        .sort((a, b) => {
          if (a.hasActiveListings !== b.hasActiveListings) {
            return a.hasActiveListings ? -1 : 1;
          }
          return a.name < b.name ? -1 : 1;
        });
    }

    editProduct(product) {
      this.$state.go('organizations.developers.developer.product.edit', {
        productId: product.productId,
      });
    }

    editVersion(product) {
      this.$state.go('organizations.developers.developer.product.version.edit', {
        productId: product.productId,
        versionId: product.activeVersion.versionId,
      });
    }

    handleEdit(action, data) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'edit':
          this.save(data);
          break;
          // no default
      }
    }

    handleFilter(filter) {
      if (filter.surveillance) {
        this.filter.surveillance = angular.copy(filter.surveillance);
      } else {
        this.filter.items = angular.copy(filter);
      }
      this.doFilter();
    }

    isFiltered() {
      return this.filter.surveillance.compliance
        || this.backupStatusItems.reduce((acc, item) => acc || (this.filter.items.filter((i) => i.value === item.value)[0].selected !== item.selected), false);
    }

    mergeProduct(product) {
      this.$state.go('organizations.developers.developer.product.merge', {
        productId: product.productId,
      });
    }

    mergeVersion(product) {
      this.$state.go('organizations.developers.developer.product.version.merge', {
        productId: product.productId,
        versionId: product.activeVersion.versionId,
      });
    }

    save(data) {
      this.onEdit({ data });
    }

    splitProduct(product) {
      this.$state.go('organizations.developers.developer.product.split', {
        productId: product.productId,
      });
    }

    splitVersion(product) {
      this.$state.go('organizations.developers.developer.product.version.split', {
        productId: product.productId,
        versionId: product.activeVersion.versionId,
      });
    }

    viewCertificationStatusLegend() {
      this.viewCertificationStatusLegendInstance = this.$uibModal.open({
        templateUrl: 'chpl.components/certification-status/certification-status.html',
        controller: 'CertificationStatusController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
    }
  },
};

angular.module('chpl.components')
  .component('chplProducts', ProductsComponent);

export default ProductsComponent;
