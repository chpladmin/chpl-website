(function() {
    'use strict';

    angular.module('app')
        .factory('expensesDataService', ['$http', expensesDataService]);

    function expensesDataService($http) {
        var service = {
            getExpenses: getExpenses,
            persistExpenses: persistExpenses
        };

        return service;

        function getExpenses() {
            return [
                new ExpenseItem('Taxi', 'To airport', 83.39),
                new ExpenseItem('Lunch', 'At airport', 15.32),
                new ExpenseItem('Coffee', 'Starbucks', 3.20)
            ];
        };

        function reportExpenses() {
            // some report work
        };

        function persistExpenses(reportExpenses) {
            // do work
            var success = true;
            if (success) {
                reportExpenses();
            };
        };
    };
})();
