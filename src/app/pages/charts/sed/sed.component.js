export const ChartsSedComponent = {
  templateUrl: 'chpl.charts/sed/sed.html',
  bindings: {
    sedParticipantStatisticsCount: '<',
    participantGenderCount: '<',
    participantAgeCount: '<',
    participantEducationCount: '<',
    participantProfessionalExperienceCount: '<',
    participantComputerExperienceCount: '<',
    participantProductExperienceCount: '<',
  },
  controller: class ChartsSedComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }

    $onChanges (changes) {
      if (changes.sedParticipantStatisticsCount?.currentValue) {
        this._createSedParticipantCountChart(changes.sedParticipantStatisticsCount.currentValue);
      }
      if (changes.participantGenderCount?.currentValue) {
        this._createParticipantGenderCountChart(changes.participantGenderCount.currentValue);
      }
      if (changes.participantAgeCount?.currentValue) {
        this._createParticipantAgeCountChart(changes.participantAgeCount.currentValue);
      }
      if (changes.participantEducationCount?.currentValue) {
        this._createParticipantEducationCountChart(changes.participantEducationCount.currentValue);
      }
      if (changes.participantProfessionalExperienceCount?.currentValue) {
        this._createParticipantProfessionalExperienceCountChart(changes.participantProfessionalExperienceCount.currentValue);
      }
      if (changes.participantComputerExperienceCount?.currentValue) {
        this._createParticipantComputerExperienceCountChart(changes.participantComputerExperienceCount.currentValue);
      }
      if (changes.participantProductExperienceCount?.currentValue) {
        this._createParticipantProductExperienceCountChart(changes.participantProductExperienceCount.currentValue);
      }
    }

    _createSedParticipantCountChart (data) {
      this.sedParticipantCounts = {
        type: 'ColumnChart',
        data: {
          cols: [
            { label: 'Number of SED Test Participants Used', type: 'number'},
            { label: 'Number of 2015 Edition CHPL Listings', type: 'number'},
          ],
          rows: this._getSedParticipantCountDataInChartFormat(data),
        },
        options: {
          animation: {
            duration: 1000,
            easing: 'inAndOut',
            startup: true,
          },
          title: 'Number of Safety Enhanced Design Test Participants',
          hAxis: {
            title: 'Number of SED Test Participants Used',
            minValue: 0,
          },
          vAxis: {
            scaleType: 'mirrorLog',
            title: 'Number of 2015 Edition CHPL Listings',
            minValue: 0,
          },
        },
      };
    }

    _getSedParticipantCountDataInChartFormat (data) {
      data.sedParticipantStatisticsCounts.sort(function (a, b) {
        return parseInt(a.participantCount, 10) - parseInt(b.participantCount, 10);
      });
      return data.sedParticipantStatisticsCounts.map(function (obj) {
        return {c: [{ v: obj.participantCount},{v: obj.sedCount}]};
      });
    }

    _createParticipantGenderCountChart (data) {
      this.participantGenderCounts = {
        type: 'PieChart',
        data: {
          cols: [
            { label: 'Genders', type: 'string'},
            { label: 'Counts', type: 'number'},
          ],
          rows: this._getParticipantGenderCountDataInChartFormat(data),
        },
        options: {
          title: 'Safety Enhanced Design Test Participants by Gender',
        },
      };
    }

    _getParticipantGenderCountDataInChartFormat (data) {
      var genderData = [
        {c: [{ v: 'Male'},{v: data.maleCount}]},
        {c: [{ v: 'Female'},{v: data.femaleCount}]},
        {c: [{ v: 'Unknown'},{v: data.unknownCount}]},
      ];
      return genderData;
    }

    _createParticipantAgeCountChart (data) {
      this.participantAgeCounts = {
        type: 'PieChart',
        data: {
          cols: [
            { label: 'Age Ranges', type: 'string'},
            { label: 'Counts', type: 'number'},
          ],
          rows: this._getParticipantAgeCountDataInChartFormat(data),
        },
        options: {
          title: 'Safety Enhanced Design Test Participants by Age',
        },
      };
    }

    _getParticipantAgeCountDataInChartFormat (data) {
      data.participantAgeStatistics.sort(function (a, b) {
        return parseInt(a.ageRange, 10) - parseInt(b.ageRange, 10);
      });
      return data.participantAgeStatistics.map(function (obj) {
        return {c: [{ v: obj.ageRange},{v: obj.ageCount}]};
      });
    }

    _createParticipantEducationCountChart (data) {
      this.participantEducationCounts = {
        type: 'PieChart',
        data: {
          cols: [
            { label: 'Education Level', type: 'string'},
            { label: 'Counts', type: 'number'},
          ],
          rows: this._getParticipantEducationCountDataInChartFormat(data),
        },
        options: {
          title: 'Safety Enhanced Design Test Participants by Education Level',
        },
      };
    }

    _getParticipantEducationCountDataInChartFormat (data) {
      data.participantEducationStatistics.sort(function (a, b) {
        return parseInt(a.educationRange, 10) - parseInt(b.educationRange, 10);
      });
      return data.participantEducationStatistics.map(function (obj) {
        return {c: [{ v: obj.education},{v: obj.educationCount}]};
      });
    }

    _createParticipantProfessionalExperienceCountChart (data) {
      this.participantProfessionalExperienceCounts = {
        type: 'ColumnChart',
        data: {
          cols: [
            { label: 'Years Professional Experience', type: 'number'},
            { label: 'Number of SED Test Participants ', type: 'number'},
          ],
          rows: this._getParticipantExperienceCountDataInChartFormat(data),
        },
        options: {
          animation: {
            duration: 1000,
            easing: 'inAndOut',
            startup: true,
          },
          title: 'Years of Professional Experience for Safety Enhanced Design Test Participants',
          vAxis: {
            title: 'Number of SED Test Participants',
            minValue: 0,
          },
          hAxis: {
            minValue: 0,
            title: 'Years Professional Experience',
            gridlines: {
              count: 6,
            },
          },
        },
      };
    }

    _createParticipantComputerExperienceCountChart (data) {
      this.participantComputerExperienceCounts = {
        type: 'ColumnChart',
        data: {
          cols: [
            { label: 'Years Computer Experience', type: 'number'},
            { label: 'Number of SED Test Participants ', type: 'number'},
          ],
          rows: this._getParticipantExperienceCountDataInChartFormat(data),
        },
        options: {
          animation: {
            duration: 1000,
            easing: 'inAndOut',
            startup: true,
          },
          title: 'Years of Computer Experience for Safety Enhanced Design Test Participants',
          vAxis: {
            title: 'Number of SED Test Participants',
            minValue: 0,
          },
          hAxis: {
            minValue: 0,
            title: 'Years Computer Experience',
            gridlines: {
              count: 6,
            },
          },
        },
      };
    }

    _createParticipantProductExperienceCountChart (data) {
      this.participantProductExperienceCounts = {
        type: 'ColumnChart',
        data: {
          cols: [
            { label: 'Years Product Experience', type: 'number'},
            { label: 'Number of SED Test Participants ', type: 'number'},
          ],
          rows: this._getParticipantExperienceCountDataInChartFormat(data),
        },
        options: {
          animation: {
            duration: 1000,
            easing: 'inAndOut',
            startup: true,
          },
          title: 'Years of Product Experience for Safety Enhanced Design Test Participants',
          vAxis: {
            title: 'Number of SED Test Participants',
            minValue: 0,
          },
          hAxis: {
            minValue: 0,
            title: 'Years Product Experience',
            gridlines: {
              count: 7,
            },
          },
        },
      };
    }

    _getParticipantExperienceCountDataInChartFormat (data) {
      //Calculate the years exp based on the months
      data.participantExperienceStatistics.map(function (obj) {
        obj.experienceYears = Math.floor(obj.experienceMonths / 12);
        return obj;
      });

      //Sum participants based on years experience
      //var experienceMap = new Map();
      var experienceMap = {};
      angular.forEach(data.participantExperienceStatistics, function (value) {
        var count = value.participantCount;
        //if (experienceMap.has(value.experienceYears)) {
        if (value.experienceYears in experienceMap) {
          count = experienceMap[value.experienceYears] + count;
        }
        experienceMap[value.experienceYears] = count;
      });

      //var experienceSummedByYear = Array.from(experienceMap);
      //Convert to an array of arrays
      var experienceSummedByYear = Object.keys(experienceMap).map(function (key) {
        return [key, experienceMap[key]];
      });

      //Sort based on years experience
      experienceSummedByYear.sort(function (a, b) {
        return parseInt(a[0], 10) - parseInt(b[0], 10);
      });

      //Format the data for the chart
      return experienceSummedByYear.map(function (obj) {
        return {c: [{ v: obj[0]},{v: obj[1]}]};
      });
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsSed', ChartsSedComponent);
