export const AnnouncementsComponent = {
    templateUrl: 'chpl.administration/announcements/announcements.html',
    bindings: {
        announcements: '<',
    },
    controller: class AnnouncementsComponent {
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.announcements && changes.announcements.currentValue) {
                this.announcements = angular.copy(changes.announcements.currentValue.announcements);
            }
        }

        create () {
            this.activeAnnouncement = {};
            this.isEditing = true;
        }

        edit (announcement) {
            this.activeAnnouncement = announcement;
            this.isEditing = true;
        }

        takeAction (data, action) {
            let that = this;
            this.isEditing = false;
            this.activeAnnouncement = undefined;
            switch (action) {
            case 'save':
                this.networkService.modifyAnnouncement(data)
                    .then(() => that.networkService.getAnnouncements(true, true).then(response => that.announcements = response.announcements));
                break;
            case 'create':
                this.networkService.createAnnouncement(data)
                    .then(() => that.networkService.getAnnouncements(true, true).then(response => that.announcements = response.announcements));
                break;
            case 'delete':
                this.networkService.deleteAnnouncement(data.id)
                    .then(() => that.networkService.getAnnouncements(true, true).then(response => that.announcements = response.announcements));
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplAnnouncements', AnnouncementsComponent);
