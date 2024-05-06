async function open(path) {
  await browser.maximizeWindow();
  await browser.setWindowSize(1600, 1024);
  await browser.url(path);
}

export {
  open, // eslint-disable-line import/prefer-default-export
};
