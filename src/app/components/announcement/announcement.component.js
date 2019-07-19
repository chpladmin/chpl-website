export const AnnouncementComponent = {
    templateUrl: 'chpl.components/announcement/announcement.html',
    bindings: {
        announcement: '<',
        takeAction: '&',
    },
    controller: class AnnouncementComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.announcement) {
                this.announcement = angular.copy(changes.announcement.currentValue);
            }
        }

        save () {
            this.isEditing = false;
            this.takeAction({
                data: this.announcement,
                action: 'save',
            });
        }

        delete () {
            this.isEditing = false;
            this.takeAction({
                data: this.announcement,
                action: 'delete',
            });
        }

        cancel () {
            this.isEditing = false;
            this.takeAction({
                data: this.announcement,
                action: 'cancel',
            });
        }

        create () {
            this.isEditing = false;
            this.takeAction({
                data: this.announcement,
                action: 'create',
            });
        }

        validDates () {
            return this.announcement.endDate && this.announcement.startDate && this.announcement.endDate > this.announcement.startDate;
        }
    },
}

angular.module('chpl.components')
    .component('chplAnnouncement', AnnouncementComponent);
