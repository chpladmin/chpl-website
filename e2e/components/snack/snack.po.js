class SnackComponent {
  constructor() {
    this.elements = {
      snack: '#notistack-snackbar',
    };
  }

  matchesText(text) {
    return $$(this.elements.snack)
      .map((snack) => snack.getText())
      .filter((snack) => new RegExp(text).test(snack))
      .length > 0;
  }

  get snackCount() {
    return $$(this.elements.snack).length;
  }

  clearAllSnacks() {
    $$(this.elements.snack)
      .forEach((snack) => {
        console.log(`clearing snack: "${snack.getText()}"`);
        snack.parentElement().$('button').click();
      });
  }
}

export default SnackComponent;
