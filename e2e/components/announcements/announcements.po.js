class AnnouncementsComponent {
  constructor() {
    this.elements = {
      addAnnouncementButton: '#add-new-announcement',
      announcementTitle: '#title',
      announcementText: '#text',
      announcementStartDateTime: '#start-date-time',
      announcementEndDateTime: '#end-date-time',
      isPublicToggle: '#is-public',
      announcementsTable: 'table[aria-label="Announcements table"]',
    };
  }

  get addAnnouncementButton() {
    return $(this.elements.addAnnouncementButton);
  }

  get announcementTitle() {
    return $(this.elements.announcementTitle);
  }

  get announcementText() {
    return $(this.elements.announcementText);
  }

  get announcementStartDateTime() {
    return $(this.elements.announcementStartDateTime);
  }

  get announcementEndDateTime() {
    return $(this.elements.announcementEndDateTime);
  }

  get isPublicToggle() {
    return $(this.elements.isPublicToggle);
  }

  get announcementsTable() {
    return $(this.elements.announcementsTable);
  }

  /* eslint-disable indent */
  async getAnnouncements() {
    return (await
            (await
             this.announcementsTable
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */
}

export default AnnouncementsComponent;
