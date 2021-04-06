(function () {
  'use strict';
  angular.module('chpl.components')
    .controller('NonconformityFilterController', NonconformityFilterController)
    .directive('aiNonconformityFilter', aiNonconformityFilter);

  function aiNonconformityFilter () {
    return {
      bindToController: {
        hasChanges: '=?',
        nameSpace: '@?',
      },
      controller: 'NonconformityFilterController',
      controllerAs: 'vm',
      link: aiNonconformityFilterLink,
      restrict: 'E',
      require: ['^stTable', 'aiNonconformityFilter'],
      scope: {
        registerClearFilter: '&',
        registerRestoreState: '&?',
      },
      templateUrl: 'chpl.components/smart-table/aiNonconformityFilter.html',
    };
  }

  function aiNonconformityFilterLink (scope, element, attr, ctrls) {

    activate();

    ////////////////////////////////////////////////////////

    function activate () {
      var table = ctrls[0];
      var ctrl = ctrls[1];
      var clearFilter = scope.registerClearFilter({
        clearFilter: function () {
          ctrl.clearFilter();
        },
      });
      scope.$on('$destroy', clearFilter);
      if (scope.registerRestoreState) {
        var restoreState = scope.registerRestoreState({
          restoreState: function (state) {
            ctrl.restoreState(state);
          },
        });
        scope.$on('$destroy', restoreState);
      }
      ctrl.tableCtrl = table;
      ctrl.activate();
    }
  }

  /** @ngInclude */
  function NonconformityFilterController ($analytics, $localStorage) {
    var vm = this;

    vm.activate = activate;
    vm.clearFilter = clearFilter;
    vm.filterChanged = filterChanged;
    vm.restoreState = restoreState;
    vm.storeState = storeState;

    ////////////////////////////////////////////////////////////////////

    function activate () {
      reset();
    }

    function clearFilter () {
      reset();
      vm.filterChanged();
    }

    function filterChanged (type) {
      let event, label;
      switch (type) {
      case 'open':
        event = (vm.query.nonconformities.open ? 'Show' : 'Hide') + ' Listings with Non-conformities';
        label = 'Open';
        break;
      case 'closed':
        event = (vm.query.nonconformities.closed ? 'Show' : 'Hide') + ' Listings with Non-conformities';
        label = 'Closed';
        break;
      case 'toggle':
        event = 'Show all Listings Matching ' + (vm.query.nonconformities.matchAll ? 'All' : 'Any') + ' Non-conformity status';
        break;
        //no default
      }
      if (event) {
        if (label) {
          $analytics.eventTrack(event, { category: 'Products: Corrective Action Status', label: label });
        } else {
          $analytics.eventTrack(event, { category: 'Products: Corrective Action Status' });
        }
      }
      vm.hasChanges = (vm.query.nonconformities.open || vm.query.nonconformities.closed || vm.query.nonconformities.matchAll);
      if (vm.hasChanges) {
        vm.tableCtrl.search(vm.query, 'nonconformities');
      } else {
        vm.tableCtrl.search({}, 'nonconformities');
      }
      if (vm.nameSpace) {
        vm.storeState();
      }
    }

    function restoreState (state) {
      vm.query = state.search.predicateObject.nonconformities;
      if (vm.query) {
        vm.filterChanged();
      }
    }

    function storeState () {
      $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
    }

    ////////////////////////////////////////////////////////////////////

    function reset () {
      vm.query = {
        nonconformities: {
          open: false,
          closed: false,
          matchAll: false,
        },
      };
    }
  }
})();
