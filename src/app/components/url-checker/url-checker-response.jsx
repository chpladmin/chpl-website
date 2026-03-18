import React from 'react';
import {
  Box,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
  bool,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

import { ChplLink } from 'components/util';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  root: {
    display: 'grid',
    rowGap: '8px',
    maxWidth: '380px',
  },
  section: {
    display: 'grid',
    rowGap: '6px',
  },
  sectionTitle: {
    fontWeight: 600,
  },
  divider: {
    margin: '2px 0',
  },
  assertionDivider: {
    margin: '4px 0',
  },
  statusRow: {
    display: 'inline-flex',
    alignItems: 'center',
    wordBreak: 'break-word',
  },
  greenIcon: {
    color: 'green',
    marginLeft: '6px',
  },
  redIcon: {
    color: 'red',
    marginLeft: '6px',
  },
});

function ChplUrlCheckerResponse({ response }) {
  const classes = useStyles();

  const displayStatusIcon = (passed) => (passed ? (
    <CheckCircleIcon fontSize="small" className={classes.greenIcon} />
  ) : (
    <CancelIcon fontSize="small" className={classes.redIcon} />
  ));

  return (
    <Box className={classes.root}>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Status:</Typography>
        <Typography className={classes.statusRow}>
          {response.passed ? 'Passed' : 'Failure'}
          {displayStatusIcon(response.passed)}
        </Typography>
        {response.errorMessage
          && (
            <>
              <Typography variant="body2">
                Error Message:
              </Typography>
              <Typography variant="body2">{response.errorMessage}</Typography>
            </>
          )}
      </div>

      <Divider className={classes.divider} />

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>URL:</Typography>
        <Typography variant="body2">
          {response.url}
        </Typography>
      </div>

      <Divider className={classes.divider} />

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Assertions</Typography>
        {response.httpResponseAssertion?.actualValue ? (
          <>
            <Typography variant="body2">
              HTTP Status Code:
            </Typography>
            <Typography variant="body2" className={classes.statusRow}>
              {response.httpResponseAssertion.actualValue}
              {displayStatusIcon(response.httpResponseAssertion?.passed)}
            </Typography>
            <Typography variant="body2">
              <ChplLink
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
                text="Reference for HTTP Status Codes"
                inline
              />
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2">
              No HTTP Status Code Available:
            </Typography>
            <Typography variant="body2" className={classes.statusRow}>
              The HTTP response code could not be retrieved or is unavailable.
              {displayStatusIcon(response.httpResponseAssertion?.passed)}
            </Typography>
          </>
        )}

        <Divider className={classes.assertionDivider} />

        <Typography variant="body2">
          Response Time (in milliseconds):
        </Typography>
        {response.responseTimeAssertion?.actualValue
          ? (
            <Typography variant="body2" className={classes.statusRow}>
              {response.responseTimeAssertion.actualValue}
              {displayStatusIcon(response.responseTimeAssertion?.passed)}
            </Typography>
          ) : (
            <Typography variant="body2" className={classes.statusRow}>
              The response time is empty or unavailable.
              {displayStatusIcon(response.responseTimeAssertion?.passed)}
            </Typography>
          )}

        <Divider className={classes.assertionDivider} />

        {response.bodyNotEmptyAssertion?.actualValue ? (
          <>
            <Typography variant="body2">
              Body Content:
            </Typography>
            <Typography variant="body2" className={classes.statusRow}>
              {response.bodyNotEmptyAssertion.actualValue
                ? response.bodyNotEmptyAssertion.actualValue
                : 'Empty body content'}
              {displayStatusIcon(response.bodyNotEmptyAssertion?.passed)}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2">
              No Content Available:
            </Typography>
            <Typography variant="body2" className={classes.statusRow}>
              The body content is empty or unavailable.
              {displayStatusIcon(response.bodyNotEmptyAssertion?.passed)}
            </Typography>
          </>
        )}
      </div>
    </Box>
  );
}

export default ChplUrlCheckerResponse;

const assertionPropType = shape({
  actualValue: oneOfType([bool, number, string]),
  passed: bool,
});

ChplUrlCheckerResponse.propTypes = {
  response: shape({
    bodyNotEmptyAssertion: assertionPropType,
    errorMessage: string,
    httpResponseAssertion: assertionPropType,
    passed: bool,
    responseTimeAssertion: assertionPropType,
    url: string,
  }).isRequired,
};
