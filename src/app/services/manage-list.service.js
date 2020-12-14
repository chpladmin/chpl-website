/*
 * Note for future users, make sure "cancel" is called in the $onDestroy block of any component that uses this service
 */
class ManageList {
    constructor ($log) {
        'ngInject';
        this.$log = $log;

        this.addingItem = {};
        this.newItem = {};
    }

    add (type, create) {
        let item = create(this.newItem[type]);
        this.cancel(type);
        return item;
    }

    cancel (type) {
        this.addingItem[type] = false;
        this.newItem[type] = {};
    }
}

angular.module('chpl.services')
    .service('ManageList', ManageList);
