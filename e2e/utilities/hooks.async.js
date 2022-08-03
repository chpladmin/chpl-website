async function open(path) {
  await browser.maximizeWindow();
  await browser.setWindowSize(1600, 1024);
  await browser.url(path);
}

async function getErrors() {
  return (await $('#action-bar-errors')).getText();
}

export {
  open,
  getErrors,
};
