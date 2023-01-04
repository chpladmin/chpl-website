(function () {
  'use strict';

  describe('the Report Utility service', () => {
    var $log, mock, service;

    mock = {
      additionalSoftware: [
        {name: 'Microsoft Word', version: '1', grouping: 'A', certifiedProductNumber: 'CHP-20202', justification: 'A reason'},
        {name: 'LotusNotes', version: '1', grouping: 'A', certifiedProductNumber: 'CHP-20202', justification: 'A reason'},
      ],
      criteria: [
        { number: '170.315 (b)(2)', title: 'Clinical Information Reconciliation and Incorporation (Cures Update)' },
        { number: '170.315 (b)(2)', title: 'Clinical Information Reconciliation and Incorporation' },
      ],
      qmsStandards: [
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:8.2.1 Communications with customers;Release notes are provided with each version release to all clients for all enhancements and bug fixes.', applicableCriteria: 'All'},
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:9.2 Internal audit;Each team member receives bi-yearly \'Scaled Agile SAFe Team Self-Assessment\' to score and comment on:l Healthiness of Product Ownershipl Healthiness of Release Planningl Sprint Healthl Team Healthl Technical Health', applicableCriteria: 'All'},
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:6.2 Quality objectives and planning to achieve them;Quality Assurance is an integro part of software planning session iterations every two weeks.', applicableCriteria: 'All'},
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:7.4 Communication; Gap (not implemented)', applicableCriteria: 'All'},
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:6.3 Planning of changes;Agile development works with a \'change control board\' in place to control and manage changes.', applicableCriteria: 'All'},
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:8.3 Design and development of products and services;Agile teams participates in:l Daily Standupsl Backlog Refinementsl Sprint Planning Sessions l Sprint Reviewl Sprint RetrospectiveISO 9001:8.3.3 Design and development inputsRequirements are specified in \'Story Points\' (User Stories)ISO 9001:8.3.4 Design and development controls;Clients receive pre-lease versions on their UAT environment for acceptance testing.', applicableCriteria: 'All'},
        {qmsStandardName: 'Modified QMS/Mapped', qmsModification: 'ISO 9001:8.4  Control of externally provided processes, products and services; Gap (not implemented)', applicableCriteria: 'All'},
      ],
      targetedUsers: [
        {targetedUserName: 'Ambulatory and InPatient'},
        {targetedUserName: 'Patient Clinics'},
      ],
      functionalitiesTested: [
        {name: 'Test 2'},
        {name: 'Test 1'},
      ],
    };

    beforeEach(() => {
      angular.mock.module('chpl.reports');

      inject((_$log_, _ReportService_) => {
        $log = _$log_;
        service = _ReportService_;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('when comparing objects', () => {
      it('should handle nulls', () => {
        expect(service.compare(null, null, 'meaningfulUseUserHistory')).toEqual([]);
      });

      it('should handle empty arrays', () => {
        expect(service.compare([], [], 'meaningfulUseUserHistory')).toEqual([]);
      });

      it('should handle undefined', () => {
        expect(service.compare([], undefined, 'meaningfulUseUserHistory')).toEqual([]);
      });

      it('should handle non-arrays', () => {
        expect(service.compare(8, {id: 'wrong'}, 'meaningfulUseUserHistory')).toEqual([]);
      });

      it('should handle unknown objects with a default display', () => {
        const before = [];
        const after = [{name: 'a name', value: 3}];
        expect(service.compare(before, after, 'unknown')).toEqual(['<li>Added <pre>{"name":"a name","value":3}</pre></li>']);
      });
    });

    describe('when comparing MUU objects', () => {
      it('should report when an item was added to an empty array', () => {
        const before = [];
        const after = angular.copy(before).concat({ muuCount: 10, muuDate: 1439799743364 });
        expect(service.compare(before, after, 'meaningfulUseUserHistory')).toEqual(['<li>Added MUU Count of 10 on Aug 17, 2015</li>']);
      });

      it('should report when an item was added to a populated array', () => {
        const before = [{ muuCount: 0, muuDate: 1539799743364 }];
        const after = angular.copy(before).concat({ muuCount: 10, muuDate: 1439799743364 });
        expect(service.compare(before, after, 'meaningfulUseUserHistory')).toEqual(['<li>Added MUU Count of 10 on Aug 17, 2015</li>']);
      });

      it('should report when an item was removed making an empty array', () => {
        const before = [{ muuCount: 10, muuDate: 1439799743364 }];
        const after = [];
        expect(service.compare(before, after, 'meaningfulUseUserHistory')).toEqual(['<li>Removed MUU Count of 10 on Aug 17, 2015</li>']);
      });

      it('should report when an item was removed, leaving a populated array', () => {
        const before = [{ muuCount: 0, muuDate: 1539799743364 }, { muuCount: 10, muuDate: 1439799743364 }];
        const after = angular.copy(before).slice(1);
        expect(service.compare(before, after, 'meaningfulUseUserHistory')).toEqual(['<li>Removed MUU Count of 0 on Oct 17, 2018</li>']);
      });

      it('should report when a value was changed', () => {
        const before = [{ muuCount: 10, muuDate: 1439799743364 }];
        const after = angular.copy(before);
        after[0].muuCount = 30;
        expect(service.compare(before, after, 'meaningfulUseUserHistory')).toEqual(['<li>MUU Count changed from 10 to 30 on Aug 17, 2015</li>']);
      });
    });

    describe('when comparing QMS standards', () => {
      it('should report adds', () => {
        const before = angular.copy(mock.qmsStandards);
        const after = angular.copy(mock.qmsStandards).concat(angular.copy(mock.qmsStandards[0]));
        after[after.length - 1].qmsModification = 'ISO 9001:8.745';
        expect(service.compare(before, after, 'qmsStandards')).toEqual(['<li>Added QMS Standard "Modified QMS/Mapped" with modification "ISO 9001:8.745" applicable to criteria: "All"</li>']);
      });

      it('should report adds to an empty array', () => {
        const after = [].concat(angular.copy(mock.qmsStandards[0]));
        expect(service.compare([], after, 'qmsStandards')).toEqual(['<li>Added QMS Standard "Modified QMS/Mapped" with modification "ISO 9001:8.2.1 Communications with customers;Release notes are provided with each version release to all clients for all enhancements and bug fixes." applicable to criteria: "All"</li>']);
      });

      it('should report removals', () => {
        const before = angular.copy(mock.qmsStandards);
        const after = angular.copy(mock.qmsStandards).slice(1);
        expect(service.compare(before, after, 'qmsStandards')).toEqual(['<li>Removed QMS Standard "Modified QMS/Mapped" with modification "ISO 9001:8.2.1 Communications with customers;Release notes are provided with each version release to all clients for all enhancements and bug fixes." applicable to criteria: "All"</li>']);
      });

      it('should report removals to an empty array', () => {
        const before = [].concat(angular.copy(mock.qmsStandards[0]));
        expect(service.compare(before, [], 'qmsStandards')).toEqual(['<li>Removed QMS Standard "Modified QMS/Mapped" with modification "ISO 9001:8.2.1 Communications with customers;Release notes are provided with each version release to all clients for all enhancements and bug fixes." applicable to criteria: "All"</li>']);
      });
    });

    describe('when comparing targeted users', () => {
      it('should report no changes if there aren\'t any', () => {
        expect(service.compare(mock.targetedUsers, mock.targetedUsers, 'targetedUsers')).toEqual([]);
      });

      it('should report adds', () => {
        const before = angular.copy(mock.targetedUsers);
        const after = angular.copy(mock.targetedUsers).concat(angular.copy(mock.targetedUsers[0]));
        after[after.length - 1].targetedUserName = 'Amphibians';
        expect(service.compare(before, after, 'targetedUsers')).toEqual(['<li>Added Targeted User "Amphibians"</li>']);
      });

      it('should report adds to an empty array', () => {
        const after = [].concat(angular.copy(mock.targetedUsers[0]));
        expect(service.compare([], after, 'targetedUsers')).toEqual(['<li>Added Targeted User "Ambulatory and InPatient"</li>']);
      });

      it('should report removals', () => {
        const before = angular.copy(mock.targetedUsers);
        const after = angular.copy(mock.targetedUsers).slice(1);
        expect(service.compare(before, after, 'targetedUsers')).toEqual(['<li>Removed Targeted User "Ambulatory and InPatient"</li>']);
      });

      it('should report removals to an empty array', () => {
        const before = [].concat(angular.copy(mock.targetedUsers[0]));
        expect(service.compare(before, [], 'targetedUsers')).toEqual(['<li>Removed Targeted User "Ambulatory and InPatient"</li>']);
      });
    });

    describe('when comparing additional software', () => {
      it('should report adds', () => {
        const before = angular.copy(mock.additionalSoftware);
        const after = angular.copy(mock.additionalSoftware).concat(angular.copy(mock.additionalSoftware[0]));
        after[after.length - 1].name = 'Microsoft Excel';
        expect(service.compare(before, after, 'additionalSoftware')).toEqual(['<li>Added Relied Upon Software "Microsoft Excel"</li>']);
      });

      it('should report adds to an empty array', () => {
        const after = [].concat(angular.copy(mock.additionalSoftware[0]));
        expect(service.compare([], after, 'additionalSoftware')).toEqual(['<li>Added Relied Upon Software "Microsoft Word"</li>']);
      });

      it('should report removals', () => {
        const before = angular.copy(mock.additionalSoftware);
        const after = angular.copy(mock.additionalSoftware).slice(1);
        expect(service.compare(before, after, 'additionalSoftware')).toEqual(['<li>Removed Relied Upon Software "Microsoft Word"</li>']);
      });

      it('should report removals to an empty array', () => {
        const before = [].concat(angular.copy(mock.additionalSoftware[0]));
        expect(service.compare(before, [], 'additionalSoftware')).toEqual(['<li>Removed Relied Upon Software "Microsoft Word"</li>']);
      });

      it('should report when a value was changed', () => {
        const before = [].concat(angular.copy(mock.additionalSoftware[0]));
        const after = angular.copy(before);
        after[0].version = 'B';
        expect(service.compare(before, after, 'additionalSoftware')).toEqual(['<li>Updated Relied Upon Software "Microsoft Word":<ul><li>Version changed from "1" to "B"</li></ul></li>']);
      });

      it('should report when a value was changed', () => {
        const before = [].concat(angular.copy(mock.additionalSoftware[0]));
        const after = angular.copy(before);
        after[0].grouping = 'G';
        after[0].certifiedProductNumber = 'CHP-d9d9';
        after[0].justification = 'A different Justification';
        expect(service.compare(before, after, 'additionalSoftware')).toEqual(['<li>Updated Relied Upon Software "Microsoft Word":<ul><li>Grouping changed from "A" to "G"</li><li>CHPL Product Number changed from "CHP-20202" to "CHP-d9d9"</li><li>Justification changed from "A reason" to "A different Justification"</li></ul></li>']);
      });
    });

    describe('when comparing test functionality', () => {
      it('should report adds', () => {
        const before = angular.copy(mock.functionalitiesTested);
        const after = angular.copy(mock.functionalitiesTested).concat(angular.copy(mock.functionalitiesTested[0]));
        after[after.length - 1].name = 'Vets';
        expect(service.compare(before, after, 'functionalitiesTested')).toEqual(['<li>Added Functionalities Tested "Vets"</li>']);
      });

      it('should report adds to an empty array', () => {
        const after = [].concat(angular.copy(mock.functionalitiesTested[0]));
        expect(service.compare([], after, 'functionalitiesTested')).toEqual(['<li>Added Functionalities Tested "Test 2"</li>']);
      });

      it('should report removals', () => {
        const before = angular.copy(mock.functionalitiesTested);
        const after = angular.copy(mock.functionalitiesTested).slice(1);
        expect(service.compare(before, after, 'functionalitiesTested')).toEqual(['<li>Removed Functionalities Tested "Test 2"</li>']);
      });

      it('should report removals to an empty array', () => {
        const before = [].concat(angular.copy(mock.functionalitiesTested[0]));
        expect(service.compare(before, [], 'functionalitiesTested')).toEqual(['<li>Removed Functionalities Tested "Test 2"</li>']);
      });
    });

    describe('when comparing criteria', () => {
      it('should report differences between cures update criteria', () => {
        const before = mock.criteria.filter(c => c.title.indexOf('Cures') === -1);
        const after = mock.criteria.filter(c => c.title.indexOf('Cures') > -1);
        expect(service.compare(before, after, 'criteria')).toEqual([
          '<li>Removed 170.315 (b)(2): Clinical Information Reconciliation and Incorporation</li>',
          '<li>Added 170.315 (b)(2): Clinical Information Reconciliation and Incorporation <span class="cures-update">(Cures Update)</span></li>',
        ]);
      });
    });
  });
})();
