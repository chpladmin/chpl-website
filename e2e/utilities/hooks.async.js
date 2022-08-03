async function open(path) {
  await browser.maximizeWindow();
  await browser.setWindowSize(1600, 1024);
  await browser.url(path);
}

async function getCellValue(row, col) {
  return (await $(`//tbody/tr[${row}]/td[${col}]`)).getText();
}

async function getErrors() {
  return (await $('#action-bar-errors')).getText();
}

async function getTableHeaders() {
  await (await (await $('table')).$('thead')).$$('th');
}

async function getTableRows() {
  await (await (await $('table')).$('tbody')).$$('tr');
}

export {
  open,
  getCellValue,
  getErrors,
  getTableHeaders,
  getTableRows,
};
