class AnnouncementsPage {
  constructor() {
    this.elements = {
      addAnnouncementButton: '#add-new-announcement',
      announcementTitle: '#title',
      announcementText: '#text',
      announcementStartDateTime: '#start-date-time',
      announcementEndDateTime: '#end-date-time',
      isPublicToggle: '#is-public',
      announcementDisplay: '.MuiCardContent-root',
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

  get announcementDisplay() {
    return $(this.elements.announcementDisplay);
  }
}

export default AnnouncementsPage;
