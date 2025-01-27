import { compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';

const lookup = {
  'root.creationDate': { message: () => undefined },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.productId': { message: () => undefined },
  'root.productName': { message: (before, after) => comparePrimitive(before, after, 'productName', 'Product') },
  'root.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
};

const compareVersion = (prev, curr) => compareObject(prev, curr, lookup);

export { compareVersion }; // eslint-disable-line import/prefer-default-export
