import SystemMaintenancePage from '../system-maintenance.po';

class Announcements extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-announcement',
      announcementTitle: '#title',
      itemName: '#text',
      announcementStartDateTime: '#start-date-time',
      announcementEndDateTime: '#end-date-time',
      isPublicToggle: '#is-public',
      dataTable: 'table[aria-label="Announcements table"]',
    };
  }

  get announcementTitle() {
    return $(this.elements.announcementTitle);
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
}

export default Announcements;
