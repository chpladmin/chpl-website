;(function () {
    'use strict';

    /*****************************************************
     * This section is dummy data until the API can be wired up
     */
    var max_ishResults = 200;
    var words = ['Aliquam', 'Erat', 'Volutpat', 'Nunc', 'Eleifend', 'Leo', 'Vitae', 'Magna', 'In', 'Id', 'Erat', 'Non', 'Orci', 'Commodo', 'Lobortis', 'Proin', 'Neque', 'Massa', 'Cursus', 'Ut', 'Gravida', 'Ut', 'Lobortis', 'Eget', 'Lacus', 'Sed', 'Diam', 'Praesent', 'Fermentum', 'Tempor', 'Tellus', 'Nullam', 'Tempus', 'Mauris', 'Ac', 'Felis', 'Vel', 'Velit', 'Tristique', 'Imperdiet', 'Donec', 'At', 'Pede', 'Etiam', 'Vel', 'Neque', 'Nec', 'Dui', 'Dignissim', 'Bibendum', 'Vivamus', 'Id', 'Enim', 'Phasellus', 'Neque', 'Orci', 'Porta', 'A', 'Aliquet', 'Quis', 'Semper', 'A', 'Massa', 'Phasellus', 'Purus', 'Pellentesque', 'Tristique', 'Imperdiet', 'Tortor', 'Nam', 'Euismod', 'Tellus', 'Id', 'Erat', 'Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetuer', 'Adipiscing', 'Elit', 'Donec', 'Hendrerit', 'Tempor', 'Tellus', 'Donec', 'Pretium', 'Posuere', 'Tellus', 'Proin', 'Quam', 'Nisl', 'Tincidunt', 'Et', 'Mattis', 'Eget', 'Convallis', 'Nec', 'Purus', 'Sociis', 'Natoque', 'Penatibus', 'Et', 'Magnis', 'Dis', 'Parturient', 'Montes', 'Nascetur', 'Ridiculus', 'Mus', 'Nulla', 'Posuere', 'Donec', 'Vitae', 'Dolor', 'Nullam', 'Tristique', 'Diam', 'Non', 'Turpis', 'Cras', 'Placerat', 'Accumsan', 'Nulla', 'Nullam', 'Rutrum', 'Nam', 'Vestibulum', 'Accumsan', 'Nisl'];
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];

    function fakeDate() {
        return Math.floor(Math.random() * 120 + 1900) + "-" + months[Math.floor(Math.random() * months.length)] + "-" + days[Math.floor(Math.random() * days.length)];
    }

    function fakeWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function fakeCerts() {
        return Math.floor(Math.random() * 40) + " certs & " + Math.floor(Math.random() * 60) + " CQMs";
    }

    function fakeChunk() {
        var chunks = [].concat(words).concat(months).concat(days);
        return chunks[Math.floor(Math.random() * chunks.length)];
    }

    function fakeSentence() {
        var wordCount = Math.floor(Math.random() * 30 + 30);
        var ret = "";
        for (var i = 0; i < wordCount; i++) {
            ret += fakeWord() + " ";
        }
        ret += fakeWord() + ".";
        return ret;
    }

    function makeFakes(many) {
        var ret = [];
        for (var i = 0; i < many; i++) {
            ret.push({
                details: fakeSentence(),
                vendor: fakeWord() + " " + fakeWord(),
                product: fakeWord() + " " + fakeWord() + "-" + fakeWord(),
                version: fakeChunk() + "." + fakeChunk(),
                certs: fakeCerts(),
                certDate: fakeDate()
            });
        };
        return ret;
    }

    /*
     * End of dummy data section
     *******************************************************/

    angular.module('app.search')
        .service('searchService', function () {
            var self = this;

            self.search = function () {
                return makeFakes(Math.floor(Math.random() * max_ishResults + 5));
            };
        });
})();
