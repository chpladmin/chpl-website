import React, { useEffect, useState } from 'react';
import {
  IconButton,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Moment from 'react-moment';
import { arrayOf, string } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { directReview as directReviewType } from 'shared/prop-types';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
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

function ChplDirectReviewsView(props) {
  const [directReviews, setDirectReviews] = useState([]);
  const [fetched, setFetched] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    setDirectReviews(props.directReviews.map((dr) => {
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
          .map((nc) => ({
            ...nc,
            friendlyCapApprovalDate: getDisplayDateFormat(nc.capApprovalDate, 'Has not been determined'),
            friendlyCapMustCompleteDate: getDisplayDateFormat(nc.capMustCompleteDate, 'Has not been determined'),
            friendlyCapEndDate: getDisplayDateFormat(nc.capEndDate, 'Has not been completed'),
          }))
          .sort((a, b) => {
            if (a.capApprovalDate && b.capApprovalDate) {
              if (a.capApprovalDate < b.capApprovalDate) { return 1; }
              if (a.capApprovalDate > b.capApprovalDate) { return -1; }
            }
            if (a.capEndDate && b.capEndDate) {
              if (a.capEndDate < b.capEndDate) { return 1; }
              if (a.capEndDate > b.capEndDate) { return -1; }
            }
            if (a.capEndDate) { return -1; }
            if (b.capEndDate) { return 1; }
            return 0;
          }),
      };
    }).sort(sortDirectReviews));
  }, [props.directReviews]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setFetched(props.fetched);
  }, [props.fetched]); // eslint-disable-line react/destructuring-assignment

  const toggleOpen = (clicked) => {
    setDirectReviews(directReviews
      .filter((dr) => dr.created !== clicked.created)
      .concat({
        ...clicked,
        open: !clicked.open,
      })
      .sort(sortDirectReviews));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="direct-reviews">
        { fetched
          && (
            <Typography>
              Current as of:
              {' '}
              <Moment
                withTitle
                titleFormat="DD MMM yyyy, h:mm a"
                fromNow
              >
                {fetched}
              </Moment>
            </Typography>
          )}
        { directReviews.length === 0
          && (
            <Typography>
              No Direct Reviews have been conducted
            </Typography>
          )}
        { directReviews.map((dr) => (
          <div className="direct-review panel-ai" key={dr.created}>
            <div className={`direct-review__header panel-heading ${dr.isClosed ? 'direct-review__header--closed' : 'direct-review__header--open'}`} role="button" onClick={() => toggleOpen(dr)}>
              <div className="direct-review__header-title">
                { dr.isClosed ? 'Closed' : 'Open' }
                {' '}
                Direct Review
              </div>
              <div className="direct-review__header-nc-summary">{ dr.ncSummary }</div>
              <div className="direct-review__header-toggle"><i className={`fa fa-lg ${dr.open ? 'fa-caret-down' : 'fa-caret-left'}`} /></div>
            </div>
            { dr.open
              && (
                <div className="panel-body">
                  { (!dr.nonConformities || dr.nonConformities.length === 0)
                    && (
                      <>
                        Has not been determined
                      </>
                    )}
                  { dr.nonConformities?.length > 0
                    && (
                      <table className="table table-responsive">
                        <thead>
                          <tr>
                            <th scope="col">
                              Non-Conformity Type
                              <ChplTooltip title="Type of non-conformity found during review">
                                <IconButton className={classes.iconSpacing}>
                                  <InfoIcon color="primary" />
                                </IconButton>
                              </ChplTooltip>
                            </th>
                            <th scope="col">
                              Developer Associated Listings
                              <ChplTooltip title="A listing of other certified products associated with the non-conformity, as applicable">
                                <IconButton className={classes.iconSpacing}>
                                  <InfoIcon color="primary" />
                                </IconButton>
                              </ChplTooltip>
                            </th>
                            <th scope="col">
                              Corrective Action Plan Approval Date
                              <ChplTooltip title="The date that ONC approved the corrective action plan proposed by the developer">
                                <IconButton className={classes.iconSpacing}>
                                  <InfoIcon color="primary" />
                                </IconButton>
                              </ChplTooltip>
                            </th>
                            <th scope="col">
                              Date Corrective Action Must Be Completed
                              <ChplTooltip title="The date that the corrective action must be completed in order to avoid termination of the certified product’s certification status and/or a certification ban of the developer, as applicable">
                                <IconButton className={classes.iconSpacing}>
                                  <InfoIcon color="primary" />
                                </IconButton>
                              </ChplTooltip>
                            </th>
                            <th scope="col">
                              Date Corrective Action Was Completed
                              <ChplTooltip title="The date the corrective action was completed">
                                <IconButton className={classes.iconSpacing}>
                                  <InfoIcon color="primary" />
                                </IconButton>
                              </ChplTooltip>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          { dr.nonConformities.map((nc) => (
                            <tr key={nc.created}>
                              <td>{ nc.nonConformityType ? nc.nonConformityType : 'Has not been determined' }</td>
                              <td>
                                { (!nc.developerAssociatedListings || nc.developerAssociatedListings.length === 0)
                                  && (
                                    <>None</>
                                  )}
                                { nc.developerAssociatedListings?.length > 0
                                  && (
                                    <ul>
                                      { nc.developerAssociatedListings.map((dal) => (
                                        <li key={dal.id}>
                                          <a href={`#/listing/${dal.id}?panel=directReviews`}>{ dal.chplProductNumber }</a>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                              </td>
                              <td>{ nc.friendlyCapApprovalDate }</td>
                              <td>{ nc.friendlyCapMustCompleteDate }</td>
                              <td>{ nc.friendlyCapEndDate }</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
              )}
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}

export default ChplDirectReviewsView;

ChplDirectReviewsView.propTypes = {
  directReviews: arrayOf(directReviewType),
  fetched: string,
};

ChplDirectReviewsView.defaultProps = {
  directReviews: [],
  fetched: undefined,
};
