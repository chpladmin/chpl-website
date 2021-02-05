(() => {
  'use strict';

  describe('the Manage List service', () => {
    var $log, service;

    beforeEach(() => {
      angular.mock.module('chpl.services');

      inject((_$log_, _ManageList_) => {
        $log = _$log_;
        service = _ManageList_;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    it('should cancel by type', () => {
      let type = 'test';
      service.addingItem[type] = true;
      service.newItem[type] = 'something';
      service.cancel(type);
      expect(service.addingItem[type]).toBe(false);
      expect(service.newItem[type]).toEqual({});
    });

    it('should return objects for adding', () => {
      let type = 'foo';
      let create = () => 'bar';
      service.newItem[type] = 'baz';
      expect(service.add(type, create)).toBe('bar');
      service.newItem[type] = 'baz';
      create = input => input;
      expect(service.add(type, create)).toBe('baz');
      service.newItem[type] = 'biz';
      expect(service.add(type, create)).not.toBe('baz');
      service.newItem[type] = 'biz';
      expect(service.add(type, create)).toBe('biz');
    });

    it('should cancel after add', () => {
      spyOn(service, 'cancel');
      let type = 'foo';
      let create = () => 'bar';
      service.add(type, create);
      expect(service.cancel).toHaveBeenCalledWith(type);
    });
  });
})();
