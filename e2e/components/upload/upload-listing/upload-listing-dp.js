const inputs = [{
  testName: 'v19 template',
  path: '../../../resources/listings/2015_v19_AQA1.csv',
  message: 'Success',
}, {
  testName: 'v20 template',
  path: '../../../resources/listings/2015_v20_AQA5.csv',
  message: 'Success',
}, {
  testName: 'only required columns template',
  path: '../../../resources/listings/2015_RequiredColumns.csv',
  message: 'Success',
}, {
  testName: 'required columns with criteria',
  path: '../../../resources/listings/2015_WithCriteria.csv',
  message: 'Success',
}, {
  testName: 'empty file',
  path: '../../../resources/listings/2015_EmptyFile.csv',
  message: 'Error',
}, {
  testName: 'some required columns missing',
  path: '../../../resources/listings/2015_WoRequiredColumns.csv',
  message: 'Error',
}, {
  testName: 'required columns with extra bogus columns',
  path: '../../../resources/listings/2015_BogusColumns.csv',
  message: 'Success',
}, {
  testName: 'some of the required column data missing',
  path: '../../../resources/listings/2015_CHPLIDMissing.csv',
  message: 'Error',
}, {
  testName: 'extra rows with blank/null data',
  path: '../../../resources/listings/2015_ExtraRowsBlankData.csv',
  message: 'Success',
}, {
  testName: 'owned by different ACB',
  path: '../../../resources/listings/2015_OwnedByDifferentACB.csv',
  message: 'Error',
}];

export default inputs;
