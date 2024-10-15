import {
  arrayOf,
  object,
  oneOfType,
  number,
  shape,
  string,
} from 'prop-types';

import acb from './acb';
import developer from './developer';

const changeRequestType = shape({
  id: number,
  name: string,
});

const changeRequestStatusType = shape({
  id: number,
  name: string,
});

const changeRequestStatus = shape({
  certificationBody: acb,
  changeRequestStatusType,
  comment: string,
  id: number,
  statusChangeDateTime: string,
  userGroupName: string,
});

const changeRequest = shape({
  certificationBodies: arrayOf(acb),
  changeRequestType,
  currentStatus: changeRequestStatus,
  details: object,
  developer,
  id: number,
  statuses: arrayOf(changeRequestStatus),
  submittedDateTime: oneOfType([number, string]),
});

export { changeRequest, changeRequestStatusType };
