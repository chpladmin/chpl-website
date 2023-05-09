import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { arrayOf } from 'prop-types';

import ChplDirectReviewsView from 'components/direct-reviews/direct-reviews-view';
import { ChplTooltip } from 'components/util';
import { directReview as directReviewPropType } from 'shared/prop-types';
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

function ChplDirectReviews(props) {
  const { directReviews } = props;
  const classes = useStyles();

  return (
    <Accordion className={classes.NestedAccordionLevelOne}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.NestedAccordionLevelOneSummary}
        color="secondary"
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <Typography>
            Direct Review Activities
          </Typography>
          <Typography variant="body2">
            (
            { directReviews.length }
            {' '}
            found)
          </Typography>
        </Box>
      </AccordionSummary>
      <CardContent>
        <Typography gutterBottom>
          Direct Review information is displayed here if a Direct Review has been opened by ONC that either affects this listing directly or applies to the developer of this listing
        </Typography>
        <ChplDirectReviewsView directReviews={directReviews} />
        { directReviews.map((dr) => (
          <Accordion className={classes.NestedAccordionLevelOne}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.NestedAccordionLevelTwoSummary}
              color="secondary"
            >
              <Typography>
                Open Direct Review
              </Typography>
            </AccordionSummary>
            <CardContent>
              <Card>
                <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  className={classes.subCard}
                  title="Non Conformity Type: 170.315(d)(2) Example Text (Cures Update)"
                />
                <CardContent>
                  <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Developer Associated Listings
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Corrective Action Plan Approval date
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Corrective Action Plan Must Be Completed
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Corrective Action Plan was completed
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </CardContent>
          </Accordion>
        ))}
      </CardContent>
    </Accordion>
  );
}

export default ChplDirectReviews;

ChplDirectReviews.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
};
