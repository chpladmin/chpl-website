module.exports = [
    {
        testName: 'v19 template',
        path: '../../../resources/2015_v19_AQA1.csv',
        message: 'Success',
    },
    {
        testName: 'v18 template',
        path: '../../../resources/2015_v18_AQA2.csv',
        message: 'Success',
    },
    {
        testName: 'only required columns template',
        path: '../../../resources/upload-listing-beta/2015_RequiredColumns.csv' ,
        message: 'Success',
    },
    {
        testName: 'required columns with criteria',
        path: '../../../resources/upload-listing-beta/2015_WithCriteria.csv' ,
        message: 'Success',
    },
    {
        testName: 'empty file',
        path: '../../../resources/upload-listing-beta/2015_EmptyFile.csv' ,
        message: 'Error',
    },
    {
        testName: 'some required columns missing',
        path: '../../../resources/upload-listing-beta/2015_WoRequiredColumns.csv' ,
        message: 'Error',
    },
    {
        testName: 'required columns with extra bogus columns',
        path: '../../../resources/upload-listing-beta/2015_BogusColumns.csv' ,
        message: 'Success',
    },
    {
        testName: 'some of the required column data missing',
        path: '../../../resources/upload-listing-beta/2015_CHPLIDMissing.csv' ,
        message: 'Error',
    },
    {
        testName: 'extra rows with blank/null data',
        path: '../../../resources/upload-listing-beta/2015_ExtraRowsBlankData.csv' ,
        message: 'Success',
    },
    {
        testName: 'owned by different ACB',
        path: '../../../resources/upload-listing-beta/2015_OwnedByDifferentACB.csv' ,
        message: 'Error',
    },

];
