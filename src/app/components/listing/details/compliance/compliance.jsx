import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import { arrayOf, bool, func } from 'prop-types';

import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';

import { ListingContext, UserContext } from 'shared/contexts';
import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';

const isIcs = (req) => {
  if (!req.requirementType) { return false; } // req created before ICS type existed
  return req.requirementType.requirementGroupType.name === 'Inherited Certified Status';
};

function ChplCompliance({
  directReviews, directReviewsAvailable, surveillance: initialSurveillance, dispatch,
}) {
  const { listing } = useContext(ListingContext);
  const { hasAnyRole, user } = useContext(UserContext);
  const [surveillance, setSurveillance] = useState([]);
  const [icsSurveillance, setIcsSurveillance] = useState([]);

  useEffect(() => {
    setSurveillance(initialSurveillance.filter((surv) => surv.requirements.some((req) => !isIcs(req))));
    setIcsSurveillance(initialSurveillance.filter((surv) => surv.requirements.every(isIcs)));
  }, [initialSurveillance]);

  const canManageSurveillance = () => {
    if (hasAnyRole(['chpl-admin'])) { return true; }
    if (listing.edition !== null && listing.edition.name !== '2015') { return false; }
    if (hasAnyRole(['chpl-onc-acb']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  return (
    <>
      { canManageSurveillance()
        && (
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
          >
            Initiate Surveillance
          </Button>
        )}
      <ChplSurveillance surveillance={icsSurveillance} ics dispatch={dispatch} />
      <ChplSurveillance surveillance={surveillance} dispatch={dispatch} />
      <ChplDirectReviews directReviews={directReviews} directReviewsAvailable={directReviewsAvailable} />
    </>
  );
}

export default ChplCompliance;

ChplCompliance.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
  surveillance: arrayOf(surveillancePropType).isRequired,
  dispatch: func,
};

ChplCompliance.defaultProps = {
  dispatch: () => {},
};
