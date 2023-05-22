import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';

import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
  root: {
    width: '100%',
    padding: '0 8px!important',
  },
  subCard: {
    backgroundColor: `${palette.white}`,
    borderBottom: '.5px solid #c2c6ca',
  },
  NestedAccordionLevelOne: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: ' #c2c6ca',
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: `${palette.white}`,
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: `${palette.secondary}!important`,
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
    width: '100%',
    padding: '0 8px!important',
  },
  NestedAccordionLevelTwoSummary: {
    backgroundColor: `${palette.white}!important`,
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
    width: '100%',
    padding: '0 8px!important',
  },
  '& span.MuiTypography-root.MuiCardHeader-title.MuiTypography-h6.MuiTypography-displayBlock': {
    fontWeight: '300',
  },
});

function ChplCompliance({ directReviews, directReviewsAvailable, surveillance }) {
  const classes = useStyles();

  return (
    <Accordion className={classes.NestedAccordionLevelOne}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.NestedAccordionLevelOneSummary}
        color="secondary"
      >
        <Typography>
          Compliance Activities
        </Typography>
      </AccordionSummary>
      <Box display="flex" flexDirection="column">
        <CardContent>
          <ChplSurveillance surveillance={surveillance} />
          <ChplDirectReviews directReviews={directReviews} directReviewsAvailable={directReviewsAvailable} />
        </CardContent>
      </Box>
    </Accordion>
  );
}

export default ChplCompliance;

ChplCompliance.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
  surveillance: arrayOf(surveillancePropType).isRequired,
};
