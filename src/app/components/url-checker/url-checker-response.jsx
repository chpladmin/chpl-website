import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  bool,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

import { ChplLink } from 'components/util';
import { utilStyles } from 'themes';

const styles = {
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
};

function ChplUrlCheckerResponse({ response }) {
  const displayStatusIcon = (passed) => (passed ? (
    <CheckCircleIcon fontSize="small" sx={styles.greenIcon} />
  ) : (
    <CancelIcon fontSize="small" sx={styles.redIcon} />
  ));

  return (
    <Box sx={styles.root}>
      <Box sx={styles.section}>
        <Typography sx={styles.sectionTitle}>Status:</Typography>
        <Typography sx={styles.statusRow}>
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
      </Box>

      <Divider sx={styles.divider} />

      <Box sx={styles.section}>
        <Typography sx={styles.sectionTitle}>URL:</Typography>
        <Typography variant="body2">
          {response.url}
        </Typography>
      </Box>

      <Divider sx={styles.divider} />

      <Box sx={styles.section}>
        <Typography sx={styles.sectionTitle}>Assertions</Typography>
        {response.httpResponseAssertion?.actualValue ? (
          <>
            <Typography variant="body2">
              HTTP Status Code:
            </Typography>
            <Typography variant="body2" sx={styles.statusRow}>
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
            <Typography variant="body2" sx={styles.statusRow}>
              The HTTP response code could not be retrieved or is unavailable.
              {displayStatusIcon(response.httpResponseAssertion?.passed)}
            </Typography>
          </>
        )}

        <Divider sx={styles.assertionDivider} />

        <Typography variant="body2">
          Response Time (in milliseconds):
        </Typography>
        {response.responseTimeAssertion?.actualValue
          ? (
            <Typography variant="body2" sx={styles.statusRow}>
              {response.responseTimeAssertion.actualValue}
              {displayStatusIcon(response.responseTimeAssertion?.passed)}
            </Typography>
          ) : (
            <Typography variant="body2" sx={styles.statusRow}>
              The response time is empty or unavailable.
              {displayStatusIcon(response.responseTimeAssertion?.passed)}
            </Typography>
          )}

        <Divider sx={styles.assertionDivider} />

        {response.bodyNotEmptyAssertion?.actualValue ? (
          <>
            <Typography variant="body2">
              Body Content:
            </Typography>
            <Typography variant="body2" sx={styles.statusRow}>
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
            <Typography variant="body2" sx={styles.statusRow}>
              The body content is empty or unavailable.
              {displayStatusIcon(response.bodyNotEmptyAssertion?.passed)}
            </Typography>
          </>
        )}
      </Box>
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
