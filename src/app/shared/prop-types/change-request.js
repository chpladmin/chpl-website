import {
  arrayOf, object, number, shape, string,
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
  statusChangeDate: number,
  userPermission: shape({
    authority: string,
    description: string,
    id: number,
    name: string,
  }),
});

const changeRequest = shape({
  certificationBodies: arrayOf(acb),
  changeRequestType: changeRequestType,
  currentStatus: changeRequestStatus,
  details: object,
  developer: developer,
  id: number,
  statuses: arrayOf(changeRequestStatus),
  submittedDate: number,
});

export { changeRequest, changeRequestStatusType };
