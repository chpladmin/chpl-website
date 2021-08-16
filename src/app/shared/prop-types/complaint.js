import {
  arrayOf,
  bool,
  number,
  shape,
  string,
} from 'prop-types';
import acb from './acb';

const criterion = shape({
  certificationCriterion: shape({
    certificationEdition: string,
    certificationEditionId: number,
    description: string,
    id: number,
    number: string,
    removed: bool,
    title: string,
  }),
  certificationCriterionId: number,
  complaintId: number,
  id: number,
});

const complainantType = shape({
  description: string,
  id: number,
  name: string,
});

const listing = shape({
  chplProductNumber: string,
  complaintId: number,
  developerName: string,
  id: number,
  listingId: number,
  productName: string,
  versionName: string,
});

const surveillance = shape({
  complaintId: number,
  id: number,
  surveillance: shape({
    certifiedProductId: number,
    chplProductNumber: string,
    endDate: number,
    friendlyId: string,
    id: number,
    numClosedNonconformities: number,
    numOpenNonconformities: number,
    numRandomizedSites: number,
    startDate: number,
    surveillanceType: shape({
      id: number,
      name: string,
    }),
    surveillanceTypeId: number,
    userPermissionId: number,
  }),
  surveillanceId: number,
});

const complaint = shape({
  acbComplaintId: string,
  actions: string,
  certificationBody: acb,
  closedDate: string,
  complainantContacted: bool,
  complainantType,
  complainantTypeOther: string,
  criteria: arrayOf(criterion),
  developerContacted: bool,
  flagForOncReview: bool,
  id: number,
  listings: arrayOf(listing),
  oncAtlContacted: bool,
  oncComplaintId: string,
  receivedDate: string,
  summary: string,
  surveillances: arrayOf(surveillance),
});

export {
  criterion,
  complaint,
  complainantType,
  listing,
};
