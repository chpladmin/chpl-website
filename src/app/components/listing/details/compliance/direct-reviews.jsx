import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { arrayOf, bool } from 'prop-types';

import { getDataDisplay } from './compliance.services';

import { getDisplayDateFormat } from 'services/date-util';
import { directReview as directReviewPropType } from 'shared/prop-types';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  subCard: {
    backgroundColor: palette.white,
    borderBottom: `.5px solid ${palette.divider}`,
    display: 'flex',
    flexDirection: 'row',
    padding: '16px 16px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directReviews: {
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: palette.white,
  },
  directReviewsSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 4px',
  },
  directReviewSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 4px',
  },
  dataContainer: {
    display: 'flex',
    gridGap: '8px',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  errorChip: {
    color: palette.white,
    backgroundColor: palette.error,
  },
  labelAndData: {
    display: 'flex',
    gridGap: '8px',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('lg')]: {
      width: '48%',
    },
  },
  ncContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  ncContent: {
    display: 'flex',
    gridGap: '8px',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
});

const getFriendlyValues = (nc) => ({
  ...nc,
  friendlyCapApprovalDate: getDisplayDateFormat(nc.capApprovalDate, nc.capApprovalDate),
  friendlyCapMustCompleteDate: getDisplayDateFormat(nc.capMustCompleteDate, nc.capMustCompleteDate),
  friendlyCapEndDate: getDisplayDateFormat(nc.capEndDate, nc.capEndDate),
});

const sortDirectReviews = (a, b) => {
  if (a.endDate && b.endDate) {
    return a.endDate < b.endDate ? 1 : -1;
  }
  if (!a.endDate && !b.endDate) {
    return a.startDate < b.startDate ? 1 : -1;
  }
  return a.endDate ? 1 : -1;
};

const sortNonconformities = (a, b) => {
  if (a.nonConformityStatus !== b.nonConformityStatus) {
    return a.nonConformityStatus === 'Open' ? -1 : 1;
  }
  return a.created - b.created;
};

function ChplDirectReviews({ directReviews: initialDirectReviews, directReviewsAvailable }) {
  const [directReviews, setDirectReviews] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setDirectReviews(initialDirectReviews.map((dr) => {
      const open = dr.nonConformities
        .filter((nc) => nc.nonConformityStatus === 'Open')
        .length;
      const total = dr.nonConformities.length;
      let { ncSummary } = dr;
      if (open > 0) {
        ncSummary = `${open} open / ${total}`;
      } else if (total > 0) {
        ncSummary = `${total} closed`;
      } else {
        ncSummary = 'no';
      }
      ncSummary += ` non-conformit${total !== 1 ? 'ies' : 'y'} found`;
      const startDate = dr.nonConformities
        .filter((nc) => nc.capApprovalDate)
        .sort((a, b) => (a.capApprovalDate < b.capApprovalDate ? -1 : 1))[0]?.capApprovalDate;
      const endDates = dr.nonConformities
        .filter((nc) => nc.capApprovalDate)
        .filter((nc) => nc.capEndDate)
        .sort((a, b) => (a.capEndDate > b.capEndDate ? -1 : 1));
      const endDate = open === 0 && endDates[0]?.capEndDate;
      return {
        ...dr,
        startDate,
        endDate,
        ncSummary,
        isClosed: !!endDate,
        nonConformities: dr.nonConformities
          .map(getFriendlyValues)
          .sort(sortNonconformities),
      };
    }).sort(sortDirectReviews));
  }, [initialDirectReviews]);

  const getIcon = () => (expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      className={classes.directReviews}
      onChange={handleAccordionChange}
    >
      <AccordionSummary
        expandIcon={getIcon()}
        className={classes.directReviewsSummary}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <Typography variant="body1">
            Direct Review Activities
          </Typography>
          { directReviewsAvailable
            && (
              <Typography variant="body2">
                (
                { directReviews.length }
                {' '}
                found)
              </Typography>
            )}
          { !directReviewsAvailable
            && (
              <Chip size="small" className={classes.errorChip} variant="default" label="Error" />
            )}
        </Box>
      </AccordionSummary>
      <CardContent>
        { directReviewsAvailable
          && (
            <Typography gutterBottom>
              Direct Review information is displayed here if a Direct Review has been opened by ONC that either affects this listing directly or applies to the developer of this listing
            </Typography>
          )}
        { !directReviewsAvailable
          && (
            <Typography gutterBottom>
              Direct Review information is not currently available, please check back later
            </Typography>
          )}
        { directReviewsAvailable && directReviews.length === 0
          && (
            <Typography>
              No Direct Reviews have been conducted
            </Typography>
          )}
        { directReviews.map((dr) => (
          <Accordion className={classes.directReviews} key={dr.created}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.directReviewSummary}
              color="secondary"
            >
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                <Typography variant="body1">
                  { dr.isClosed ? 'Closed' : 'Open' }
                  {' '}
                  Direct Review
                </Typography>
                <Typography>
                  { dr.ncSummary }
                </Typography>
              </Box>
            </AccordionSummary>
            <CardContent>
              { (!dr.nonConformities || dr.nonConformities.length === 0)
                && (
                  <Typography>
                    Has not been determined
                  </Typography>
                )}
              { dr.nonConformities.map((nc) => (
                <Card key={nc.created}>
                  <CardHeader
                    titleTypographyProps={{ variant: 'h6' }}
                    className={classes.subCard}
                    title={nc.nonConformityType ? nc.nonConformityType : 'Has not been determined'}
                  />
                  <CardContent>
                    <Box className={classes.ncContent}>
                      { getDataDisplay('Non-conformity Type', <Typography>{ nc.nonConformityType }</Typography>, 'Type of non-conformity found during review') }
                      { getDataDisplay('Developer Associated Listings',
                        <>
                          {(!nc.developerAssociatedListings || nc.developerAssociatedListings.length === 0)
                           && (
                             <Typography>
                               None
                             </Typography>
                           )}
                          { nc.developerAssociatedListings?.length > 0
                            && (
                              <List>
                                { nc.developerAssociatedListings.map((dal) => (
                                  <ListItem key={dal.id}>
                                    <a href={`#/listing/${dal.id}`}>{ dal.chplProductNumber }</a>
                                  </ListItem>
                                ))}
                              </List>
                            )}
                        </>,
                        'A listing of other certified products associated with the non-conformity, as applicable') }
                      { getDataDisplay('Corrective Action Plan Approval Date', <Typography>{ nc.friendlyCapApprovalDate }</Typography>, 'The date that ONC approved the corrective action plan proposed by the developer') }
                      { getDataDisplay('Date Corrective Action Must Be Completed', <Typography>{ nc.friendlyCapMustCompleteDate }</Typography>, 'The date that the corrective action must be completed in order to avoid termination of the certified product’s certification status and/or a certification ban of the developer, as applicable') }
                      { getDataDisplay('Date Corrective Action Was Completed', <Typography>{ nc.friendlyCapEndDate }</Typography>, 'The date the corrective action was completed') }
                    </Box>
                  </CardContent>
                </Card>
              ))}
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
  directReviewsAvailable: bool.isRequired,
};
