import {
  arrayOf, number, shape, string,
} from 'prop-types';

const developerAssociatedListing = shape({
  id: number,
  chplProductNumber: string,
});

const nonConformity = shape({
  developerAssociatedListings: arrayOf(developerAssociatedListing),
  nonConformityType: string,
  nonConformityStatus: string,
  capApprovalDate: string,
  capMustCompleteDate: string,
  capEndDate: string,
  lastUpdated: number,
  created: number,
});

const directReview = shape({
  nonConformities: arrayOf(nonConformity),
  developerId: number,
  lastUpdated: number,
  created: number,
});

export default directReview;
