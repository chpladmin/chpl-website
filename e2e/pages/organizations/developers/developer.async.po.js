class DevelopersPage {
  constructor() {
    this.elements = {
      developersSelect: '#developers',
    };
  }

  async selectDeveloper(developerName) {
    await (await $(this.elements.developersSelect)).click();
    await (await $(this.elements.developersSelect)).addValue(developerName);
    await (await $(`//li[contains(text(),"${developerName}")]`)).click();
  }
}

export default DevelopersPage;
