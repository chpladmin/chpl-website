(() => {
  'use strict';

  describe('the SED Display', () => {
    var $compile, $log, $uibModal, Mock, actualOptions, el, scope, utilService, vm;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', $provide => {
        $provide.decorator('utilService', $delegate => {
          $delegate.makeCsv = jasmine.createSpy('makeCsv');
          $delegate.sortCertArray = jasmine.createSpy('sortCertArray');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, $rootScope, _$uibModal_, _Mock_, _utilService_) => {
        $compile = _$compile_;
        $log = _$log_;
        Mock = _Mock_;
        utilService = _utilService_;
        utilService.makeCsv.and.returnValue();
        utilService.sortCertArray.and.callThrough();
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake(options => {
          actualOptions = options;
          return Mock.fakeModal;
        });

        el = angular.element('<ai-sed listing="listing"></ai-sed>');

        scope = $rootScope.$new();
        scope.listing = angular.copy(Mock.fullListings[1]);
        scope.listing.certificationResults = scope.listing.certificationResults.map(cert => {
          cert.criterion = { number: cert.number, title: cert.title };
          return cert;
        });
        scope.listing.sed = angular.copy(Mock.sed);
        $compile(el)(scope);
        scope.$digest();
        vm = el.isolateScope().vm;
        scope.vm = vm;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('directive', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should have isolate scope object with instanciate members', () => {
        expect(vm).toEqual(jasmine.any(Object));
        expect(vm.listing).toBeDefined();
      });

      describe('should use the util service', () => {
        it('to enable sorting of tasks', () => {
          vm.sortTasks(vm.listing.sed.testTasks[0]);
          expect(utilService.sortCertArray).toHaveBeenCalled();
        });

        it('to enable sorting of processes', () => {
          vm.sortProcesses(vm.listing.sed.testTasks[0]);
          expect(utilService.sortCertArray).toHaveBeenCalled();
        });

        it('to make a csv', () => {
          vm.getCsv();
          expect(utilService.makeCsv).toHaveBeenCalled();
        });
      });

      describe('during initialization', () => {
        it('should know how many criteria were sed tested', () => {
          expect(vm.criteriaCount).toBeDefined();
          expect(vm.criteriaCount).toBe(12);
        });

        it('should filter out criteria that were not successful or not sed', () => {
          expect(vm.sedCriteria.length).toBe(12);
        });

        describe('with respect to tasks', () => {
          it('should have an array of tasks', () => {
            expect(vm.listing.sed.testTasks.length).toBe(48);
          });

          it('should have the associated criteria attached to the tasks', () => {
            expect(vm.listing.sed.testTasks[0].criteria[0].number).toEqual('170.315 (a)(5)');
          });

          it('should know what the task length is', () => {
            expect(vm.taskCount).toBeDefined();
            expect(vm.taskCount).toBe(48);
          });
        });

        describe('with respect to participants', () => {
          it('should have an array of unique participants pulled from the tasks', () => {
            expect(vm.allParticipants.length).toBe(35);
          });

          it('should have an array of taskIds associated with each participant', () => {
            expect(vm.allParticipants[0].tasks.length).toBe(39);
            expect(vm.allParticipants[0].tasks[0]).toBe(16853);
            expect(vm.allParticipants[0].tasks[38]).toBe(16900);
          });
        });

        describe('with respect to ucd processes', () => {
          it('should have an array of ucd processes that were used', () => {
            expect(vm.ucdProcesses.length).toBe(1);
          });

          it('should associate the UCD Processes with multiple criteria', () => {
            expect(vm.ucdProcesses[0].criteria[0].number).toBe('170.315 (a)(5)');
            expect(vm.ucdProcesses[0].criteria.length).toBe(12);
          });
        });

        describe('for the csv download', () => {
          it('should create a data object with a name and a header row', () => {
            expect(vm.csvData.name).toBe('15.04.04.2891.Alls.17.01.1.170512.sed.csv');
            expect(vm.csvData.values[0]).toEqual([
              'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
              'Task Description', 'Rating Scale', 'Task Rating', 'Task Rating - Standard Deviation', 'Task Time Mean (s)', 'Task Time - Standard Deviation (s)', 'Task Time Deviation - Observed (s)', 'Task Time Deviation - Optimal (s)', 'Task Success - Mean (%)', 'Task Success - Standard Deviation (%)', 'Task Errors - Mean (%)', 'Task Errors - Standard Deviation (%)', 'Task Path Deviation - Observed (# of Steps)', 'Task Path Deviation - Optimal (# of Steps)',
              'Occupation', 'Education Type', 'Product Experience (Months)', 'Professional Experience (Months)', 'Computer Experience (Months)', 'Age (Years)', 'Gender', 'Assistive Technology Needs',
            ]);
          });

          it('should have data rows', () => {
            expect(vm.csvData.values.length).toBe(659);
            expect(vm.csvData.values[1][0]).toBe('15.04.04.2891.Alls.17.01.1.170512');
            expect(vm.csvData.values[1][5]).toBe('Review Current / Historical medications');
            expect(vm.csvData.values[1][19]).toBe('Physician');
          });

          it('should sort the rows by criteria', () => {
            expect(vm.csvData.values[1][4]).toBe('170.315 (a)(1)');
          });

          it('should combine criteria under the same task', () => {
            expect(vm.csvData.values[126][0]).toBe('15.04.04.2891.Alls.17.01.1.170512');
            expect(vm.csvData.values[126][5]).toBe('Trigger, attend and interpret CDS intervention for drug-allergy interaction, and access information.');
            expect(vm.csvData.values[126][19]).toBe('Physician');
          });
        });
      });

      describe('while dealing with pending listings', () => {
        beforeEach(() => {
          var sed = angular.copy(Mock.sed);
          sed.testTasks = sed.testTasks.map(task => {
            task.uniqueId = task.id;
            delete task.id;
            task.testParticipants = task.testParticipants.map(part => {
              part.uniqueId = 'id-' + part.id;
              delete part.id;
              return part;
            });
            return task;
          });
          el = angular.element('<ai-sed listing="listing"></ai-sed>');
          scope.listing = angular.copy(Mock.pendingListings[0]);
          scope.listing.certificationResults = scope.listing.certificationResults.map(cert => {
            cert.criterion = { number: cert.number, title: cert.title };
            return cert;
          });
          scope.listing.sed = sed;
          $compile(el)(scope);
          scope.$digest();
          vm = el.isolateScope().vm;
          scope.vm = vm;
        });

        describe('during initialization', () => {
          it('should know how many criteria were sed tested', () => {
            expect(vm.criteriaCount).toBe(11);
          });

          it('should filter out criteria that were not successful or not sed', () => {
            expect(vm.sedCriteria.length).toBe(11);
          });

          describe('with respect to tasks', () => {
            it('should have an array of tasks pulled from the criteria', () => {
              expect(vm.listing.sed.testTasks.length).toBe(48);
            });

            it('should have the associated criteria attached to the tasks', () => {
              expect(vm.listing.sed.testTasks[0].criteria[0].number).toEqual('170.315 (a)(5)');
            });

            it('should know what the task length is', () => {
              expect(vm.taskCount).toBeDefined();
              expect(vm.taskCount).toBe(48);
            });
          });

          describe('with respect to participants', () => {
            it('should have an array of unique participants pulled from the criteria', () => {
              expect(vm.allParticipants.length).toBe(35);
            });

            it('should have an array of taskIds associated with each participant', () => {
              expect(vm.allParticipants[0].tasks.length).toBe(34);
              expect(vm.allParticipants[0].tasks[0]).toBe(-1);
              expect(vm.allParticipants[0].tasks[33]).toBe(-48);
            });

            it('should set the "id" to be a negative integer', () => {
              expect(vm.allParticipants[0].id).toBeLessThan(0);
            });
          });

          describe('with respect to ucd processes', () => {
            it('should have an array of ucd processes that were used', () => {
              expect(vm.ucdProcesses.length).toBe(1);
            });

            it('should associate the UCD Processes with multiple criteria', () => {
              expect(vm.ucdProcesses[0].criteria[0].number).toEqual('170.315 (a)(5)');
            });
          });

          describe('for the csv download', () => {
            it('should create a data object with a name and a header row', () => {
              expect(vm.csvData.name).toBe('15.07.07.1447.EI97.62.01.1.160402.sed.csv');
              expect(vm.csvData.values[0]).toEqual([
                'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
                'Task Description', 'Rating Scale', 'Task Rating', 'Task Rating - Standard Deviation', 'Task Time Mean (s)', 'Task Time - Standard Deviation (s)', 'Task Time Deviation - Observed (s)', 'Task Time Deviation - Optimal (s)', 'Task Success - Mean (%)', 'Task Success - Standard Deviation (%)', 'Task Errors - Mean (%)', 'Task Errors - Standard Deviation (%)', 'Task Path Deviation - Observed (# of Steps)', 'Task Path Deviation - Optimal (# of Steps)',
                'Occupation', 'Education Type', 'Product Experience (Months)', 'Professional Experience (Months)', 'Computer Experience (Months)', 'Age (Years)', 'Gender', 'Assistive Technology Needs',
              ]);
            });

            it('should have data rows', () => {
              expect(vm.csvData.values.length).toBe(659);
              expect(vm.csvData.values[1][0]).toBe('15.07.07.1447.EI97.62.01.1.160402');
              expect(vm.csvData.values[1][5]).toBe('Review Current / Historical medications');
              expect(vm.csvData.values[1][19]).toBe('Physician');
            });

            it('should sort the rows by criteria', () => {
              expect(vm.csvData.values[1][4]).toBe('170.315 (a)(1)');
            });

            it('should combine criteria under the same task', () => {
              expect(vm.csvData.values[126][0]).toBe('15.07.07.1447.EI97.62.01.1.160402');
              expect(vm.csvData.values[126][5]).toBe('Trigger, attend and interpret CDS intervention for drug-allergy interaction, and access information.');
              expect(vm.csvData.values[126][19]).toBe('Physician');
            });
          });
        });
      });
    });

    describe('when viewing Task details', () => {
      var modalOptions, participants, task;
      beforeEach(() => {
        modalOptions = {
          templateUrl: 'chpl.components/listing/details/sed/task-modal.html',
          controller: 'ViewSedTaskController',
          controllerAs: 'vm',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            criteria: jasmine.any(Function),
            editMode: jasmine.any(Function),
            participants: jasmine.any(Function),
            task: jasmine.any(Function),
          },
        };
        task = {
          id: 3,
        };
        participants = [1,2,3];
        vm.allParticipants = participants;
      });

      it('should create a modal instance', () => {
        expect(vm.modalInstance).toBeUndefined();
        vm.viewTask(task);
        expect(vm.modalInstance).toBeDefined();
      });

      it('should resolve elements', () => {
        vm.editMode = 'on';
        vm.viewTask(task);
        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
        expect(actualOptions.resolve.criteria()[0].number).toEqual('170.315 (b)(2)');
        expect(actualOptions.resolve.editMode()).toBe('on');
        expect(actualOptions.resolve.participants()).toEqual(participants);
        expect(actualOptions.resolve.task()).toEqual(task);
      });

      it('should replace the active task with an edited one on close', () => {
        var newTask = {
          name: 'fake',
          id: vm.listing.sed.testTasks[1].id,
        };
        vm.viewTask(vm.listing.sed.testTasks[1]);
        vm.modalInstance.close({
          task: newTask,
          participants: [1],
        });
        expect(vm.listing.sed.testTasks[1]).toBe(newTask);
        expect(vm.allParticipants).toEqual([1]);
      });

      it('should remove the active task if it was deleted', () => {
        var initLength = vm.listing.sed.testTasks.length;
        vm.viewTask(vm.listing.sed.testTasks[1]);
        vm.modalInstance.close({
          deleted: true,
          participants: [1],
        });
        expect(vm.listing.sed.testTasks.length).toBe(initLength - 1);
        expect(vm.allParticipants).toEqual([1]);
      });
    });

    describe('when adding a Task', () => {
      var modalOptions;
      beforeEach(() => {
        modalOptions = {
          templateUrl: 'chpl.components/listing/details/sed/edit-task.html',
          controller: 'EditSedTaskController',
          controllerAs: 'vm',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            criteria: jasmine.any(Function),
            participants: jasmine.any(Function),
            task: jasmine.any(Function),
          },
        };
      });

      it('should create a modal instance', () => {
        expect(vm.modalInstance).toBeUndefined();
        vm.addTask();
        expect(vm.modalInstance).toBeDefined();
      });

      it('should resolve elements', () => {
        vm.allParticipants = [1,2];
        vm.addTask();
        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
        expect(actualOptions.resolve.criteria()[0].number).toEqual('170.315 (b)(2)');
        expect(actualOptions.resolve.participants()).toEqual([1,2]);
        expect(actualOptions.resolve.task()).toEqual({});
      });

      it('should add the new task to the list of tasks', () => {
        vm.listing.sed.testTasks = [];
        vm.addTask();
        vm.modalInstance.close({task: 'new', participants: [2,3]});
        expect(vm.listing.sed.testTasks).toEqual(['new']);
      });

      it('should update the list of participants', () => {
        vm.allParticipants = [1,2];
        vm.addTask();
        vm.modalInstance.close({task: 'new', participants: [2,3]});
        expect(vm.allParticipants).toEqual([2,3]);
      });
    });

    describe('when viewing Task Participants', () => {
      var modalOptions;
      beforeEach(() => {
        modalOptions = {
          templateUrl: 'chpl.components/listing/details/sed/participants-modal.html',
          controller: 'ViewSedParticipantsController',
          controllerAs: 'vm',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            allParticipants: jasmine.any(Function),
            editMode: jasmine.any(Function),
            participants: jasmine.any(Function),
          },
        };
        vm.listing.sed.testTasks = [
          {
            id: 1,
            testParticipants: [1,2],
          },
          {
            id: 2,
            testParticipants: [3,4],
          },
        ];
      });

      it('should create a modal instance', () => {
        expect(vm.modalInstance).toBeUndefined();
        vm.viewParticipants(vm.listing.sed.testTasks[1]);
        expect(vm.modalInstance).toBeDefined();
      });

      it('should resolve elements', () => {
        vm.allParticipants = [1,2];
        vm.editMode = 'on';
        vm.viewParticipants(vm.listing.sed.testTasks[1]);
        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
        expect(actualOptions.resolve.allParticipants()).toEqual([1,2]);
        expect(actualOptions.resolve.editMode()).toBe('on');
        expect(actualOptions.resolve.participants()).toEqual([3,4]);
      });

      it('should replace the task participant list with an edited one on close', () => {
        var newParticipants = [1,2,3];
        vm.viewParticipants(vm.listing.sed.testTasks[1]);
        vm.modalInstance.close({
          participants: newParticipants,
        });
        expect(vm.listing.sed.testTasks[1].testParticipants).toEqual(newParticipants);
      });

      it('should replace the "all participants" list with an edited one on close', () => {
        var newParticipants = [1,2,3];
        vm.allParticipants = [1,2];
        vm.viewParticipants(vm.listing.sed.testTasks[1]);
        vm.modalInstance.close({
          allParticipants: newParticipants,
        });
        expect(vm.allParticipants).toEqual(newParticipants);
      });
    });

    describe('when editing SED details', () => {
      var modalOptions;
      beforeEach(() => {
        modalOptions = {
          templateUrl: 'chpl.components/listing/details/sed/edit-details.html',
          controller: 'EditSedDetailsController',
          controllerAs: 'vm',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            criteria: jasmine.any(Function),
            listing: jasmine.any(Function),
            resources: jasmine.any(Function),
            ucdProcesses: jasmine.any(Function),
          },
        };
      });

      it('should create a modal instance', () => {
        expect(vm.modalInstance).toBeUndefined();
        vm.editDetails();
        expect(vm.modalInstance).toBeDefined();
      });

      it('should resolve elements', () => {
        vm.resources = 'resources';
        vm.editDetails();
        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
        expect(actualOptions.resolve.criteria()).toEqual(vm.sedCriteria);
        expect(actualOptions.resolve.listing()).toEqual(vm.listing);
        expect(actualOptions.resolve.resources()).toBe('resources');
        expect(actualOptions.resolve.ucdProcesses()).toEqual(vm.ucdProcesses);
      });

      it('should update some of the active listing values with the edited values on close', () => {
        var newListing = {
          sedReportFileLocation: 'new',
          sedIntendedUserDescription: 'desc',
          sedTestingEndDay: 'a date',
        };
        expect(vm.listing.sedReportFileLocation).not.toEqual(newListing.sedReportFileLocation);
        expect(vm.listing.sedIntendedUserDescription).not.toEqual(newListing.sedIntendedUserDescription);
        expect(vm.listing.sedTestingEndDay).not.toEqual(newListing.sedTestingEndDay);

        vm.editDetails();
        vm.modalInstance.close({
          listing: newListing,
        });

        expect(vm.listing.sedReportFileLocation).toEqual(newListing.sedReportFileLocation);
        expect(vm.listing.sedIntendedUserDescription).toEqual(newListing.sedIntendedUserDescription);
        expect(vm.listing.sedTestingEndDay).toEqual(newListing.sedTestingEndDay);
      });

      it('should replace ucd processes with the new ones', () => {
        var newProcesses = [1,2];
        vm.editDetails();
        vm.modalInstance.close({
          listing: {sed: {}},
          ucdProcesses: newProcesses,
        });
        expect(vm.ucdProcesses).toEqual(newProcesses);
      });
    });
  });
})();
