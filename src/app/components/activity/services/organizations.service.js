import { compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

const lookup = {
  'root.address': { message: () => 'Address changes:' },
  'root.address.city': { message: (before, after) => comparePrimitive(before, after, 'city', 'City') },
  'root.address.country': { message: (before, after) => comparePrimitive(before, after, 'country', 'Country') },
  'root.address.creationDate': { message: () => undefined },
  'root.address.deleted': { message: () => undefined },
  'root.address.id': { message: () => undefined },
  'root.address.lastModifiedDate': { message: () => undefined },
  'root.address.lastModifiedUser': { message: () => undefined },
  'root.address.state': { message: (before, after) => comparePrimitive(before, after, 'state', 'State') },
  'root.address.streetLineOne': { message: (before, after) => comparePrimitive(before, after, 'streetLineOne', 'Street Line 1') },
  'root.address.streetLineTwo': { message: (before, after) => comparePrimitive(before, after, 'streetLineTwo', 'Street Line 2') },
  'root.address.zipcode': { message: (before, after) => comparePrimitive(before, after, 'zipcode', 'Zipcode') },
  'root.deleted': { message: (before, after) => comparePrimitive(before, after, 'deleted', 'Deleted') },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.retired': { message: (before, after) => comparePrimitive(before, after, 'retired', 'Retired') },
  'root.retirementDate': { message: (before, after) => comparePrimitive(before, after, 'retirementDate', 'Retirement Date', getDisplayDateFormat) },
  'root.website': { message: (before, after) => comparePrimitive(before, after, 'website', 'Website') },
};

const compareOrganization = (prev, curr) => compareObject(prev, curr, lookup);

export { compareOrganization }; // eslint-disable-line import/prefer-default-export
