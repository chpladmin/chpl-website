(function () {
  angular
    .module('chpl.components')
    .directive('aiSed', aiSed)
    .controller('SedController', SedController);

  /** @ngInject */
  function aiSed() {
    const directive = {
      bindToController: {
        analyticsCategory: '@',
        criteriaCount: '=?',
        editMode: '=?',
        listing: '=',
        onChange: '&',
        refresh: '&?',
        resources: '=?',
        taskCount: '=?',
      },
      controller: 'SedController',
      controllerAs: 'vm',
      link(scope, element, attr, ctrl) {
        if (ctrl.refresh) {
          const handler = ctrl.refresh({
            handler() {
              ctrl._analyzeSed();
            },
          });
          scope.$on('$destroy', handler);
        }
      },
      replace: true,
      restrict: 'E',
      scope: {},
      templateUrl: 'chpl.components/listing/details/sed/sed.html',
    };
    return directive;
  }

  /** @ngInject */
  function SedController($filter, $log, $scope, $timeout, $uibModal, DateUtil, utilService) {
    const vm = this;

    vm.DateUtil = DateUtil;
    vm.addTask = addTask;
    vm.editDetails = editDetails;
    vm.getCsv = getCsv;
    vm.handleDispatch = handleDispatch.bind(this);
    vm.sortCert = utilService.sortCert;
    vm.sortProcesses = sortProcesses;
    vm.sortTasks = sortTasks;
    vm.viewParticipants = viewParticipants;
    vm.viewTask = viewTask;

    /// /////////////////////////////////////////////////////////////////

    this.$onInit = function () {
      vm.isEditing = false;
      _analyzeSed();
    };

    function addTask() {
      vm.modalInstance = $uibModal.open({
        templateUrl: 'chpl.components/listing/details/sed/edit-task.html',
        controller: 'EditSedTaskController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          criteria() { return vm.sedCriteria; },
          participants() { return vm.allParticipants; },
          task() { return {}; },
        },
      });
      vm.modalInstance.result.then((result) => {
        vm.allParticipants = result.participants;
        vm.listing.sed.testTasks.push(result.task);
        vm.taskCount = vm.listing.sed.testTasks.length;
        vm.onChange({ listing: vm.listing });
      });
    }

    function editDetails() {
      _analyzeSed();
      vm.isEditing = true;
    }

    function getCsv() {
      utilService.makeCsv(vm.csvData);
    }

    function handleDispatch({ action, payload }) {
      switch (action) {
        case 'cancel':
          vm.isEditing = false;
          break;
        case 'save':
          vm.listing.sedReportFileLocation = payload.listing.sedReportFileLocation;
          vm.listing.sedIntendedUserDescription = payload.listing.sedIntendedUserDescription;
          vm.listing.sedTestingEndDay = payload.listing.sedTestingEndDay;
          vm.listing.sed.ucdProcesses = payload.ucdProcesses;
          vm.ucdProcesses = payload.ucdProcesses;
          vm.isEditing = false;
          vm.onChange({ listing: vm.listing });
          break;
          // no default
      }
      $scope.$digest();
    }

    function sortProcesses(process) {
      return utilService.sortCertArray(process.criteria.map((item) => item.number));
    }

    function sortTasks(task) {
      return utilService.sortCertArray(task.criteria.map((item) => item.number));
    }

    function viewParticipants(task) {
      task.active = true;
      vm.modalInstance = $uibModal.open({
        templateUrl: 'chpl.components/listing/details/sed/participants-modal.html',
        controller: 'ViewSedParticipantsController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          allParticipants() { return vm.allParticipants; },
          editMode() { return vm.editMode; },
          participants() { return task.testParticipants; },
        },
      });
      vm.modalInstance.result.then((result) => {
        for (let i = 0; i < vm.listing.sed.testTasks.length; i++) {
          if (vm.listing.sed.testTasks[i].active) {
            vm.listing.sed.testTasks[i].testParticipants = result.participants;
            vm.listing.sed.testTasks[i].active = false;
          }
        }
        vm.allParticipants = result.allParticipants;
        vm.onChange({ listing: vm.listing });
      });
    }

    function viewTask(task) {
      task.active = true;
      vm.modalInstance = $uibModal.open({
        templateUrl: 'chpl.components/listing/details/sed/task-modal.html',
        controller: 'ViewSedTaskController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          criteria() { return vm.sedCriteria; },
          editMode() { return vm.editMode; },
          participants() { return vm.allParticipants; },
          task() { return task; },
        },
      });
      vm.modalInstance.result.then((result) => {
        for (let i = 0; i < vm.listing.sed.testTasks.length; i++) {
          if (vm.listing.sed.testTasks[i].active) {
            if (result.deleted) {
              vm.listing.sed.testTasks.splice(i, 1);
              vm.taskCount = vm.listing.sed.testTasks.length;
            } else {
              vm.listing.sed.testTasks[i] = result.task;
              vm.listing.sed.testTasks[i].active = false;
            }
          }
        }
        vm.allParticipants = result.participants;
        vm.onChange({ listing: vm.listing });
      });
    }

    /// /////////////////////////////////////////////////////////////////

    vm._analyzeSed = _analyzeSed;

    function _analyzeSed() {
      if (!vm.listing.chplProductNumber
                || !vm.listing.developer
                || !vm.listing.product
                || !vm.listing.version
                || !vm.listing.certificationResults
                || !vm.listing.sed) {
        $timeout(_analyzeSed, 500);
      } else {
        let csvRow;
        let i;
        let j;
        let object;
        let participant;
        let task;
        const TASK_START = 5;
        const PART_START = TASK_START + 14;
        const ROW_BASE = [
          vm.listing.chplProductNumber,
          vm.listing.developer.name,
          vm.listing.product.name,
          vm.listing.version.version,
        ];
        object = {
          participants: {},
        };
        vm.csvData = {
          name: `${vm.listing.chplProductNumber}.sed.csv`,
          values: [[
            'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
            'Task Description', 'Rating Scale', 'Task Rating', 'Task Rating - Standard Deviation', 'Task Time Mean (s)', 'Task Time - Standard Deviation (s)', 'Task Time Deviation - Observed (s)', 'Task Time Deviation - Optimal (s)', 'Task Success - Mean (%)', 'Task Success - Standard Deviation (%)', 'Task Errors - Mean (%)', 'Task Errors - Standard Deviation (%)', 'Task Path Deviation - Observed (# of Steps)', 'Task Path Deviation - Optimal (# of Steps)',
            'Occupation', 'Education Type', 'Product Experience (Months)', 'Professional Experience (Months)', 'Computer Experience (Months)', 'Age (Years)', 'Gender', 'Assistive Technology Needs',
          ]],
        };

        vm.sedCriteria = vm.listing.certificationResults
          .filter((cert) => cert.success && cert.sed)
          .map((cert) => cert.criterion);
        vm.criteriaCount = vm.sedCriteria.length;

        csvRow = angular.copy(ROW_BASE);

        for (i = 0; i < vm.listing.sed.testTasks.length; i++) {
          task = {...vm.listing.sed.testTasks[i]};
          task.cuid = task.id ?? Math.random();
          task.criteria = $filter('orderBy')(task.criteria.filter((cert) => vm.sedCriteria.map((cert) => cert.number).indexOf(cert.number) > -1), vm.sortCert);

          csvRow[4] = task.criteria.map((item) => (item.removed ? 'Removed | ' : '') + item.number).join(';');
          csvRow[TASK_START + 0] = task.description;
          csvRow[TASK_START + 1] = task.taskRatingScale;
          csvRow[TASK_START + 2] = task.taskRating;
          csvRow[TASK_START + 3] = task.taskRatingStddev;
          csvRow[TASK_START + 4] = task.taskTimeAvg;
          csvRow[TASK_START + 5] = task.taskTimeStddev;
          csvRow[TASK_START + 6] = task.taskTimeDeviationObservedAvg;
          csvRow[TASK_START + 7] = task.taskTimeDeviationOptimalAvg;
          csvRow[TASK_START + 8] = task.taskSuccessAverage;
          csvRow[TASK_START + 9] = task.taskSuccessStddev;
          csvRow[TASK_START + 10] = task.taskErrors;
          csvRow[TASK_START + 11] = task.taskErrorsStddev;
          csvRow[TASK_START + 12] = task.taskPathDeviationObserved;
          csvRow[TASK_START + 13] = task.taskPathDeviationOptimal;
          for (j = 0; j < task.testParticipants.length; j++) {
            participant = task.testParticipants[j];
            participant.cuid = participant.id ?? participant.friendlyId;
            if (angular.isUndefined(object.participants[participant.cuid])) {
              object.participants[participant.cuid] = participant;
              object.participants[participant.cuid].tasks = [];
            }
            object.participants[participant.cuid].tasks.push(task.cuid);
            csvRow[PART_START + 0] = participant.occupation;
            csvRow[PART_START + 1] = participant.educationType.name;
            csvRow[PART_START + 2] = participant.productExperienceMonths;
            csvRow[PART_START + 3] = participant.professionalExperienceMonths;
            csvRow[PART_START + 4] = participant.computerExperienceMonths;
            csvRow[PART_START + 5] = participant.age.name;
            csvRow[PART_START + 6] = participant.gender;
            csvRow[PART_START + 7] = participant.assistiveTechnologyNeeds;

            vm.csvData.values.push(angular.copy(csvRow));
          }
        }

        vm.taskCount = vm.listing.sed.testTasks.length;

        const partMap = {};
        vm.allParticipants = [];
        angular.forEach(object.participants, (participant) => {
          const val = angular.copy(participant);
          vm.allParticipants.push(val);
        });
        for (i = 0; i < vm.listing.sed.testTasks.length; i++) {
          task = vm.listing.sed.testTasks[i];
          for (j = 0; j < task.testParticipants.length; j++) {
            participant = task.testParticipants[j];
          }
        }

        vm.ucdProcesses = vm.listing.sed.ucdProcesses
          .map((item) => {
            vm.sedCriteria = vm.sedCriteria
              .map((criterion) => {
                if (item.criteria.findIndex((crit) => crit.number === criterion.number && crit.title === criterion.title) > -1) {
                  criterion.found = true;
                }
                return criterion;
              });
            return item;
          })
          .concat([{
            name: undefined,
            details: undefined,
            criteria: vm.sedCriteria.filter((criterion) => !criterion.found),
          }])
          .filter((item) => item.criteria.length > 0);

        vm.csvData.values = csvSort(vm.csvData.values);
      }
    }

    function csvSort(data) {
      const mapped = data.map((el, i) => {
        if (i === 0) {
          return {
            index: 0,
            value: Number.MIN_VALUE,
          };
        }
        const vals = el[4].split(';');
        return {
          index: i,
          value: vals.reduce((sum, cur) => sum + vm.sortCert(cur), 0),
        };
      });

      mapped.sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        }
        if (a.value > b.value) {
          return 1;
        }
        return 0;
      });

      const ret = mapped.map((el) => data[el.index]);

      return ret;
    }
  }
}());
