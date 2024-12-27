import React, { useEffect, useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import { arrayOf, bool, func } from 'prop-types';

import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';

import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';

const isIcs = (req) => {
  if (!req.requirementType) { return false; } // req created before ICS type existed
  return req.requirementType.requirementGroupType.name === 'Inherited Certified Status';
};

function ChplCompliance({ directReviews, directReviewsAvailable, surveillance: initialSurveillance, dispatch }) {
  const [surveillance, setSurveillance] = useState([]);
  const [icsSurveillance, setIcsSurveillance] = useState([]);

  useEffect(() => {
    setSurveillance(initialSurveillance.filter((surv) => surv.requirements.some((req) => !isIcs(req))));
    setIcsSurveillance(initialSurveillance.filter((surv) => surv.requirements.every(isIcs)));
  }, [initialSurveillance]);

  return (
    <>
      <Button
        onClick={() => dispatch({ action: 'edit', payload: {} })}
      >Initiate Surveillance</Button>
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
