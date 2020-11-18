module.exports = [
    {
        testName: 'v19 template',
        path: '../../../resources/2015_v19_AQA1.csv',
        message: 'was uploaded successfully. 1 pending products are ready for confirmation.',
    },
    {
        testName: 'v18 template',
        path: '../../../resources/2015_v18_AQA2.csv',
        message: 'was uploaded successfully. 1 pending products are ready for confirmation.',
    },
    {
        testName: 'only required columns template',
        path: '../../../resources/upload-listing-beta/2015_RequiredColumns.csv' ,
        message: '',
    },
    {
        testName: 'required columns with criteria',
        path: '../../../resources/upload-listing-beta/2015_WithCriteria.csv' ,
        message: '',
    },
    {
        testName: 'empty file',
        path: '../../../resources/upload-listing-beta/2015_EmptyFile.csv' ,
        message: '',
    },
    {
        testName: 'some required columns missing',
        path: '../../../resources/upload-listing-beta/2015_WoRequiredColumns.csv' ,
        message: '',
    },
    {
        testName: 'extra bogus columns',
        path: '../../../resources/upload-listing-beta/2015_BogusColumns.csv' ,
        message: '',
    },
    {
        testName: 'some of the data missing',
        path: '../../../resources/upload-listing-beta/2015_CHPLIDMissing.csv' ,
        message: '',
    },
    {
        testName: 'extra rows with blank/null data',
        path: '../../../resources/upload-listing-beta/2015_ExtraRowsBlankData.csv' ,
        message: '',
    },
    {
        testName: 'owned by different ACB',
        path: '../../../resources/upload-listing-beta/2015_OwnedByDifferentACB.csv' ,
        message: '',
    },

];
