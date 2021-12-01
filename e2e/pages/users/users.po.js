class UsersPage {
  constructor() {
    this.elements = {
      title: 'h1=CHPL Users',
      users: 'div[title*=" Information"]',
    };
  }

  get title() {
    return $(this.elements.title);
  }

  getUsers() {
    return $$(this.elements.users);
  }
}

export default UsersPage;
